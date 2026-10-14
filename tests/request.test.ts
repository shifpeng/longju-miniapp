import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { request, clearSession, ApiError, session, logout } from '../src/api/request';
import { Intent } from '../src/lib/intent';
import { api } from '../src/api/client';
const values = new Map<string, unknown>();
let calls: any[] = [];
let loginCount = 0;
let handle: (o: any) => void;
(globalThis as any).wx = {
  getStorageSync: (k: string) => values.get(k),
  setStorageSync: (k: string, v: unknown) => values.set(k, v),
  removeStorageSync: (k: string) => values.delete(k),
  getAccountInfoSync: () => ({ miniProgram: { envVersion: 'develop' } }),
  login: (o: any) => {
    loginCount++;
    queueMicrotask(() => o.success({ code: 'one-use-code' }));
  },
  request: (o: any) => {
    calls.push(o);
    queueMicrotask(() => handle(o));
  },
  getRandomValues: (o: any) => {
    const b = randomBytes(16);
    o.success({ randomValues: b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) });
  },
};
const ok = (o: any, data: unknown) =>
  o.success({
    statusCode: 200,
    header: {},
    data: { data, requestId: 'request-id', serverTime: new Date().toISOString() },
  });
const error = (o: any, status: number, code: string) =>
  o.success({
    statusCode: status,
    header: { 'Retry-After': '12' },
    data: { error: { code, message: '业务错误', retryable: false }, requestId: 'trace' },
  });
function setSession(
  token = 'old',
  userId = '9007199254740999',
  expiresAt = '2099-01-01T00:00:00Z',
) {
  values.set('longju.session.v1', { accessToken: token, userId, expiresAt });
}
function loginResponse(o: any, userId = '9007199254740999') {
  ok(o, {
    accessToken: 'new',
    expiresAt: '2099-01-01T00:00:00Z',
    user: { id: userId },
    qualification: 'NONE',
  });
}
beforeEach(() => {
  clearSession();
  calls = [];
  loginCount = 0;
  handle = (o) => ok(o, {});
});
test('public dictionaries do not leak a stored token; IDs remain strings', async () => {
  setSession();
  handle = (o) => ok(o, [{ code: '620000', name: '甘肃省' }]);
  await api.regions();
  assert.equal(calls[0].header.Authorization, undefined);
  assert.equal(session()?.userId, '9007199254740999');
});
test('concurrent 401s perform one login and replay original key/version/body', async () => {
  setSession();
  handle = (o) =>
    o.url.endsWith('/auth/wechat')
      ? loginResponse(o)
      : o.header.Authorization === 'Bearer old'
        ? error(o, 401, 'SESSION_EXPIRED')
        : ok(o, { done: true });
  const options = {
    method: 'POST' as const,
    data: { confirmed: true },
    version: 7,
    key: 'fixed-uuid',
  };
  await Promise.all([request('/one', options), request('/two', options)]);
  assert.equal(loginCount, 1);
  for (const c of calls.filter((c) => !c.url.endsWith('/auth/wechat'))) {
    assert.equal(c.header['If-Match'], '"7"');
    assert.equal(c.header['Idempotency-Key'], 'fixed-uuid');
    assert.deepEqual(c.data, { confirmed: true });
  }
  assert.equal(calls.find((c) => c.url.endsWith('/auth/wechat')).header.Authorization, undefined);
});
test('second 401 is not looped; invalid session is cleared', async () => {
  setSession();
  handle = (o) =>
    o.url.endsWith('/auth/wechat') ? loginResponse(o) : error(o, 401, 'SESSION_EXPIRED');
  await assert.rejects(request('/me'), { status: 401 });
  assert.equal(loginCount, 1);
  assert.equal(session(), null);
});
test('403 and 409 do not retry or reauthenticate; Retry-After is exposed', async () => {
  setSession();
  handle = (o) => error(o, 409, 'VERSION_CONFLICT');
  await assert.rejects(
    request('/write', { method: 'POST' }),
    (e: unknown) => e instanceof ApiError && e.code === 'VERSION_CONFLICT' && e.retryAfter === 12,
  );
  assert.equal(calls.length, 1);
  assert.equal(loginCount, 0);
});
test('network timeout does not automatically duplicate a write', async () => {
  setSession();
  handle = (o) => o.fail({});
  await assert.rejects(request('/write', { method: 'POST' }), { code: 'NETWORK_ERROR' });
  assert.equal(calls.length, 1);
});
test('never replay a private write for a different user after login', async () => {
  setSession();
  handle = (o) =>
    o.url.endsWith('/auth/wechat') ? loginResponse(o, '2') : error(o, 401, 'SESSION_EXPIRED');
  await assert.rejects(request('/write', { method: 'POST' }), { code: 'ACCOUNT_CHANGED' });
  assert.equal(calls.filter((c) => c.url.endsWith('/write')).length, 1);
});
test('expired session changing user is rejected before original write', async () => {
  setSession('old', '1', '2000-01-01T00:00:00Z');
  handle = (o) => loginResponse(o, '2');
  await assert.rejects(request('/write', { method: 'POST' }), { code: 'ACCOUNT_CHANGED' });
  assert.equal(calls.length, 1);
});
test('discard a response arriving after logout', async () => {
  setSession();
  handle = (o) => {
    clearSession();
    ok(o, { name: 'private' });
  };
  await assert.rejects(request('/me'), { code: 'ACCOUNT_CHANGED' });
});
test('logout never logs the user back in', async () => {
  setSession();
  handle = (o) => error(o, 401, 'SESSION_REVOKED');
  await logout();
  assert.equal(loginCount, 0);
  assert.equal(session(), null);
});
test('intent retains UUID on unknown outcome, changes on edited payload, honors rate limit', async () => {
  const i = new Intent();
  const key = await i.for({ count: 1 });
  assert.match(key, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  i.failed(new ApiError('NETWORK_ERROR', 'timeout'));
  assert.equal(await i.for({ count: 1 }), key);
  assert.notEqual(await i.for({ count: 2 }), key);
  i.failed(new ApiError('RATE_LIMITED', 'wait', 429, 12));
  await assert.rejects(i.for({ count: 2 }), /秒后重试/);
});
test('directory search uses contract query parameter and encodes text', async () => {
  setSession();
  await api.members(2, '张 & 李');
  assert.ok(calls[0].url.endsWith('page=2&query=%E5%BC%A0%20%26%20%E6%9D%8E'));
});
test('unsupported PATCH fails explicitly instead of silently sending GET', async () => {
  setSession();
  await assert.rejects(request('/me/profile', { method: 'PATCH', data: {} }), {
    code: 'METHOD_UNSUPPORTED',
  });
  assert.equal(calls.length, 0);
});

test('Retry-After blocks a repeated call without sending another HTTP request', async () => {
  setSession();
  handle = (o) => error(o, 429, 'RATE_LIMITED');
  await assert.rejects(request('/rate-limited-action', { method: 'POST' }), { status: 429 });
  await assert.rejects(request('/rate-limited-action', { method: 'POST' }), { status: 429 });
  assert.equal(calls.length, 1);
});

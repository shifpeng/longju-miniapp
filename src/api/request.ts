import { runtime } from '../config/runtime';
import type { Schema } from './types';

interface Session {
  accessToken: string;
  expiresAt: string;
  userId: string;
}
interface Envelope<T> {
  data: T;
  requestId: string;
  serverTime: string;
}
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH';
  data?: object;
  auth?: 'public' | 'optional' | 'required';
  version?: number;
  key?: string;
}
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 0,
    public retryAfter = 0,
    public requestId = '',
    public fieldErrors: Schema['FieldError'][] = [],
  ) {
    super(message);
  }
}
let loginPromise: Promise<void> | undefined;
let epoch = 0;
let clockOffset = 0;
const rateLimits = new Map<string, number>();
export function serverNow() {
  return Date.now() + clockOffset;
}
const storageKey = 'longju.session.v1';
export function session(): Session | null {
  const value = wx.getStorageSync(storageKey) as Session | undefined;
  return value?.accessToken ? value : null;
}
export function clearSession() {
  epoch++;
  wx.removeStorageSync(storageKey);
}
export function isLoggedIn() {
  return !!session();
}
export function wechatCode(): Promise<string> {
  return new Promise((resolve, reject) =>
    wx.login({
      success: (r) =>
        r.code ? resolve(r.code) : reject(new ApiError('LOGIN_FAILED', '微信登录失败，请重试')),
      fail: () => reject(new ApiError('LOGIN_FAILED', '微信登录失败，请重试')),
    }),
  );
}
export function login(): Promise<void> {
  if (loginPromise) return loginPromise;
  const startEpoch = epoch;
  loginPromise = (async () => {
    const code = await wechatCode();
    const result = await raw<Schema['WechatLoginResult']>(
      '/auth/wechat',
      { method: 'POST', data: { code }, auth: 'public' },
      null,
    );
    if (epoch !== startEpoch) throw new ApiError('SESSION_CHANGED', '登录状态已变更，请重试');
    wx.setStorageSync(storageKey, {
      accessToken: result.data.accessToken,
      expiresAt: result.data.expiresAt,
      userId: result.data.user.id,
    });
  })().finally(() => {
    loginPromise = undefined;
  });
  return loginPromise;
}
function raw<T>(path: string, options: RequestOptions, token: string | null): Promise<Envelope<T>> {
  if (options.method === 'PATCH')
    return Promise.reject(new ApiError('METHOD_UNSUPPORTED', '资料保存正在接入，请稍后重试'));
  const method = options.method || 'GET';
  const limitKey = method + ':' + path;
  const waitUntil = rateLimits.get(limitKey) || 0;
  if (waitUntil > Date.now())
    return Promise.reject(
      new ApiError('RATE_LIMITED', '操作过于频繁', 429, Math.ceil((waitUntil - Date.now()) / 1000)),
    );
  rateLimits.delete(limitKey);
  const env = wx.getAccountInfoSync().miniProgram.envVersion;
  if (env !== 'develop' && !/^https:\/\//.test(runtime.apiOrigin))
    return Promise.reject(new ApiError('CONFIG_REQUIRED', '服务地址尚未配置'));
  const header: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) header.Authorization = `Bearer ${token}`;
  if (options.version !== undefined) header['If-Match'] = `"${options.version}"`;
  if (options.key) header['Idempotency-Key'] = options.key;
  return new Promise((resolve, reject) =>
    wx.request<Envelope<T> & Partial<Schema['ErrorResponse']>>({
      url: runtime.apiOrigin + '/api/v1/app' + path,
      method,
      data: options.data,
      header,
      timeout: 15000,
      success: (r) => {
        if (r.statusCode >= 200 && r.statusCode < 300 && r.data && 'data' in r.data) {
          const time = Date.parse(r.data.serverTime);
          if (Number.isFinite(time)) clockOffset = time - Date.now();
          return resolve(r.data);
        }
        const error = r.data?.error;
        const seconds = Number(r.header['Retry-After'] ?? r.header['retry-after'] ?? 0);
        if (r.statusCode === 429 && Number.isFinite(seconds) && seconds > 0)
          rateLimits.set(limitKey, Date.now() + seconds * 1000);
        reject(
          new ApiError(
            error?.code || 'REQUEST_FAILED',
            error?.message || '请求失败，请稍后重试',
            r.statusCode,
            Number.isFinite(seconds) ? seconds : 0,
            r.data?.requestId,
            error?.fieldErrors,
          ),
        );
      },
      fail: () => reject(new ApiError('NETWORK_ERROR', '网络连接失败，请检查网络后重试')),
    }),
  );
}
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const auth = options.auth || 'required';
  if (auth === 'required' && !session()) await login();
  let current = auth === 'public' ? null : session();
  const userId = current?.userId;
  if (current && Date.parse(current.expiresAt) <= serverNow()) {
    await login();
    current = session();
  }
  if (userId && current?.userId !== userId)
    throw new ApiError('ACCOUNT_CHANGED', '登录账号已变化，请返回后重新操作');
  const verifyOwner = () => {
    if (current && session()?.userId !== current.userId)
      throw new ApiError('ACCOUNT_CHANGED', '登录状态已变化，请重新操作');
  };
  try {
    const result = await raw<T>(path, options, current?.accessToken || null);
    verifyOwner();
    return result.data;
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || auth === 'public') throw error;
    // Concurrent 401 responses share one login. Never discard a newer session.
    if (session()?.accessToken === current?.accessToken) clearSession();
    if (!session()) await login();
    if (userId && session()?.userId !== userId)
      throw new ApiError('ACCOUNT_CHANGED', '登录账号已变化，请返回后重新操作');
    try {
      const result = await raw<T>(path, options, session()?.accessToken || null);
      verifyOwner();
      return result.data;
    } catch (retryError) {
      if (retryError instanceof ApiError && retryError.status === 401) clearSession();
      throw retryError;
    }
  }
}
export async function logout() {
  const current = session();
  if (current) {
    try {
      await raw('/auth/logout', { method: 'POST' }, current.accessToken);
    } catch (e) {
      if (!(e instanceof ApiError) || e.status !== 401) throw e;
    }
  }
  clearSession();
}
export function query(values: Record<string, string | number | undefined>) {
  return Object.entries(values)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
}
export function errorText(error: unknown): string {
  if (error instanceof ApiError) {
    const fields = error.fieldErrors.map((f) => f.message).join('；');
    return (
      (fields || error.message) + (error.retryAfter ? `，请 ${error.retryAfter} 秒后重试` : '')
    );
  }
  return error instanceof Error ? error.message : '暂时无法完成，请稍后重试';
}

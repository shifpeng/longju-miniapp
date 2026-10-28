import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let definition: any;
let owner = '1';
(globalThis as any).Page = (value: any) => {
  definition = value;
};
(globalThis as any).wx = {
  getStorageSync: () => (owner ? { userId: owner, accessToken: 'test' } : null),
  stopPullDownRefresh() {},
};
const { api } = require('../dist/api/client.js');
const { ApiError } = require('../dist/api/request.js');
function page(name: string) {
  delete require.cache[require.resolve(`../dist/pages/${name}/index.js`)];
  require(`../dist/pages/${name}/index.js`);
  return {
    ...definition,
    data: structuredClone(definition.data),
    setData(value: any) {
      Object.assign(this.data, value);
    },
  };
}
function deferred() {
  let resolve!: (value: any) => void;
  const promise = new Promise<any>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
test('mine keeps identity during refresh, updates profile, and ignores a response after logout', async () => {
  owner = '1';
  const p = page('mine');
  api.me = async () => ({ qualification: 'ACTIVE', profile: { name: '老乡' } });
  await p.load();
  const pending = deferred();
  api.me = () => pending.promise;
  const refresh = p.load();
  assert.equal(p.data.identityName, '老乡');
  assert.equal(p.data.me.qualification, 'ACTIVE');
  assert.equal(p.data.loaded, true);
  pending.resolve({ qualification: 'ACTIVE', profile: { name: '新姓名' } });
  await refresh;
  assert.equal(p.data.identityName, '新姓名');
  const stale = deferred();
  api.me = () => stale.promise;
  const old = p.load();
  owner = '';
  await p.load();
  stale.resolve({ qualification: 'ACTIVE', profile: { name: '旧账号' } });
  await old;
  assert.equal(p.data.me, null);
  assert.equal(p.data.loggedIn, false);
  owner = '1';
});
test('activity list refresh keeps visible pages and retries the same refresh after failure', async () => {
  const p = page('activities');
  api.activities = async (n: number) => ({
    items: [{ id: String(n), title: `活动${n}` }],
    page: n,
    total: 2,
  });
  await p.load(true);
  await p.load(false);
  const old = p.data.items;
  const first = deferred();
  const reads: number[] = [];
  api.activities = async (n: number) => {
    reads.push(n);
    if (n === 1) return first.promise;
    return { items: [{ id: '2', title: '第二页' }], page: 2, total: 2 };
  };
  const refresh = p.load(true);
  assert.equal(p.data.items, old);
  assert.equal(p.data.page, 2);
  first.resolve({ items: [{ id: '1', title: '更新后' }], page: 1, total: 2 });
  await refresh;
  assert.deepEqual(reads, [1, 2]);
  assert.equal(p.data.items[1].title, '第二页');
  api.activities = async () => {
    throw new Error('网络失败');
  };
  await p.load(true);
  assert.equal(p.data.items.length, 2);
  assert.equal(p.retryReset, true);
  const retries: boolean[] = [];
  p.load = async (reset: boolean) => {
    retries.push(reset);
  };
  p.retry();
  p.loadMore();
  assert.deepEqual(retries, [true, false]);
});
test('late activity response cannot overwrite a newly selected filter', async () => {
  const p = page('activities');
  const stale = deferred();
  api.activities = (_n: number, filter: string) =>
    filter === '' ? stale.promise : Promise.resolve({ items: [{ id: '2' }], page: 1, total: 1 });
  const old = p.load(true);
  p.setData({ lifecycle: 'ENDED' });
  await p.load(true);
  stale.resolve({ items: [{ id: '1' }], page: 1, total: 1 });
  await old;
  assert.equal(p.data.items[0].id, '2');
});
test('member refresh keeps existing results on network error and removes them on lost qualification', async () => {
  owner = '1';
  const p = page('members');
  p.owner = owner;
  p.setData({
    items: [{ id: '1', name: '老乡' }],
    permitted: true,
    checked: true,
    loaded: true,
    page: 1,
    total: 1,
  });
  const pending = deferred();
  api.me = () => pending.promise;
  const refresh = p.load(true);
  assert.equal(p.data.items.length, 1);
  assert.equal(p.data.permitted, true);
  pending.resolve({ qualification: 'ACTIVE' });
  api.members = async () => {
    throw new Error('网络失败');
  };
  await refresh;
  assert.equal(p.data.items.length, 1);
  api.me = async () => ({ qualification: 'DISABLED' });
  await p.load(true);
  assert.equal(p.data.items.length, 0);
  assert.equal(p.data.permitted, false);
});
test('registration list retains rows while refreshing and displays cancellation result', async () => {
  const p = page('registrations');
  api.activity = async () => ({ title: '相聚' });
  api.registrations = async () => ({
    items: [{ id: '1', activityId: '2', status: 'ACTIVE' }],
    page: 1,
    total: 1,
  });
  await p.load(true);
  const pending = deferred();
  api.registrations = () => pending.promise;
  const refresh = p.load(true);
  assert.equal(p.data.items[0].label, '报名成功');
  pending.resolve({
    items: [{ id: '1', activityId: '2', status: 'CANCELLED' }],
    page: 1,
    total: 1,
  });
  await refresh;
  assert.equal(p.data.items[0].label, '报名已取消');
  api.registrations = async () => {
    throw new ApiError('FORBIDDEN', '不可访问', 403);
  };
  await p.load(true);
  assert.equal(p.data.items.length, 0);
});
test('custom cancel dialog dismisses without writes and confirmation submits once with version and intent', async () => {
  const p = page('registration');
  p.setData({ registration: { id: '7', version: 3, participantCount: 2 }, canCancel: true });
  const pending = deferred();
  const calls: any[] = [];
  p.intent = { for: async () => 'same-key', clear() {}, failed() {} };
  api.cancel = (...args: any[]) => {
    calls.push(args);
    return pending.promise;
  };
  let reloads = 0;
  p.load = async () => {
    reloads++;
  };
  p.cancel();
  assert.equal(p.data.cancelDialog, true);
  assert.equal(p.data.saving, false);
  p.dismissCancel();
  await p.confirmCancel();
  assert.equal(calls.length, 0);
  p.cancel();
  const request = p.confirmCancel();
  await p.confirmCancel();
  pending.resolve({});
  await request;
  assert.deepEqual(calls, [['7', 3, 'same-key']]);
  assert.equal(reloads, 1);
  assert.equal(p.data.saving, false);
});

test('activity return reuses valid image tickets, renews expired links, and clears withdrawn recap', async () => {
  owner = '1';
  const p = page('activity');
  let recapVersion = 1;
  let published = true;
  let tickets = 0;
  api.activity = async () => ({
    id: '8',
    version: 1,
    lifecycle: 'ENDED',
    coverAssetId: '10',
    allowedActions: [],
  });
  api.recap = async () =>
    published
      ? { state: 'PUBLISHED', version: recapVersion, photos: [{ assetId: '11' }] }
      : { state: 'PREPARING' };
  api.tickets = async (input: any) => {
    tickets++;
    return {
      expiresAt: new Date(Date.now() + 300_000).toISOString(),
      items: input.items.map((item: any) => ({
        assetId: item.assetId,
        url: `https://example.test/${item.assetId}?v=${tickets}`,
      })),
    };
  };
  await p.load();
  assert.equal(tickets, 2);
  const cover = p.data.cover;
  const photo = p.data.photos[0].url;
  await p.load();
  assert.equal(tickets, 2);
  assert.equal(p.data.cover, cover);
  assert.equal(p.data.photos[0].url, photo);
  p.coverRenewAt = p.photosRenewAt = 0;
  await p.load();
  assert.equal(tickets, 4);
  recapVersion++;
  await p.load();
  assert.equal(tickets, 5);
  published = false;
  await p.load();
  assert.deepEqual(p.data.photos, []);
  assert.equal(p.data.recap.state, 'PREPARING');
});

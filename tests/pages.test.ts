import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let definition: any;
(globalThis as any).Page = (page: any) => {
  definition = page;
};
(globalThis as any).wx = {
  stopPullDownRefresh() {},
  showToast() {},
  getStorageSync() {
    return null;
  },
  navigateTo() {},
  switchTab() {},
};
const { api } = require('../dist/api/client.js');
const { ApiError } = require('../dist/api/request.js');
const { Intent } = require('../dist/lib/intent.js');
function page(name: string) {
  delete require.cache[require.resolve('../dist/pages/' + name + '/index.js')];
  require('../dist/pages/' + name + '/index.js');
  const instance = {
    ...definition,
    data: structuredClone(definition.data),
    setData(update: any) {
      Object.assign(this.data, update);
    },
  };
  return instance;
}
test('home keeps real application state when activity service fails', async () => {
  const p = page('home');
  api.announcements = async () => ({ items: [{ id: '8', title: '有效公告' }] });
  api.activities = async () => {
    throw new ApiError('TEMPORARILY_UNAVAILABLE', '活动服务不可用', 503);
  };
  await p.load();
  assert.equal(p.data.announcements.length, 1);
  assert.equal(p.data.activities.length, 0);
  assert.match(p.data.error, /活动服务不可用/);
});
test('application timeout preserves fields and agreement; conflict prevents blind resubmission', async () => {
  const { runtime } = require('../dist/config/runtime.js');
  runtime.agreement = { version: 'test-only', body: '仅测试使用', title: '协议' };
  const p = page('application');
  const profile = {
    name: '测试姓名',
    phone: '13800138000',
    hometownCode: '620102',
    residenceCode: '610113',
    industryCode: 'I',
    introduction: '保留内容',
  };
  p.setData({ profile, accepted: true, agreementReady: true, canSubmit: true });
  p.intent = { for: async () => 'same-key', failed() {}, clear() {} };
  api.submitApplication = async () => {
    throw new ApiError('NETWORK_ERROR', '网络连接失败');
  };
  await p.submit();
  assert.deepEqual(p.data.profile, profile);
  assert.equal(p.data.accepted, true);
  assert.equal(p.data.saving, false);
  api.submitApplication = async () => {
    throw new ApiError('VERSION_CONFLICT', '版本冲突', 409);
  };
  await p.submit();
  assert.equal(p.data.canSubmit, false);
  assert.deepEqual(p.data.profile, profile);
  assert.match(p.data.submitError, /保留/);
});
test('registration capacity conflict preserves contact and companion count', async () => {
  const p = page('activity');
  p.intent = { for: async () => 'same-key', failed() {} };
  p.setData({
    activity: { id: '8', myRegistration: { generation: 3 } },
    canRegister: true,
    name: '测试姓名',
    phone: '13800138000',
    companionCount: 2,
  });
  let submitted: any;
  api.register = async (_id: string, data: any) => {
    submitted = data;
    throw new ApiError('CAPACITY_EXCEEDED', '余位不足', 409);
  };
  await p.submit();
  assert.equal(submitted.expectedGeneration, 3);
  assert.equal(p.data.phone, '13800138000');
  assert.equal(p.data.companionCount, 2);
  assert.equal(p.data.canRegister, false);
  assert.equal(p.data.saving, false);
});
test('checkin QR is produced locally, removed on hide and expires without a timer leak', () => {
  const p = page('registration');
  const token = {
    token: 'a'.repeat(43),
    expiresAt: new Date(Date.now() + 120000).toISOString(),
    refreshAfter: new Date(Date.now() + 60000).toISOString(),
  };
  p.renderToken(token);
  assert.match(p.data.qrUrl, /^data:image\/gif;base64,/);
  assert.ok(p.timer);
  p.onHide();
  assert.equal(p.data.qrUrl, '');
  assert.equal(p.timer, 0);
  p.renderToken({ ...token, expiresAt: '2000-01-01T00:00:00Z' });
  assert.equal(p.data.qrUrl, '');
  assert.equal(p.timer, 0);
});
test('status form returns to editable state after user cancels cancellation dialog', async () => {
  const p = page('registration');
  (globalThis as any).wx.showModal = (o: any) => o.success({ confirm: false });
  p.setData({ registration: { id: '1', participantCount: 2 }, canCancel: true, saving: false });
  p.intent = new Intent();
  let called = false;
  api.cancel = async () => {
    called = true;
  };
  await p.cancel();
  assert.equal(called, false);
  assert.equal(p.data.saving, false);
});

test('account exit only writes after confirmation and uses profile version', async () => {
  const p = page('account');
  p.setData({ me: { userId: '9007199254740999', profile: { version: 9 } }, canExit: true });
  p.intent = { for: async () => 'exit-key', clear() {}, failed() {} };
  (globalThis as any).wx.showModal = (o: any) => o.success({ confirm: false });
  let calls = 0;
  api.exitMembership = async () => {
    calls++;
  };
  await p.exit();
  assert.equal(calls, 0);
  assert.equal(p.data.saving, false);
  (globalThis as any).wx.showModal = (o: any) => o.success({ confirm: true });
  api.exitMembership = async (version: number, key: string) => {
    calls++;
    assert.equal(version, 9);
    assert.equal(key, 'exit-key');
    throw new ApiError('VERSION_CONFLICT', '请刷新', 409);
  };
  await p.exit();
  assert.equal(calls, 1);
  assert.equal(p.data.canExit, true);
  assert.match(p.data.actionError, /刷新/);
});
test('account closure does not announce success or clear session after unknown network outcome', async () => {
  const p = page('account');
  p.setData({ me: { userId: '9' } });
  p.intent = { for: async () => 'closure-key', clear() {}, failed() {} };
  (globalThis as any).wx.showModal = (o: any) => o.success({ confirm: true });
  (globalThis as any).wx.login = (o: any) => o.success({ code: 'fresh-wechat-code' });
  let cleared = false;
  (globalThis as any).wx.removeStorageSync = () => {
    cleared = true;
  };
  api.closeAccount = async (code: string) => {
    assert.equal(code, 'fresh-wechat-code');
    throw new ApiError('NETWORK_ERROR', '请求超时');
  };
  await p.close();
  assert.equal(p.data.closed, false);
  assert.equal(cleared, false);
  assert.match(p.data.actionError, /结果可能/);
});

test('unpublished agreement allows submission without claiming consent; published agreement requires it', async () => {
  const p = page('application');
  p.setData({
    profile: {
      name: '测试姓名',
      phone: '13800138000',
      hometownCode: '620102',
      residenceCode: '610113',
      industryCode: 'I',
      introduction: '',
    },
    accepted: false,
    agreementReady: false,
    canSubmit: true,
  });
  p.intent = { for: async () => 'agreement-test', failed() {}, clear() {} };
  p.load = async () => {};
  let submitted: any;
  api.submitApplication = async (data: any) => {
    submitted = data;
  };
  await p.submit();
  assert.equal(submitted.accepted, false);
  assert.equal(submitted.agreementVersion, '');
  assert.equal(p.data.submitError, '');
  submitted = undefined;
  p.setData({ canSubmit: true, agreementReady: true, accepted: false });
  await p.submit();
  assert.equal(submitted, undefined);
  assert.match(p.data.submitError, /请阅读并同意/);
});

test('home prioritizes membership and registrations, then uses authorized carousel photos', async () => {
  const p = page('home');
  const wxMock = (globalThis as any).wx;
  const originalStorage = wxMock.getStorageSync;
  const originalNavigate = wxMock.navigateTo;
  wxMock.getStorageSync = () => ({ accessToken: 'test' });
  let qualification = 'ACTIVE';
  let registrations: any[] = [];
  let carouselReads = 0;
  api.homeSummary = async () => ({
    me: { qualification, profile: { name: '老乡' } } as any,
    nextGathering: registrations.length
      ? {
          id: registrations[0].id,
          title: '下次相聚',
          place: '西安',
          startAt: '2026-12-01T00:00:00Z',
        }
      : null,
    carousel: qualification === 'ACTIVE' && !registrations.length ? await api.homeCarousel() : [],
  });
  api.announcements = api.activities = async () => ({ items: [] });
  api.activity = async () => ({
    title: '下次相聚',
    lifecycle: 'UPCOMING',
    startAt: '2026-12-01',
    place: '西安',
  });
  api.homeCarousel = async () => {
    carouselReads++;
    return [
      {
        activityId: '12',
        activityTitle: '往期相聚',
        recapVersion: 3,
        assetId: '45',
        caption: null,
      },
    ];
  };
  api.tickets = async (input: any) => {
    assert.equal(input.contextType, 'ACTIVITY_RECAP');
    assert.equal(input.contextId, '12');
    assert.equal(input.version, 3);
    return { items: [{ assetId: '45', url: 'https://example.test/photo' }] };
  };
  try {
    qualification = 'NONE';
    await p.load();
    assert.equal(carouselReads, 0);
    qualification = 'ACTIVE';
    registrations = [{ id: '4', activityId: '5', status: 'ACTIVE' }];
    await p.load();
    assert.equal(p.data.nextGathering.id, '4');
    assert.equal(carouselReads, 0); // The summary includes metadata without another request.
    registrations = [];
    p.visible = true;
    await p.load();
    assert.equal(p.data.carousel[0].url, 'https://example.test/photo');
    assert.ok(p.carouselTimer);
    let destination = '';
    wxMock.navigateTo = ({ url }: any) => {
      destination = url;
    };
    p.openRecap({ currentTarget: { dataset: { id: '12' } } });
    assert.equal(destination, '/pages/activity/index?id=12');
    p.onHide();
    assert.equal(p.carouselTimer, null);
    p.carouselImageError({ currentTarget: { dataset: { key: p.data.carousel[0].key } } });
    assert.equal(p.data.carousel.length, 1);
    assert.equal(p.data.carouselFailed[p.data.carousel[0].key], true);
    api.tickets = async () => {
      throw new Error('轮播读取失败');
    };
    api.homeSummary = async () => ({
      me: { qualification: 'ACTIVE', profile: { name: '老乡' } } as any,
      nextGathering: null,
      carousel: [{ activityId: '12', activityTitle: '往期相聚', recapVersion: 4, assetId: '45', caption: null }],
    });
    await p.load();
    assert.match(p.data.carouselError, /轮播读取失败/);
    assert.equal(p.data.registrationError, '');
    api.homeSummary = async () => {
      throw new Error('首页摘要读取失败');
    };
    await p.load();
    assert.match(p.data.error, /首页摘要读取失败/);
  } finally {
    p.onUnload();
    wxMock.getStorageSync = originalStorage;
    wxMock.navigateTo = originalNavigate;
  }
});

test('home refresh keeps existing modules mounted and clears member content on logout', async () => {
  const p = page('home');
  const wxMock = (globalThis as any).wx;
  const originalStorage = wxMock.getStorageSync;
  let signedIn = true;
  wxMock.getStorageSync = () => (signedIn ? { accessToken: 'test', userId: '1' } : null);
  api.homeSummary = async () => ({
    me: { qualification: 'ACTIVE', profile: { name: '老乡' } } as any,
    nextGathering: null,
    carousel: await api.homeCarousel(),
  });
  api.announcements = api.activities = async () => ({ items: [] });
  api.homeCarousel = async () => [
    { activityId: '12', activityTitle: '相聚', recapVersion: 3, assetId: '45', caption: null },
  ];
  let tickets = 0;
  api.tickets = async () => {
    tickets++;
    return {
      expiresAt: new Date(Date.now() + 300_000).toISOString(),
      items: [{ assetId: '45', url: 'https://example.test/photo' }],
    };
  };
  try {
    await p.load();
    const carousel = p.data.carousel;
    let resolveSummary!: (value: any) => void;
    api.homeSummary = () =>
      new Promise((resolve) => {
        resolveSummary = resolve;
      });
    const refreshing = p.load();
    assert.equal(p.data.loaded, true);
    assert.equal(p.data.me.qualification, 'ACTIVE');
    assert.equal(p.data.carousel, carousel);
    resolveSummary({
      me: { qualification: 'ACTIVE', profile: { name: '老乡' } },
      nextGathering: null,
      carousel: [
        { activityId: '12', activityTitle: '相聚', recapVersion: 3, assetId: '45', caption: null },
      ],
    });
    await refreshing;
    assert.equal(p.data.carousel, carousel);
    assert.equal(tickets, 1);

    const stale = p.load();
    signedIn = false;
    const logoutRefresh = p.load();
    assert.equal(p.data.me, null);
    assert.equal(p.data.carousel.length, 0);
    resolveSummary({
      me: { qualification: 'ACTIVE', profile: { name: '旧账号' } },
      nextGathering: null,
      carousel: [],
    });
    await Promise.all([stale, logoutRefresh]);
    assert.equal(p.data.me, null);
    assert.equal(p.data.carousel.length, 0);
  } finally {
    p.onUnload();
    wxMock.getStorageSync = originalStorage;
  }
});

test('home summary loads with public sections and shows first photo before slow public sections or later tickets', async () => {
  const p = page('home');
  const wxMock = (globalThis as any).wx;
  const originalStorage = wxMock.getStorageSync;
  wxMock.getStorageSync = () => ({ accessToken: 'test', userId: '1' });
  let finishPublic!: (value: any) => void;
  const pendingPublic = new Promise((resolve) => {
    finishPublic = resolve;
  });
  api.announcements = api.activities = () => pendingPublic;
  let finishSummary!: (value: any) => void;
  api.homeSummary = () =>
    new Promise((resolve) => {
      finishSummary = resolve;
    });
  const photos = [1, 2, 3].map((id) => ({
    activityId: '12',
    activityTitle: '相聚',
    recapVersion: 3,
    assetId: String(id),
    caption: null,
  }));
  let finishLater!: (value: any) => void;
  api.tickets = async (input: any) => {
    assert.ok(input.items.every((item: any) => item.variant === 'THUMBNAIL'));
    if (input.items[0].assetId === '1')
      return {
        expiresAt: new Date(Date.now() + 300_000).toISOString(),
        items: [{ assetId: '1', url: 'https://example.test/first' }],
      };
    return new Promise((resolve) => {
      finishLater = resolve;
    });
  };
  try {
    const pending = p.load();
    await new Promise((resolve) => setImmediate(resolve));
    finishSummary({
      me: { qualification: 'ACTIVE', profile: { name: '老乡' } },
      nextGathering: null,
      carousel: photos,
    });
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(p.data.carousel[0].url, 'https://example.test/first');
    assert.equal(p.data.me.qualification, 'ACTIVE');
    assert.equal(p.data.loaded, true);
    assert.equal(p.data.activitiesLoaded, false);
    assert.deepEqual(p.data.carouselRequested, [true]);
    p.carouselImageLoad({ currentTarget: { dataset: { index: 0 } } });
    finishLater({
      expiresAt: new Date(Date.now() + 300_000).toISOString(),
      items: [
        { assetId: '2', url: 'https://example.test/second' },
        { assetId: '3', url: 'https://example.test/third' },
      ],
    });
    finishPublic({ items: [] });
    await pending;
    assert.equal(p.data.carousel.length, 3);
    assert.deepEqual(p.data.carouselRequested, [true, true]);
    p.carouselChange({ detail: { current: 1 } });
    assert.deepEqual(p.data.carouselRequested, [true, true, true]);
  } finally {
    p.onUnload();
    wxMock.getStorageSync = originalStorage;
  }
});

test('one failed photo retries independently and renewal never refreshes unrelated home sections', async () => {
  const p = page('home');
  const wxMock = (globalThis as any).wx;
  const originalStorage = wxMock.getStorageSync;
  wxMock.getStorageSync = () => ({ accessToken: 'test', userId: '1' });
  p.owner = '1';
  p.visible = true;
  const photos = [1, 2].map((id) => ({
    activityId: '12',
    activityTitle: '相聚',
    recapVersion: 3,
    assetId: String(id),
    caption: null,
    key: `12:${id}`,
    url: `https://example.test/old-${id}`,
    renewAt: 0,
  }));
  p.setData({ carousel: photos, carouselIndex: 1, carouselRequested: [true, true] });
  let unrelated = 0;
  api.me =
    api.announcements =
    api.activities =
    api.nextGathering =
      async () => {
        unrelated++;
        throw new Error('unexpected full reload');
      };
  const batches: string[][] = [];
  api.tickets = async (input: any) => {
    batches.push(input.items.map((item: any) => item.assetId));
    return {
      expiresAt: new Date(Date.now() + 300_000).toISOString(),
      items: input.items.map((item: any) => ({
        ...item,
        url: `https://example.test/new-${item.assetId}`,
      })),
    };
  };
  api.homeCarousel = async () => photos;
  try {
    p.carouselImageError({ currentTarget: { dataset: { key: '12:2' } } });
    assert.equal(p.data.carousel.length, 2);
    assert.equal(p.data.carousel[0].url, photos[0].url);
    assert.equal(p.data.carouselFailed['12:2'], true);
    await p.retryCarouselImage({ currentTarget: { dataset: { key: '12:2' } } });
    assert.deepEqual(batches, [['2']]);
    assert.equal(p.data.carousel[0].url, photos[0].url);
    assert.equal(p.data.carouselFailed['12:2'], false);
    assert.equal(p.data.carouselIndex, 1);
    await p.renewCarousel();
    assert.equal(unrelated, 0);
    assert.equal(p.data.carouselIndex, 1);
    assert.ok(p.carouselTimer);
    api.homeCarousel = async () => {
      throw new ApiError('FORBIDDEN', '资格已失效', 403);
    };
    await p.renewCarousel();
    assert.equal(p.data.carousel.length, 0);
    assert.match(p.data.carouselError, /资格已失效/);
  } finally {
    p.onUnload();
    wxMock.getStorageSync = originalStorage;
  }
});

test('renewal retains downloaded photos after network failure and ignores results after leaving home', async () => {
  const p = page('home');
  const wxMock = (globalThis as any).wx;
  const originalStorage = wxMock.getStorageSync;
  wxMock.getStorageSync = () => ({ accessToken: 'test', userId: '1' });
  p.owner = '1';
  p.visible = true;
  const photos = [
    {
      activityId: '12',
      activityTitle: '相聚',
      recapVersion: 3,
      assetId: '1',
      caption: null,
      key: '12:1',
      url: 'https://example.test/old',
      renewAt: Date.now() + 100_000,
    },
  ];
  p.setData({ carousel: photos });
  try {
    api.homeCarousel = async () => {
      throw new Error('网络失败');
    };
    await p.renewCarousel();
    assert.equal(p.data.carousel, photos);
    assert.ok(p.data.carouselRenewError);
    let finish!: (value: any) => void;
    api.homeCarousel = () =>
      new Promise((resolve) => {
        finish = resolve;
      });
    const renewal = p.renewCarousel();
    p.onHide();
    finish([]);
    await renewal;
    assert.equal(p.data.carousel, photos);
    assert.equal(p.carouselTimer, null);
  } finally {
    p.onUnload();
    wxMock.getStorageSync = originalStorage;
  }
});

test('late single-photo retry cannot overwrite a newer published recap image', async () => {
  const p = page('home');
  const wxMock = (globalThis as any).wx;
  const originalStorage = wxMock.getStorageSync;
  wxMock.getStorageSync = () => ({ accessToken: 'test', userId: '1' });
  p.owner = '1';
  const old = {
    activityId: '12',
    activityTitle: '相聚',
    recapVersion: 3,
    assetId: '1',
    caption: null,
    key: '12:1',
    url: 'https://example.test/old',
    renewAt: 0,
  };
  p.setData({ carousel: [old] });
  let finish!: (value: any) => void;
  api.tickets = () =>
    new Promise((resolve) => {
      finish = resolve;
    });
  try {
    const retry = p.retryCarouselImage({ currentTarget: { dataset: { key: old.key } } });
    const latest = { ...old, recapVersion: 4, url: 'https://example.test/latest' };
    p.setData({ carousel: [latest] });
    finish({
      expiresAt: new Date(Date.now() + 300_000).toISOString(),
      items: [{ assetId: '1', url: 'https://example.test/stale-retry' }],
    });
    await retry;
    assert.equal(p.data.carousel[0], latest);
    assert.equal(p.data.carouselRetrying[old.key], false);
  } finally {
    p.onUnload();
    wxMock.getStorageSync = originalStorage;
  }
});

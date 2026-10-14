import { api } from '../../api/client';
import { errorText, isLoggedIn, login, ApiError } from '../../api/request';
import type { Activity, Recap } from '../../api/types';
import { activityView, dateText, go, validProfile } from '../../lib/view';
import { mediaUrls } from '../../lib/media';
import { Intent } from '../../lib/intent';
Page({
  data: {
    id: '',
    activity: null as Activity | null,
    view: null as ReturnType<typeof activityView> | null,
    recap: null as Recap | null,
    photos: [] as { url: string; caption?: string }[],
    cover: '',
    loading: false,
    error: '',
    mediaError: '',
    saving: false,
    submitError: '',
    canRegister: false,
    signupClose: '',
    cancelClose: '',
    name: '',
    phone: '',
    companionCount: 0,
    choices: ['仅本人（1 人）', '本人 + 1 位同行（2 人）', '本人 + 2 位同行（3 人）'],
    loggedIn: false,
  },
  intent: new Intent(),
  onLoad(o) {
    this.intent = new Intent();
    this.setData({ id: o.id || '' });
  },
  onShow() {
    void this.load();
  },
  onPullDownRefresh() {
    void this.load();
  },
  async load() {
    if (this.data.loading || this.data.saving) return;
    this.setData({
      loading: true,
      error: '',
      activity: null,
      recap: null,
      photos: [],
      cover: '',
      mediaError: '',
      canRegister: false,
      loggedIn: isLoggedIn(),
    });
    try {
      const activity = await api.activity(this.data.id);
      this.setData({
        activity,
        view: activityView(activity),
        canRegister: activity.allowedActions.includes('register'),
        signupClose: dateText(activity.signupCloseAt),
        cancelClose: dateText(activity.cancelCloseAt),
      });
      if (activity.lifecycle === 'ENDED') this.setData({ recap: await api.recap(activity.id) });
      if (isLoggedIn()) {
        if (activity.allowedActions.includes('register') && !this.data.name) {
          const me = await api.me();
          this.setData({ name: me.profile?.name || '', phone: me.profile?.phone || '' });
        }
        await this.loadMedia();
      }
    } catch (e) {
      this.setData({ error: errorText(e) });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },
  async loadMedia() {
    const a = this.data.activity;
    if (!a) return;
    this.setData({ mediaError: '' });
    try {
      if (a.coverAssetId) {
        const urls = await mediaUrls('ACTIVITY', a.id, a.version, [a.coverAssetId]);
        this.setData({ cover: urls[0] });
      }
      const r = this.data.recap;
      if (r?.state === 'PUBLISHED' && r.photos.length && r.version) {
        const urls = await mediaUrls(
          'ACTIVITY_RECAP',
          a.id,
          r.version,
          r.photos.map((p) => p.assetId),
          'THUMBNAIL',
        );
        this.setData({
          photos: r.photos.map((p, i) => ({ url: urls[i], caption: p.caption || undefined })),
        });
      }
    } catch (e) {
      this.setData({ mediaError: errorText(e) });
    }
  },
  async showPhotos(e: WechatMiniprogram.TouchEvent) {
    const r = this.data.recap;
    if (!r?.version) return;
    try {
      const urls = await mediaUrls(
        'ACTIVITY_RECAP',
        this.data.id,
        r.version,
        r.photos.map((p) => p.assetId),
      );
      wx.previewImage({ urls, current: urls[Number(e.currentTarget.dataset.index) || 0] });
    } catch (error) {
      this.setData({ mediaError: errorText(error) });
    }
  },
  input(e: WechatMiniprogram.Input) {
    const f = e.currentTarget.dataset.field;
    if (f === 'name') this.setData({ name: e.detail.value });
    else this.setData({ phone: e.detail.value });
  },
  count(e: WechatMiniprogram.PickerChange) {
    this.setData({ companionCount: Number(e.detail.value) });
  },
  async signIn() {
    try {
      await login();
      await this.load();
    } catch (e) {
      this.setData({ error: errorText(e) });
    }
  },
  apply() {
    go('application');
  },
  registration() {
    const r = this.data.activity?.myRegistration;
    if (r) go('registration', r.id);
  },
  more() {
    wx.switchTab({ url: '/pages/activities/index' });
  },
  scrollToSignup() {
    wx.pageScrollTo({ selector: '#registration-form', duration: 250 });
  },
  async submit() {
    const a = this.data.activity;
    if (!a || !this.data.canRegister || this.data.saving) return;
    this.setData({ saving: true, submitError: '' });
    let registrationId = '';
    try {
      const contact = { name: this.data.name.trim(), phone: this.data.phone.trim() };
      validProfile({ ...contact, hometownCode: '-', residenceCode: '-', industryCode: '-' });
      const data = {
        contact,
        companionCount: this.data.companionCount,
        expectedGeneration: a.myRegistration?.generation || 0,
      };
      const key = await this.intent.for({ id: a.id, data });
      const result = await api.register(a.id, data, key);
      this.intent.clear();
      registrationId = result.id;
      this.setData({ canRegister: false });
    } catch (e) {
      this.intent.failed(e);
      this.setData({ submitError: errorText(e) });
      if (e instanceof ApiError && [409, 422].includes(e.status)) {
        this.setData({
          canRegister: false,
          submitError: errorText(e) + '。请刷新活动状态后重新确认。',
        });
      }
    } finally {
      this.setData({ saving: false });
    }
    if (registrationId) go('registration', registrationId);
  },
});

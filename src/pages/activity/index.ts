import { api } from '../../api/client';
import { errorText, isLoggedIn, login, ApiError, session, serverNow } from '../../api/request';
import type { Activity, Recap } from '../../api/types';
import { activityView, dateText, go, validProfile } from '../../lib/view';
import { mediaUrls, mediaLinks } from '../../lib/media';
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
    rulesExpanded: false,
    recapDrawer: false,
    recapExpanded: false,
    recapIndex: 0,
  },
  owner: '',
  visible: false,
  coverRenewAt: 0,
  photosRenewAt: 0,
  intent: new Intent(),
  onLoad(o) {
    this.intent = new Intent();
    this.setData({ id: o.id || '' });
  },
  onShow() {
    this.visible = true;
    void this.load();
  },
  onHide() {
    this.visible = false;
    this.closeRecap();
  },
  onUnload() {
    this.visible = false;
  },
  onPullDownRefresh() {
    void this.load();
  },
  async load() {
    if (this.data.loading || this.data.saving) return;
    const owner = session()?.userId || '';
    if (this.owner !== owner) {
      this.owner = owner;
      this.setData({
        activity: null,
        view: null,
        recap: null,
        photos: [],
        cover: '',
        name: '',
        phone: '',
      });
    }
    this.setData({
      recapDrawer: false,
      loading: true,
      error: '',
      mediaError: '',
      canRegister: false,
      loggedIn: isLoggedIn(),
    });
    try {
      const activity = await api.activity(this.data.id);
      if (owner !== (session()?.userId || '')) return;
      // Discard old media when its authorization context changes; keep it during same-version refreshes.
      if (this.data.activity?.version !== activity.version)
        this.setData({ cover: '', photos: [], recap: null });
      this.setData({
        activity,
        view: activityView(activity),
        canRegister: activity.allowedActions.includes('register'),
        signupClose: dateText(activity.signupCloseAt),
        cancelClose: dateText(activity.cancelCloseAt),
      });
      if (activity.lifecycle === 'ENDED') {
        const recap = await api.recap(activity.id);
        if (recap.state !== 'PUBLISHED' || recap.version !== this.data.recap?.version)
          this.setData({ photos: [] });
        this.setData({ recap });
      } else this.setData({ recap: null, photos: [] });
      if (isLoggedIn()) {
        if (activity.allowedActions.includes('register') && !this.data.name) {
          const me = await api.me();
          this.setData({ name: me.profile?.name || '', phone: me.profile?.phone || '' });
        }
        await this.loadMedia();
      }
    } catch (e) {
      if (e instanceof ApiError && [401, 403, 404].includes(e.status))
        this.setData({ activity: null, view: null, recap: null, photos: [], cover: '' });
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
      if (a.coverAssetId && (!this.data.cover || this.coverRenewAt <= serverNow())) {
        const { urls, expiresAt } = await mediaLinks('ACTIVITY', a.id, a.version, [a.coverAssetId]);
        this.coverRenewAt = Date.parse(expiresAt) - 60_000 || 0;
        this.setData({ cover: urls[0] });
      }
      const r = this.data.recap;
      if (
        r?.state === 'PUBLISHED' &&
        r.photos.length &&
        r.version &&
        (!this.data.photos.length || this.photosRenewAt <= serverNow())
      ) {
        const { urls, expiresAt } = await mediaLinks(
          'ACTIVITY_RECAP',
          a.id,
          r.version,
          r.photos.map((p) => p.assetId),
          'THUMBNAIL',
        );
        this.photosRenewAt = Date.parse(expiresAt) - 60_000 || 0;
        this.setData({
          photos: r.photos.map((p, i) => ({ url: urls[i], caption: p.caption || undefined })),
        });
      }
    } catch (e) {
      if (e instanceof ApiError && [401, 403, 404].includes(e.status))
        this.setData({ cover: '', photos: [] });
      this.setData({ mediaError: errorText(e) });
    }
  },
  toggleRules() {
    this.setData({ rulesExpanded: !this.data.rulesExpanded });
  },
  async openRecap() {
    if (!isLoggedIn() || this.data.recap?.state !== 'PUBLISHED') return;
    const recap = this.data.recap;
    const owner = session()?.userId;
    await this.loadMedia();
    if (!this.visible || owner !== session()?.userId || recap !== this.data.recap) return;
    if (!isLoggedIn() || this.data.recap?.state !== 'PUBLISHED' || !this.data.photos.length) return;
    this.setData({ recapDrawer: true, recapIndex: 0, recapExpanded: false });
  },
  closeRecap() {
    this.setData({ recapDrawer: false });
  },
  recapChange(e: WechatMiniprogram.SwiperChange) {
    this.setData({ recapIndex: e.detail.current });
  },
  toggleRecap() {
    this.setData({ recapExpanded: !this.data.recapExpanded });
  },
  preventScroll() {},
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
  imageError() {
    this.coverRenewAt = this.photosRenewAt = 0;
    this.setData({ mediaError: '活动照片加载失败，请检查网络或小程序下载域名配置后重试。' });
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

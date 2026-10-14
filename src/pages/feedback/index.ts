import { api } from '../../api/client';
import { errorText, isLoggedIn, login } from '../../api/request';
import type { Feedback } from '../../api/types';
import { Intent } from '../../lib/intent';
Page({
  data: {
    body: '',
    contactConsent: false,
    typeIndex: 0,
    types: ['意见建议', '使用问题', '举报'],
    items: [] as Feedback[],
    loading: false,
    saving: false,
    error: '',
    submitError: '',
    page: 0,
    total: 0,
    loggedIn: false,
  },
  intent: new Intent(),
  onLoad() {
    this.intent = new Intent();
    void this.load(true);
  },
  onPullDownRefresh() {
    void this.load(true);
  },
  input(e: WechatMiniprogram.Input) {
    this.setData({ body: e.detail.value });
  },
  type(e: WechatMiniprogram.PickerChange) {
    this.setData({ typeIndex: Number(e.detail.value) });
  },
  consent(e: WechatMiniprogram.SwitchChange) {
    this.setData({ contactConsent: e.detail.value });
  },
  retry() {
    void this.load(this.data.page === 0);
  },
  async signIn() {
    try {
      await login();
      await this.load(true);
    } catch (e) {
      this.setData({ error: errorText(e) });
    }
  },
  async load(reset: boolean) {
    if (this.data.loading) return;
    this.setData({ loggedIn: isLoggedIn() });
    if (!isLoggedIn()) {
      wx.stopPullDownRefresh();
      return;
    }
    this.setData({ loading: true, error: '', ...(reset ? { items: [], page: 0, total: 0 } : {}) });
    try {
      const result = await api.feedbackList(reset ? 1 : this.data.page + 1);
      this.setData({
        items: (reset ? [] : this.data.items).concat(result.items),
        page: result.page,
        total: result.total,
      });
    } catch (e) {
      this.setData({ error: errorText(e) });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },
  async submit() {
    if (this.data.saving) return;
    this.setData({ saving: true, submitError: '' });
    let success = false;
    try {
      if (!this.data.body.trim()) throw new Error('请填写反馈内容');
      const data = {
        type: (['SUGGESTION', 'ISSUE', 'REPORT'] as const)[this.data.typeIndex],
        body: this.data.body.trim(),
        contactConsent: this.data.contactConsent,
      };
      const key = await this.intent.for(data);
      await api.feedback(data, key);
      this.intent.clear();
      this.setData({ body: '', contactConsent: false });
      success = true;
      wx.showToast({ title: '反馈已提交', icon: 'success' });
    } catch (e) {
      this.intent.failed(e);
      this.setData({ submitError: errorText(e) });
    } finally {
      this.setData({ saving: false });
    }
    if (success) await this.load(true);
  },
});

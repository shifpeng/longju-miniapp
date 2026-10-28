import { api } from '../../api/client';
import { errorText, ApiError } from '../../api/request';
import type { Profile, ProfileInput } from '../../api/types';
import { validProfile } from '../../lib/view';
import type { Schema } from '../../api/types';
Page({
  data: {
    loading: false,
    saving: false,
    error: '',
    submitError: '',
    profile: null as Profile | null,
    canEdit: false,
    dirty: false,
    review: null as Schema['ProfileChange'] | null,
  },
  onLoad() {
    void this.load();
  },
  onPullDownRefresh() {
    void this.load();
  },
  async load() {
    if (this.data.saving) return;
    this.setData({ loading: true, error: '' });
    try {
      const [me, review] = await Promise.all([api.me(), api.profileChange()]);
      this.setData({ canEdit: me.qualification === 'ACTIVE', review });
      if (!this.data.dirty) {
        const draft = review && ['PENDING', 'REJECTED'].includes(review.status) ? review.draft : {};
        this.setData({ profile: me.profile ? { ...me.profile, ...draft } : null });
      }
    } catch (e) {
      this.setData({ error: errorText(e), canEdit: false });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },
  change(e: WechatMiniprogram.CustomEvent<ProfileInput>) {
    if (this.data.profile)
      this.setData({ profile: { ...this.data.profile, ...e.detail }, dirty: true });
  },
  async directory(e: WechatMiniprogram.SwitchChange) {
    const profile = this.data.profile;
    if (!profile || !this.data.canEdit || this.data.saving) return;
    this.setData({ saving: true, submitError: '' });
    try {
      const result = await api.directoryVisibility(e.detail.value, profile.version);
      this.setData({
        profile: { ...profile, directoryVisible: result.directoryVisible, version: result.version },
      });
      wx.showToast({
        title: result.directoryVisible ? '已允许展示' : '已停止展示',
        icon: 'success',
      });
    } catch (e) {
      this.setData({ profile: { ...profile }, submitError: errorText(e) });
      if (e instanceof ApiError && e.code === 'VERSION_CONFLICT') this.setData({ canEdit: false });
    } finally {
      this.setData({ saving: false });
    }
  },
  async save() {
    const p = this.data.profile;
    if (!p || !this.data.canEdit || this.data.saving) return;
    this.setData({ saving: true, submitError: '' });
    try {
      validProfile({ ...p, phone: undefined });
      const profile = await api.profile(
        {
          name: p.name.trim(),
          hometownCode: p.hometownCode,
          residenceCode: p.residenceCode,
          industryCode: p.industryCode,
          introduction: p.introduction,
          avatarAssetId: p.avatarAssetId,
          directoryVisible: p.directoryVisible,
        },
        p.version,
      );
      this.setData({ profile: { ...p, version: profile.version }, dirty: false });
      const review = await api.profileChange();
      this.setData({
        review,
        profile:
          review && ['PENDING', 'REJECTED'].includes(review.status)
            ? { ...profile, ...review.draft }
            : profile,
      });
      wx.showToast({
        title: review?.status === 'PENDING' ? '已提交审核' : '已保存',
        icon: 'success',
      });
    } catch (e) {
      this.setData({ submitError: errorText(e) });
      if (e instanceof ApiError && e.code === 'VERSION_CONFLICT')
        this.setData({
          canEdit: false,
          submitError: '资料已在其他位置更新。当前输入已保留，请重新进入页面读取最新资料后修改。',
        });
    } finally {
      this.setData({ saving: false });
    }
  },
});

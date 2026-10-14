import { api } from '../../api/client';
import { errorText, ApiError } from '../../api/request';
import type { Profile, ProfileInput } from '../../api/types';
import { validProfile } from '../../lib/view';
Page({
  data: {
    loading: false,
    saving: false,
    error: '',
    submitError: '',
    profile: null as Profile | null,
    canEdit: false,
    dirty: false,
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
      const me = await api.me();
      this.setData({ canEdit: me.qualification === 'ACTIVE' });
      if (!this.data.dirty) this.setData({ profile: me.profile });
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
  directory(e: WechatMiniprogram.SwitchChange) {
    if (this.data.profile)
      this.setData({
        profile: {
          ...this.data.profile,
          directoryVisible: e.detail.value,
          phoneVisible: e.detail.value && this.data.profile.phoneVisible,
        },
        dirty: true,
      });
  },
  phone(e: WechatMiniprogram.SwitchChange) {
    if (this.data.profile)
      this.setData({
        profile: { ...this.data.profile, phoneVisible: e.detail.value },
        dirty: true,
      });
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
          phoneVisible: p.phoneVisible,
        },
        p.version,
      );
      this.setData({ profile, dirty: false });
      wx.showToast({ title: '已保存', icon: 'success' });
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

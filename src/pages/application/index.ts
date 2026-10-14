import { api } from '../../api/client';
import { errorText, ApiError } from '../../api/request';
import type { Application, Me, ProfileInput } from '../../api/types';
import { runtime } from '../../config/runtime';
import { Intent } from '../../lib/intent';
import { membership, validProfile, go } from '../../lib/view';
Page({
  data: {
    loading: false,
    saving: false,
    error: '',
    submitError: '',
    application: null as Application | null,
    me: null as Me | null,
    profile: {
      name: '',
      phone: '',
      hometownCode: '',
      residenceCode: '',
      industryCode: '',
      introduction: '',
    } as ProfileInput,
    canSubmit: false,
    accepted: false,
    agreementReady: !!(runtime.agreement.version && runtime.agreement.body),
    statusTitle: '申请加入',
    detail: '',
    dirty: false,
  },
  intent: new Intent(),
  onLoad() {
    this.intent = new Intent();
    void this.load();
  },
  onPullDownRefresh() {
    void this.load();
  },
  async load() {
    if (this.data.loading || this.data.saving) return;
    this.setData({ loading: true, error: '' });
    try {
      const [me, application] = await Promise.all([api.me(), api.application()]);
      const card = membership(me);
      this.setData({
        me,
        application,
        canSubmit: me.allowedActions.includes('submitApplication'),
        statusTitle: card.title,
        detail: application?.publicReview?.publicReason || card.detail,
      });
      if (application && !this.data.dirty) {
        const p = application.submittedProfile;
        this.setData({
          profile: {
            name: p.name,
            phone: p.phone,
            hometownCode: p.hometownCode,
            residenceCode: p.residenceCode,
            industryCode: p.industryCode,
            introduction: p.introduction,
          },
        });
      }
    } catch (e) {
      this.setData({ error: errorText(e), canSubmit: false });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },
  change(e: WechatMiniprogram.CustomEvent<ProfileInput>) {
    this.setData({ profile: e.detail, dirty: true });
  },
  agree(e: WechatMiniprogram.CheckboxGroupChange) {
    this.setData({ accepted: e.detail.value.includes('yes') });
  },
  agreement() {
    go('agreement');
  },
  async submit() {
    if (this.data.saving || !this.data.canSubmit) return;
    this.setData({ saving: true, submitError: '' });
    let succeeded = false;
    try {
      const profile = {
        ...this.data.profile,
        name: this.data.profile.name.trim(),
        phone: this.data.profile.phone.trim(),
      };
      validProfile(profile);
      if (this.data.agreementReady && !this.data.accepted)
        throw new Error('请阅读并同意加入须知与隐私说明');
      const data = {
        profile,
        accepted: this.data.agreementReady && this.data.accepted,
        agreementVersion: this.data.agreementReady ? runtime.agreement.version : '',
      };
      const key = await this.intent.for({ data, version: this.data.application?.version });
      await api.submitApplication(data, key, this.data.application?.version);
      this.intent.clear();
      this.setData({ dirty: false, canSubmit: false });
      succeeded = true;
    } catch (e) {
      this.intent.failed(e);
      if (e instanceof ApiError && e.code === 'VERSION_CONFLICT')
        this.setData({
          submitError: '申请已发生变化，已保留你的输入。请刷新状态、核对审核结果后再提交。',
          canSubmit: false,
        });
      else this.setData({ submitError: errorText(e) });
    } finally {
      this.setData({ saving: false });
    }
    if (succeeded) await this.load();
  },
});

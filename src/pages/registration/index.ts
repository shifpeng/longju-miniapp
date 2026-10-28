import { api } from '../../api/client';
import { errorText, ApiError, session } from '../../api/request';
import type { Registration, Activity } from '../../api/types';
import { dateText, go } from '../../lib/view';
import { Intent } from '../../lib/intent';
Page({
  data: {
    id: '',
    registration: null as Registration | null,
    activity: null as Activity | null,
    loading: false,
    error: '',
    saving: false,
    cancelDialog: false,
    actionError: '',
    canCancel: false,
    canCheckin: false,
    label: '',
    date: '',
    cancelClose: '',
  },
  owner: '',
  intent: new Intent(),
  visible: false,
  disposed: false,
  onLoad(o) {
    this.disposed = false;
    this.intent = new Intent();
    this.setData({ id: o.id || '' });
  },
  onShow() {
    this.visible = true;
    void this.load();
  },
  onHide() {
    this.visible = false;
    this.setData({ cancelDialog: false });
  },
  onUnload() {
    this.disposed = true;
    this.visible = false;
  },
  onPullDownRefresh() {
    void this.load();
  },
  async load() {
    if (this.data.loading || this.data.saving || this.data.cancelDialog) return;
    const owner = session()?.userId || '';
    if (this.owner !== owner) {
      this.owner = owner;
      this.setData({
        registration: null,
        activity: null,
        canCancel: false,
        canCheckin: false,
        cancelClose: '',
      });
    }
    this.setData({
      loading: true,
      error: '',
    });
    try {
      const r = await api.registration(this.data.id);
      this.setData({
        registration: r,
        actionError: '',
        canCancel: r.allowedActions.includes('cancel'),
        canCheckin: r.allowedActions.includes('selfCheckin'),
        date: dateText(r.registeredAt),
        label: r.checkin
          ? '已签到'
          : r.status === 'ACTIVE'
            ? '报名成功'
            : r.status === 'EVENT_CANCELLED'
              ? '活动已取消'
              : '报名已取消',
      });
      try {
        const activity = await api.activity(r.activityId);
        this.setData({ activity, cancelClose: dateText(activity.cancelCloseAt) });
      } catch {
        this.setData({ actionError: '活动详情暂时不可用，你的报名记录仍已保留。' });
      }
    } catch (e) {
      if (e instanceof ApiError && [401, 403, 404].includes(e.status))
        this.setData({ registration: null, activity: null, canCancel: false, canCheckin: false });
      this.setData({ error: errorText(e) });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },
  activity() {
    const r = this.data.registration;
    if (r) go('activity', r.activityId);
  },
  cancel() {
    if (!this.data.registration || this.data.saving || this.data.loading || !this.data.canCancel)
      return;
    this.setData({ cancelDialog: true });
  },
  dismissCancel() {
    this.setData({ cancelDialog: false });
  },
  async confirmCancel() {
    const r = this.data.registration;
    if (!this.data.cancelDialog || !r || this.data.saving || !this.data.canCancel) return;
    this.setData({ cancelDialog: false, saving: true, canCancel: false });
    this.setData({ actionError: '' });
    let success = false;
    try {
      const key = await this.intent.for({ id: r.id, version: r.version });
      await api.cancel(r.id, r.version, key);
      this.intent.clear();
      success = true;
    } catch (e) {
      this.intent.failed(e);
      this.setData({ actionError: errorText(e), canCancel: true });
    } finally {
      this.setData({ saving: false });
    }
    if (success) await this.load();
  },
  async checkin() {
    const registration = this.data.registration;
    if (!registration || this.data.saving || this.data.loading || !this.data.canCheckin) return;
    this.setData({ saving: true, actionError: '' });
    let success = false;
    try {
      const scanned = await new Promise<WechatMiniprogram.ScanCodeSuccessCallbackResult>(
        (resolve, reject) => {
          wx.scanCode({
            onlyFromCamera: true,
            scanType: ['qrCode'],
            success: resolve,
            fail: reject,
          });
        },
      );
      if (this.disposed) return;
      const prefix = `longju:checkin:${registration.activityId}:`;
      if (
        !scanned.result.startsWith(prefix) ||
        !/^[A-Za-z0-9_-]{43}$/.test(scanned.result.slice(prefix.length))
      ) {
        throw new Error('请扫描本场活动的现场签到二维码。');
      }
      const result = await api.selfCheckin(registration.id, scanned.result);
      wx.showToast({
        title: result.result === 'ALREADY_CHECKED_IN' ? '你已签到' : '签到成功',
        icon: 'success',
      });
      success = true;
    } catch (e) {
      if (!(e && typeof e === 'object' && 'errMsg' in e && String(e.errMsg).includes('cancel'))) {
        this.setData({ actionError: errorText(e) });
      }
    } finally {
      this.setData({ saving: false });
    }
    if (success) await this.load();
  },
});

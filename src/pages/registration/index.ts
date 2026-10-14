import { api } from '../../api/client';
import { errorText, serverNow } from '../../api/request';
import type { Registration, Activity, Schema } from '../../api/types';
import { dateText, go, confirm } from '../../lib/view';
import { Intent } from '../../lib/intent';
import qr from '../../vendor/qrcode';
Page({
  data: {
    id: '',
    registration: null as Registration | null,
    activity: null as Activity | null,
    loading: false,
    error: '',
    saving: false,
    actionError: '',
    canCancel: false,
    canCheckin: false,
    label: '',
    date: '',
    cancelClose: '',
    qrUrl: '',
    expires: '',
    seconds: 0,
    refreshSeconds: 0,
    refreshAt: 0,
    expiresAt: 0,
  },
  intent: new Intent(),
  timer: 0,
  visible: false,
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
    this.clearQr();
  },
  onUnload() {
    this.visible = false;
    this.clearQr();
  },
  onPullDownRefresh() {
    void this.load();
  },
  clearQr() {
    if (this.timer) clearInterval(this.timer);
    this.timer = 0;
    this.setData({ qrUrl: '', expiresAt: 0, seconds: 0, refreshAt: 0, refreshSeconds: 0 });
  },
  async load() {
    if (this.data.loading || this.data.saving) return;
    this.clearQr();
    this.setData({
      loading: true,
      error: '',
      registration: null,
      activity: null,
      canCancel: false,
      canCheckin: false,
    });
    try {
      const r = await api.registration(this.data.id);
      this.setData({
        registration: r,
        canCancel: r.allowedActions.includes('cancel'),
        canCheckin: r.allowedActions.includes('refreshCheckinToken'),
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
  async cancel() {
    const r = this.data.registration;
    if (!r || this.data.saving || !this.data.canCancel) return;
    this.setData({ saving: true });
    if (
      !(await confirm(
        '取消报名',
        `将取消本人及同行共 ${r.participantCount} 人的报名。取消截止：${this.data.cancelClose}。确认取消吗？`,
      ))
    ) {
      this.setData({ saving: false });
      return;
    }
    this.setData({ actionError: '' });
    let success = false;
    try {
      const key = await this.intent.for({ id: r.id, version: r.version });
      await api.cancel(r.id, r.version, key);
      this.intent.clear();
      this.clearQr();
      success = true;
    } catch (e) {
      this.intent.failed(e);
      this.setData({ actionError: errorText(e) });
    } finally {
      this.setData({ saving: false });
    }
    if (success) await this.load();
  },
  async checkin() {
    if (this.data.saving || !this.data.canCheckin || serverNow() < this.data.refreshAt) return;
    this.setData({ saving: true, actionError: '' });
    try {
      const token = await api.checkin(this.data.id);
      if (!this.visible) return;
      this.renderToken(token);
    } catch (e) {
      this.clearQr();
      this.setData({ actionError: errorText(e) });
    } finally {
      this.setData({ saving: false });
    }
  },
  renderToken(token: Schema['CheckinTokenView']) {
    this.clearQr();
    const code = qr(0, 'M');
    code.addData(token.token);
    code.make();
    this.setData({
      qrUrl: code.createDataURL(6, 24),
      expires: dateText(token.expiresAt),
      expiresAt: Date.parse(token.expiresAt),
      refreshAt: Date.parse(token.refreshAfter),
    });
    this.tick();
    if (this.data.seconds > 0) this.timer = setInterval(() => this.tick(), 1000);
  },
  tick() {
    const seconds = Math.max(0, Math.ceil((this.data.expiresAt - serverNow()) / 1000));
    this.setData({
      seconds,
      refreshSeconds: Math.max(0, Math.ceil((this.data.refreshAt - serverNow()) / 1000)),
    });
    if (!seconds) this.clearQr();
  },
});

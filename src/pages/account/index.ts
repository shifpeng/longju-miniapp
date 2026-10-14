import { api } from '../../api/client';
import { clearSession, errorText, wechatCode } from '../../api/request';
import type { Me } from '../../api/types';
import { Intent } from '../../lib/intent';
import { confirm, membership } from '../../lib/view';
Page({
  data: {
    me: null as Me | null,
    loading: false,
    saving: false,
    error: '',
    actionError: '',
    canExit: false,
    title: '',
    closed: false,
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
    if (this.data.closed || this.data.saving) {
      wx.stopPullDownRefresh();
      return;
    }
    this.setData({ loading: true, error: '', me: null, canExit: false });
    try {
      const me = await api.me();
      this.setData({
        me,
        title: membership(me).title,
        canExit: me.qualification === 'ACTIVE' || me.qualification === 'DISABLED',
      });
    } catch (e) {
      this.setData({ error: errorText(e) });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },
  async exit() {
    const me = this.data.me;
    if (!me?.profile || !this.data.canExit || this.data.saving) return;
    this.setData({ saving: true, actionError: '' });
    let success = false;
    try {
      if (
        !(await confirm(
          '退出老乡社群',
          '退出后将无法访问成员名录或新增成员活动报名。已有报名不会自动取消，仍需到「我的报名」处理。确认退出吗？',
        ))
      )
        return;
      const key = await this.intent.for({
        action: 'exit',
        userId: me.userId,
        version: me.profile.version,
      });
      await api.exitMembership(me.profile.version, key);
      this.intent.clear();
      success = true;
    } catch (e) {
      this.intent.failed(e);
      this.setData({ actionError: errorText(e) });
    } finally {
      this.setData({ saving: false });
    }
    if (success) await this.load();
  },
  async close() {
    const me = this.data.me;
    if (!me || this.data.saving || this.data.closed) return;
    this.setData({ saving: true, actionError: '' });
    try {
      if (
        !(await confirm(
          '申请注销账号',
          '注销申请受理后账号将冻结、退出登录，并开始处理个人资料和关联报名。该操作无法在小程序中撤销，是否继续？',
        ))
      )
        return;
      const confirmationCode = await wechatCode();
      const key = await this.intent.for({ action: 'closure', confirmationCode });
      await api.closeAccount(confirmationCode, key);
      this.intent.clear();
      clearSession();
      this.setData({ closed: true, me: null, canExit: false });
    } catch (e) {
      this.intent.failed(e);
      this.setData({
        actionError:
          errorText(e) + '。如网络中断，结果可能尚未返回，请勿反复提交，可重新登录核实账号状态。',
      });
    } finally {
      this.setData({ saving: false });
    }
  },
  home() {
    wx.reLaunch({ url: '/pages/home/index' });
  },
});

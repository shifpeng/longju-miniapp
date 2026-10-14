import { api } from '../../api/client';
import { isLoggedIn, login, logout, errorText } from '../../api/request';
import type { Me } from '../../api/types';
import { membership, go, confirm } from '../../lib/view';
import { selectTab } from '../../lib/view';
Page({
  data: {
    me: null as Me | null,
    card: membership(null),
    loggedIn: false,
    loading: false,
    error: '',
    qualificationLabel: '',
    identityName: '欢迎来到老乡社群',
    identityInitial: '陇',
  },
  onShow() {
    selectTab(3);
    void this.load();
  },
  onPullDownRefresh() {
    void this.load();
  },
  async load() {
    this.setData({
      loading: true,
      error: '',
      me: null,
      loggedIn: isLoggedIn(),
      card: membership(null),
    });
    try {
      const me = isLoggedIn() ? await api.me() : null;
      const applicationStatus = me?.applicationSummary?.status;
      const qualificationLabel = me
        ? (
            {
              ACTIVE: '已通过审核',
              DISABLED: '资格已停用',
              LEFT: '已退出社群',
              NONE:
                applicationStatus === 'PENDING'
                  ? '等待审核'
                  : applicationStatus === 'NEEDS_INFO'
                    ? '待补充资料'
                    : applicationStatus === 'REJECTED'
                      ? '未通过审核'
                      : '尚未加入',
            } as Record<string, string>
          )[me.qualification]
        : '';
      const identityName = me?.profile?.name || (isLoggedIn() ? '老乡，你好' : '欢迎来到老乡社群');
      this.setData({
        me,
        card: membership(me),
        loggedIn: isLoggedIn(),
        qualificationLabel,
        identityName,
        identityInitial: me?.profile?.name?.slice(0, 1) || '陇',
      });
    } catch (e) {
      this.setData({ error: errorText(e) });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },
  async signIn() {
    if (this.data.loading) return;
    this.setData({ loading: true, error: '' });
    try {
      await login();
    } catch (e) {
      this.setData({ error: errorText(e), loading: false });
      return;
    }
    this.setData({ loading: false });
    await this.load();
  },
  open(e: WechatMiniprogram.TouchEvent) {
    go(e.currentTarget.dataset.page);
  },
  async signOut() {
    if (!(await confirm('退出登录', '退出后可重新登录，已有申请和报名会保留。'))) return;
    try {
      await logout();
      await this.load();
    } catch (e) {
      this.setData({ error: errorText(e) });
    }
  },
});

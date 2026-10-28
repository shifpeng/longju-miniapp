import { api } from '../../api/client';
import { isLoggedIn, login, logout, errorText, session } from '../../api/request';
import type { Me } from '../../api/types';
import { membership, go, confirm } from '../../lib/view';
import { selectTab } from '../../lib/view';
import { runtime } from '../../config/runtime';
Page({
  data: {
    me: null as Me | null,
    card: membership(null),
    loggedIn: false,
    loading: false,
    loaded: false,
    error: '',
    qualificationLabel: '',
    identityName: '欢迎来到老乡社群',
    identityInitial: '陇',
    agreementReady: !!(runtime.agreement.version && runtime.agreement.body),
  },
  owner: '',
  sequence: 0,
  onShow() {
    selectTab(3);
    void this.load();
  },
  onPullDownRefresh() {
    void this.load();
  },
  async load() {
    const owner = session()?.userId || '';
    const seq = ++this.sequence;
    if (owner !== this.owner) {
      this.owner = owner;
      this.setData({
        me: null,
        card: membership(null),
        loaded: false,
        qualificationLabel: '',
        identityName: '欢迎来到老乡社群',
        identityInitial: '陇',
      });
    }
    this.setData({ loading: true, error: '', loggedIn: !!owner });
    try {
      const me = isLoggedIn() ? await api.me() : null;
      if (seq !== this.sequence || owner !== (session()?.userId || '')) return;
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
        loaded: true,
        me,
        card: membership(me),
        loggedIn: isLoggedIn(),
        qualificationLabel,
        identityName,
        identityInitial: me?.profile?.name?.slice(0, 1) || '陇',
      });
    } catch (e) {
      if (seq === this.sequence && owner === (session()?.userId || ''))
        this.setData({ error: errorText(e) });
    } finally {
      if (seq === this.sequence) this.setData({ loading: false });
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

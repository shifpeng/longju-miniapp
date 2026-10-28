import { refreshPages } from '../../lib/refresh';
import { mapLimited } from '../../lib/dictionaries';
import { api } from '../../api/client';
import { session, ApiError, errorText } from '../../api/request';
import type { Registration } from '../../api/types';
import { go, dateText } from '../../lib/view';
interface Item extends Registration {
  title: string;
  date: string;
  label: string;
}
Page({
  data: { items: [] as Item[], loading: false, loaded: false, error: '', page: 0, total: 0 },
  owner: '',
  sequence: 0,
  onShow() {
    void this.load(true);
  },
  onPullDownRefresh() {
    void this.load(true);
  },
  onReachBottom() {
    if (this.data.items.length < this.data.total) void this.load(false);
  },
  retryReset: true,
  retry() {
    void this.load(this.retryReset);
  },
  loadMore() {
    void this.load(false);
  },
  async load(reset: boolean) {
    if (this.data.loading && !reset && this.owner === (session()?.userId || '')) return;
    let owner = session()?.userId || '';
    const seq = ++this.sequence;
    if (owner !== this.owner) {
      this.owner = owner;
      this.setData({ items: [], page: 0, total: 0, loaded: false });
    }
    this.retryReset = reset;
    this.setData({ loading: true, error: '' });
    const current = () => seq === this.sequence && owner === (session()?.userId || '');
    try {
      const result = reset
        ? await refreshPages((page) => api.registrations(page), this.data.page)
        : await api.registrations(this.data.page + 1);
      if (!owner && seq === this.sequence) this.owner = owner = session()?.userId || '';
      const items = await mapLimited(result.items, async (r) => {
        let title = '查看活动';
        try {
          title = (await api.activity(r.activityId)).title;
        } catch {
          /* A withdrawn activity does not hide the owner's registration. */
        }
        return {
          ...r,
          title,
          date: dateText(r.registeredAt),
          label: r.checkin
            ? '已签到'
            : r.status === 'ACTIVE'
              ? '报名成功'
              : r.status === 'EVENT_CANCELLED'
                ? '活动已取消'
                : '报名已取消',
        };
      });
      if (!current()) return;
      this.setData({
        loaded: true,
        items: (reset ? [] : this.data.items).concat(items),
        page: result.page,
        total: result.total,
      });
    } catch (e) {
      if (current()) {
        if (e instanceof ApiError && [401, 403, 404].includes(e.status))
          this.setData({ items: [], page: 0, total: 0, loaded: false });
        this.setData({ error: errorText(e) });
      }
    } finally {
      if (seq === this.sequence) this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },
  open(e: WechatMiniprogram.TouchEvent) {
    go('registration', e.currentTarget.dataset.id);
  },
});

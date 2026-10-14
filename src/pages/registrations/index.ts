import { mapLimited } from '../../lib/dictionaries';
import { api } from '../../api/client';
import { errorText } from '../../api/request';
import type { Registration } from '../../api/types';
import { go, dateText } from '../../lib/view';
interface Item extends Registration {
  title: string;
  date: string;
  label: string;
}
Page({
  data: { items: [] as Item[], loading: false, error: '', page: 0, total: 0 },
  onShow() {
    void this.load(true);
  },
  onPullDownRefresh() {
    void this.load(true);
  },
  onReachBottom() {
    if (this.data.items.length < this.data.total) void this.load(false);
  },
  retry() {
    void this.load(this.data.page === 0);
  },
  async load(reset: boolean) {
    if (this.data.loading) return;
    this.setData({ loading: true, error: '', ...(reset ? { items: [], page: 0, total: 0 } : {}) });
    try {
      const result = await api.registrations(reset ? 1 : this.data.page + 1);
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
      this.setData({
        items: (reset ? [] : this.data.items).concat(items),
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
  open(e: WechatMiniprogram.TouchEvent) {
    go('registration', e.currentTarget.dataset.id);
  },
});

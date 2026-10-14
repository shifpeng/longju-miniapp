import { api } from '../../api/client';
import { errorText } from '../../api/request';
import { activityView } from '../../lib/view';
import { selectTab } from '../../lib/view';
Page({
  data: {
    items: [] as ReturnType<typeof activityView>[],
    loading: false,
    error: '',
    page: 0,
    total: 0,
    lifecycle: '',
    sequence: 0,
  },
  onShow() {
    selectTab(2);
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
    if (this.data.loading && !reset) return;
    const seq = ++this.data.sequence;
    const page = reset ? 1 : this.data.page + 1;
    this.setData({ loading: true, error: '', ...(reset ? { items: [], page: 0, total: 0 } : {}) });
    try {
      const result = await api.activities(page, this.data.lifecycle);
      if (seq === this.data.sequence)
        this.setData({
          items: (reset ? [] : this.data.items).concat(result.items.map(activityView)),
          page: result.page,
          total: result.total,
        });
    } catch (e) {
      if (seq === this.data.sequence) this.setData({ error: errorText(e) });
    } finally {
      if (seq === this.data.sequence) this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },
  filter(e: WechatMiniprogram.TouchEvent) {
    this.setData({ lifecycle: e.currentTarget.dataset.value });
    void this.load(true);
  },
});

import { memberLabels } from '../../lib/dictionaries';
import { api } from '../../api/client';
import { errorText, isLoggedIn } from '../../api/request';
import type { Member } from '../../api/types';
import { go, selectTab } from '../../lib/view';
Page({
  data: {
    items: [] as (Member & {
      hometownLabel?: string;
      residenceLabel?: string;
      industryLabel?: string;
      initial?: string;
    })[],
    loading: false,
    error: '',
    page: 0,
    total: 0,
    q: '',
    activeQuery: '',
    permitted: false,
    checked: false,
    sequence: 0,
  },
  onShow() {
    selectTab(1);
    void this.load(true);
  },
  onPullDownRefresh() {
    void this.load(true);
  },
  onReachBottom() {
    if (this.data.items.length < this.data.total) void this.load(false);
  },
  input(e: WechatMiniprogram.Input) {
    this.setData({ q: e.detail.value });
  },
  search() {
    this.setData({ activeQuery: this.data.q.trim() });
    void this.load(true);
  },
  retry() {
    void this.load(this.data.page === 0);
  },
  async load(reset: boolean) {
    if (this.data.loading && !reset) return;
    const seq = ++this.data.sequence;
    this.setData({
      loading: true,
      error: '',
      ...(reset ? { items: [], page: 0, total: 0, checked: false, permitted: false } : {}),
    });
    try {
      if (!isLoggedIn()) {
        this.setData({ checked: true, permitted: false });
        return;
      }
      const me = await api.me();
      if (seq !== this.data.sequence) return;
      if (me.qualification !== 'ACTIVE') {
        this.setData({ checked: true, permitted: false });
        return;
      }
      const result = await api.members(reset ? 1 : this.data.page + 1, this.data.activeQuery);
      const items = (await memberLabels(result.items)).map((item) => ({
        ...item,
        initial: item.name.slice(0, 1) || '陇',
      }));
      if (seq === this.data.sequence)
        this.setData({
          items: (reset ? [] : this.data.items).concat(items),
          page: result.page,
          total: result.total,
          permitted: true,
          checked: true,
        });
    } catch (e) {
      if (seq === this.data.sequence) this.setData({ error: errorText(e), items: [] });
    } finally {
      if (seq === this.data.sequence) this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },
  open(e: WechatMiniprogram.TouchEvent) {
    go('member', e.currentTarget.dataset.id);
  },
  apply() {
    go('application');
  },
});

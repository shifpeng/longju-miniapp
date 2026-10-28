import { refreshPages } from '../../lib/refresh';
import { memberLabels } from '../../lib/dictionaries';
import { api } from '../../api/client';
import { session, ApiError, errorText, isLoggedIn } from '../../api/request';
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
    loaded: false,
  },
  owner: '',
  sequence: 0,
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
    this.setData({ activeQuery: this.data.q.trim(), items: [], page: 0, total: 0, loaded: false });
    void this.load(true);
  },
  retryReset: true,
  retry() {
    void this.load(this.retryReset);
  },
  loadMore() {
    void this.load(false);
  },
  async load(reset: boolean) {
    if (this.data.loading && !reset) return;
    const owner = session()?.userId || '';
    const seq = ++this.sequence;
    if (owner !== this.owner) {
      this.owner = owner;
      this.setData({
        items: [],
        page: 0,
        total: 0,
        loaded: false,
        checked: false,
        permitted: false,
      });
    }
    this.retryReset = reset;
    this.setData({ loading: true, error: '' });
    const query = this.data.activeQuery;
    const current = () => seq === this.sequence && owner === (session()?.userId || '');
    try {
      if (!isLoggedIn()) {
        this.setData({
          checked: true,
          permitted: false,
          items: [],
          page: 0,
          total: 0,
          loaded: true,
        });
        return;
      }
      const me = await api.me();
      if (!current()) return;
      if (me.qualification !== 'ACTIVE') {
        this.setData({
          checked: true,
          permitted: false,
          items: [],
          page: 0,
          total: 0,
          loaded: true,
        });
        return;
      }
      const result = reset
        ? await refreshPages((page) => api.members(page, query), this.data.page)
        : await api.members(this.data.page + 1, query);
      const items = (await memberLabels(result.items)).map((item) => ({
        ...item,
        initial: item.name.slice(0, 1) || '陇',
      }));
      if (current())
        this.setData({
          items: (reset ? [] : this.data.items).concat(items),
          page: result.page,
          total: result.total,
          loaded: true,
          permitted: true,
          checked: true,
        });
    } catch (e) {
      if (current()) {
        if (e instanceof ApiError && [401, 403, 404].includes(e.status))
          this.setData({ items: [], permitted: false, checked: false, loaded: false });
        this.setData({ error: errorText(e) });
      }
    } finally {
      if (seq === this.sequence) this.setData({ loading: false });
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

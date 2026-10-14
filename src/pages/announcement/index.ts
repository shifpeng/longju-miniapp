import { api } from '../../api/client';
import { errorText } from '../../api/request';
import type { Announcement } from '../../api/types';
import { dateText } from '../../lib/view';
Page({
  data: { id: '', item: null as Announcement | null, loading: false, error: '', published: '' },
  onLoad(o) {
    this.setData({ id: o.id || '' });
    void this.load();
  },
  onPullDownRefresh() {
    void this.load();
  },
  async load() {
    this.setData({ loading: true, error: '', item: null });
    try {
      const item = await api.announcement(this.data.id);
      this.setData({ item, published: dateText(item.publishedAt) });
    } catch (e) {
      this.setData({ error: errorText(e) });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },
});

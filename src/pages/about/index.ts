Page({
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  copy(e: WechatMiniprogram.TouchEvent) {
    wx.setClipboardData({ data: e.currentTarget.dataset.url });
  },
});

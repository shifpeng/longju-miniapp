import { runtime } from '../../config/runtime';
Page({
  data: { agreement: runtime.agreement },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
});

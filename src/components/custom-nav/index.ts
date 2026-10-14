Component({
  properties: {
    title: { type: String, value: '西引力.陇聚' },
    back: { type: Boolean, value: false },
  },
  data: {
    height: 92,
    titleTop: 52,
    lineHeight: 32,
    rightGap: 110,
  },
  lifetimes: {
    attached() {
      const info = wx.getWindowInfo();
      const menu = wx.getMenuButtonBoundingClientRect();
      const menuTop = menu.top || info.statusBarHeight + 6;
      const menuHeight = menu.height || 32;
      this.setData({
        height: (menu.bottom || menuTop + menuHeight) + 8,
        titleTop: menuTop,
        lineHeight: menuHeight,
        rightGap: Math.max(16, info.windowWidth - (menu.left || info.windowWidth - 96) + 12),
      });
    },
  },
  methods: {
    goBack() {
      if (getCurrentPages().length > 1) wx.navigateBack();
      else wx.switchTab({ url: '/pages/home/index' });
    },
  },
});

const tabs = [
  {
    pagePath: 'pages/home/index',
    text: '首页',
    iconPath: '/assets/tabs/home.png',
    selectedIconPath: '/assets/tabs/home-active.png',
  },
  {
    pagePath: 'pages/members/index',
    text: '老乡录',
    iconPath: '/assets/tabs/members.png',
    selectedIconPath: '/assets/tabs/members-active.png',
  },
  {
    pagePath: 'pages/activities/index',
    text: '活动',
    iconPath: '/assets/tabs/activities.png',
    selectedIconPath: '/assets/tabs/activities-active.png',
  },
  {
    pagePath: 'pages/mine/index',
    text: '我的',
    iconPath: '/assets/tabs/mine.png',
    selectedIconPath: '/assets/tabs/mine-active.png',
  },
];
Component({
  data: { selected: 0, list: tabs },
  pageLifetimes: {
    show() {
      const page = getCurrentPages().slice(-1)[0];
      const selected = tabs.findIndex((tab) => tab.pagePath === page?.route);
      if (selected >= 0) this.setData({ selected });
    },
  },
  methods: {
    switchTab(e: WechatMiniprogram.TouchEvent) {
      const item = tabs[Number(e.currentTarget.dataset.index)];
      if (item && Number(e.currentTarget.dataset.index) !== this.data.selected)
        wx.switchTab({ url: `/${item.pagePath}` });
    },
  },
});

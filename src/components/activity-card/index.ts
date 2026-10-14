Component({
  properties: { item: Object, compact: Boolean },
  methods: {
    open() {
      wx.navigateTo({ url: '/pages/activity/index?id=' + encodeURIComponent(this.data.item.id) });
    },
  },
});

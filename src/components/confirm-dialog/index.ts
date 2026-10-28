Component({
  properties: {
    open: Boolean,
    title: String,
    content: String,
    detail: String,
    confirmText: { type: String, value: '确认' },
    cancelText: { type: String, value: '再想想' },
  },
  methods: {
    dismiss() {
      this.triggerEvent('dismiss');
    },
    confirm() {
      this.triggerEvent('confirm');
    },
    preventScroll() {},
  },
});

import { api } from '../../api/client';
import { session, serverNow, errorText, ApiError } from '../../api/request';
import type { Me, Announcement } from '../../api/types';
import { membership, activityView, go, selectTab, dateText } from '../../lib/view';
import { homeCarousel } from '../../lib/home-carousel';
import { nextGathering } from '../../lib/next-gathering';
Page({
  carouselTimer: null as ReturnType<typeof setTimeout> | null,
  visible: false,
  renewingCarousel: false,
  owner: null as string | null,
  loadVersion: 0,
  data: {
    nextGathering: null as Awaited<ReturnType<typeof nextGathering>>,
    registrationError: '',
    carouselFailed: {} as Record<string, boolean>,
    carouselRetrying: {} as Record<string, boolean>,
    carouselRenewError: '',
    carouselError: '',
    carousel: [] as Awaited<ReturnType<typeof homeCarousel>>,
    loading: false,
    loaded: false,
    activitiesLoaded: false,
    carouselRequested: [true],
    carouselIndex: 0,
    carouselFirstLoaded: false,
    error: '',
    me: null as Me | null,
    card: membership(null),
    announcements: [] as Announcement[],
    activities: [] as ReturnType<typeof activityView>[],
  },
  onShow() {
    this.visible = true;
    selectTab(0);
    void this.load();
  },
  onHide() {
    this.visible = false;
    this.clearCarouselTimer();
  },
  onUnload() {
    this.loadVersion++;
    this.visible = false;
    this.clearCarouselTimer();
  },
  clearCarouselTimer() {
    if (this.carouselTimer) clearTimeout(this.carouselTimer);
    this.carouselTimer = null;
  },
  onPullDownRefresh() {
    void this.load();
  },
  async load() {
    const owner = session()?.userId ?? null;
    const ownerChanged = owner !== this.owner;
    if (this.data.loading && !ownerChanged) return;
    const version = ++this.loadVersion;
    this.owner = owner;
    this.clearCarouselTimer();
    if (ownerChanged) {
      this.setData({
        loaded: false,
        me: null,
        card: membership(null),
        nextGathering: null,
        carousel: [],
        carouselFailed: {},
        carouselRetrying: {},
        carouselRequested: [true],
        carouselIndex: 0,
        carouselFirstLoaded: false,
        activitiesLoaded: false,
        announcements: [],
        activities: [],
        error: '',
        registrationError: '',
        carouselError: '',
      });
    }
    this.setData({ loading: true, carouselRetrying: {}, carouselRenewError: '' });
    const current = () => version === this.loadVersion && (session()?.userId ?? null) === owner;
    const errors: string[] = [];
    const publicSection = async (kind: 'announcements' | 'activities') => {
      try {
        const result =
          kind === 'announcements'
            ? await api.announcements()
            : await api.activities(1, 'UPCOMING');
        if (!current()) return;
        const items =
          kind === 'announcements'
            ? result.items
            : (result.items as Parameters<typeof activityView>[0][]).slice(0, 3).map(activityView);
        if (JSON.stringify(items) !== JSON.stringify(this.data[kind]))
          this.setData({ [kind]: items });
      } catch (e) {
        if (current()) {
          errors.push(errorText(e));
          this.setData({ error: errors.join('；') });
        }
      } finally {
        if (kind === 'activities' && current()) this.setData({ activitiesLoaded: true });
      }
    };
    const memberSection = async () => {
      const update = {
        me: null as Me | null,
        card: membership(null),
        nextGathering: null as Awaited<ReturnType<typeof nextGathering>>,
        carousel: [] as Awaited<ReturnType<typeof homeCarousel>>,
        registrationError: '',
        carouselError: '',
        loaded: true,
      };
      const commit = () => {
        if (!current()) return;
        const patch: Partial<typeof update> = { ...update };
        if (JSON.stringify(update.carousel) === JSON.stringify(this.data.carousel))
          delete patch.carousel;
        const changedPhotos =
          update.carousel.map((photo) => photo.key).join(',') !==
          this.data.carousel.map((photo) => photo.key).join(',');
        this.setData({
          ...patch,
          carouselFailed: Object.fromEntries(
            update.carousel
              .filter(
                (photo) =>
                  this.data.carouselFailed[photo.key] &&
                  this.data.carousel.some((old) => old.key === photo.key && old.url === photo.url),
              )
              .map((photo) => [photo.key, true]),
          ),
          ...(changedPhotos
            ? {
                carouselRequested:
                  this.data.carousel.length === 1 &&
                  update.carousel[0]?.key === this.data.carousel[0]?.key &&
                  this.data.carouselFirstLoaded
                    ? [true, true]
                    : [true],
                carouselIndex: 0,
                carouselFirstLoaded:
                  update.carousel[0]?.key === this.data.carousel[0]?.key &&
                  this.data.carouselFirstLoaded,
              }
            : {}),
        });
      };
      try {
        if (session()) {
          const summary = await api.homeSummary();
          update.me = summary.me;
          if (summary.nextGathering) {
            update.nextGathering = {
              ...summary.nextGathering,
              date: dateText(summary.nextGathering.startAt),
            };
          }
          if (update.me.qualification === 'ACTIVE' && !update.nextGathering) {
            try {
              update.carousel = await homeCarousel(
                this.data.carousel,
                summary.carousel,
                !this.data.carousel.length
                  ? (first) => {
                      update.carousel = [first];
                      commit();
                    }
                  : undefined,
                current,
              );
            } catch (e) {
              if (!update.carousel.length) update.carouselError = errorText(e);
              else {
                errors.push(errorText(e));
                this.setData({ error: errors.join('；') });
              }
            }
          }
        }
        if (!current()) return;
        update.card = membership(update.me);
      } catch (e) {
        if (!current()) return;
        errors.push(errorText(e));
        this.setData({ error: errors.join('；') });
        update.card = {
          title: '身份状态读取失败',
          detail: '请刷新后查看申请或成员状态',
          action: '重试',
        };
        commit();
        return;
      }
      commit();
      if (current()) this.scheduleCarouselRenewal();
    };
    try {
      this.setData({ error: '' });
      await Promise.all([
        memberSection(),
        publicSection('announcements'),
        publicSection('activities'),
      ]);
    } finally {
      if (version === this.loadVersion) {
        this.setData({ loading: false });
        wx.stopPullDownRefresh();
        // A session may change while a request is in flight. Discard its result and
        // immediately reload under the new owner, clearing the previous member UI.
        if (!current()) void this.load();
      }
    }
  },
  apply() {
    if (this.data.card.action === '重试') {
      void this.load();
      return;
    }
    go(this.data.me?.qualification === 'ACTIVE' ? 'profile' : 'application');
  },
  carouselChange(e: WechatMiniprogram.CustomEvent<{ current: number }>) {
    const index = e.detail.current;
    const requested = [...this.data.carouselRequested];
    requested[index] = true;
    if (this.data.carousel.length > 1) requested[(index + 1) % this.data.carousel.length] = true;
    this.setData({ carouselIndex: index, carouselRequested: requested });
  },
  carouselImageLoad(e: WechatMiniprogram.TouchEvent) {
    const index = Number(e.currentTarget.dataset.index);
    if (index === 0) this.setData({ carouselFirstLoaded: true });
    if (index !== this.data.carouselIndex || !this.data.carousel.length) return;
    const requested = [...this.data.carouselRequested];
    requested[(index + 1) % this.data.carousel.length] = true;
    this.setData({ carouselRequested: requested });
  },
  openRecap(e: WechatMiniprogram.TouchEvent) {
    go('activity', e.currentTarget.dataset.id);
  },
  carouselImageError(e: WechatMiniprogram.TouchEvent) {
    const key = String(e.currentTarget.dataset.key || '');
    if (!this.data.carousel.some((photo) => photo.key === key)) return;
    this.setData({ carouselFailed: { ...this.data.carouselFailed, [key]: true } });
  },
  async retryCarouselImage(e: WechatMiniprogram.TouchEvent) {
    const key = String(e.currentTarget.dataset.key || '');
    const photo = this.data.carousel.find((item) => item.key === key);
    if (!photo || this.data.carouselRetrying[key]) return;
    const version = this.loadVersion;
    const owner = this.owner;
    const current = () => this.loadVersion === version && (session()?.userId ?? null) === owner;
    this.setData({ carouselRetrying: { ...this.data.carouselRetrying, [key]: true } });
    try {
      const [fresh] = await homeCarousel([], [photo], undefined, current);
      if (!current()) return;
      const latest = this.data.carousel.find((item) => item.key === key);
      if (latest?.recapVersion !== photo.recapVersion || latest.url !== photo.url) return;
      this.setData({
        carousel: this.data.carousel.map((item) => (item.key === key ? fresh : item)),
        carouselFailed: { ...this.data.carouselFailed, [key]: false },
      });
      this.scheduleCarouselRenewal();
    } catch (error) {
      if (current()) wx.showToast({ title: errorText(error), icon: 'none' });
    } finally {
      if (current())
        this.setData({ carouselRetrying: { ...this.data.carouselRetrying, [key]: false } });
    }
  },
  scheduleCarouselRenewal(delay?: number) {
    this.clearCarouselTimer();
    if (!this.visible || !this.data.carousel.length) return;
    const wait =
      delay ??
      Math.max(1000, Math.min(...this.data.carousel.map((photo) => photo.renewAt)) - serverNow());
    this.carouselTimer = setTimeout(() => void this.renewCarousel(), wait);
  },
  async renewCarousel() {
    if (!this.visible || !this.data.carousel.length) return;
    this.clearCarouselTimer();
    if (this.data.loading || this.renewingCarousel) {
      this.scheduleCarouselRenewal(1000);
      return;
    }
    const version = this.loadVersion;
    const owner = this.owner;
    const current = () =>
      version === this.loadVersion && this.visible && (session()?.userId ?? null) === owner;
    this.renewingCarousel = true;
    try {
      const carousel = await homeCarousel(this.data.carousel, undefined, undefined, current);
      if (!current()) return;
      const sameOrder =
        carousel.map((photo) => photo.key).join(',') ===
        this.data.carousel.map((photo) => photo.key).join(',');
      this.setData({
        carousel,
        carouselRenewError: '',
        carouselFailed: {},
        ...(sameOrder
          ? {}
          : { carouselRequested: [true], carouselIndex: 0, carouselFirstLoaded: false }),
      });
      this.scheduleCarouselRenewal();
    } catch (error) {
      if (!current()) return;
      // A denial must remove private photos. Transport failures retain already loaded bytes.
      if (error instanceof ApiError && [401, 403, 404].includes(error.status)) {
        this.setData({ carousel: [], carouselError: errorText(error) });
      } else {
        this.setData({ carouselRenewError: '照片更新暂时失败，稍后自动重试' });
        this.scheduleCarouselRenewal(60_000);
      }
    } finally {
      this.renewingCarousel = false;
      if (this.visible && version === this.loadVersion && (session()?.userId ?? null) !== owner)
        void this.load();
    }
  },
  openRegistration() {
    if (this.data.nextGathering) go('registration', this.data.nextGathering.id);
  },
  notice(e: WechatMiniprogram.TouchEvent) {
    go('announcement', e.currentTarget.dataset.id);
  },
  events() {
    wx.switchTab({ url: '/pages/activities/index' });
  },
});

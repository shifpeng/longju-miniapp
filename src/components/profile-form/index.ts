import { api } from '../../api/client';
import { errorText } from '../../api/request';
import type { Option } from '../../api/types';
Component({
  properties: {
    value: { type: Object, value: {} as Record<string, string> },
    phoneEditable: { type: Boolean, value: true },
    disabled: Boolean,
  },
  data: {
    cities: [] as Option[],
    counties: [] as Option[],
    residences: [] as Option[],
    industries: [] as Option[],
    cityName: '选择甘肃市 / 州',
    countyName: '选择家乡区 / 县',
    residenceName: '选择现居西安区域',
    industryName: '选择行业',
    error: '',
    loading: false,
    sequence: 0,
  },
  lifetimes: {
    attached() {
      void this.load();
    },
  },
  observers: {
    value() {
      void this.labels();
    },
  },
  methods: {
    async load() {
      this.setData({ loading: true, error: '' });
      try {
        const [cities, residences, industries] = await Promise.all([
          api.regions('620000'),
          api.regions('610100'),
          api.industries(),
        ]);
        this.setData({ cities, residences, industries });
        await this.labels();
      } catch (e) {
        this.setData({ error: errorText(e) });
      } finally {
        this.setData({ loading: false });
      }
    },
    async labels() {
      const v = this.data.value;
      this.setData({
        residenceName:
          this.data.residences.find((x) => x.code === v.residenceCode)?.name || '选择现居西安区域',
        industryName:
          this.data.industries.find((x) => x.code === v.industryCode)?.name || '选择行业',
      });
      if (v.hometownCode && !this.data.counties.some((x) => x.code === v.hometownCode)) {
        const city = this.data.cities.find(
          (x) => x.code.slice(0, 4) === v.hometownCode.slice(0, 4),
        );
        if (city) {
          const seq = ++this.data.sequence;
          try {
            const counties = await api.regions(city.code);
            if (seq === this.data.sequence)
              this.setData({
                counties,
                cityName: city.name,
                countyName:
                  counties.find((x) => x.code === v.hometownCode)?.name || '选择家乡区 / 县',
              });
          } catch (e) {
            this.setData({ error: errorText(e) });
          }
        }
      }
    },
    change(field: string, value: string) {
      this.triggerEvent('change', { ...this.data.value, [field]: value });
    },
    input(e: WechatMiniprogram.Input) {
      this.change(e.currentTarget.dataset.field, e.detail.value);
    },
    async city(e: WechatMiniprogram.PickerChange) {
      const city = this.data.cities[Number(e.detail.value)];
      const seq = ++this.data.sequence;
      this.setData({ cityName: city.name, countyName: '选择家乡区 / 县', counties: [], error: '' });
      this.change('hometownCode', '');
      try {
        const counties = await api.regions(city.code);
        if (seq === this.data.sequence) this.setData({ counties });
      } catch (error) {
        this.setData({ error: errorText(error) });
      }
    },
    county(e: WechatMiniprogram.PickerChange) {
      const value = this.data.counties[Number(e.detail.value)];
      if (value) {
        this.setData({ countyName: value.name });
        this.change('hometownCode', value.code);
      }
    },
    residence(e: WechatMiniprogram.PickerChange) {
      const value = this.data.residences[Number(e.detail.value)];
      if (value) {
        this.setData({ residenceName: value.name });
        this.change('residenceCode', value.code);
      }
    },
    industry(e: WechatMiniprogram.PickerChange) {
      const value = this.data.industries[Number(e.detail.value)];
      if (value) {
        this.setData({ industryName: value.name });
        this.change('industryCode', value.code);
      }
    },
  },
});

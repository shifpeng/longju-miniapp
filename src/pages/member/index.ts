import { memberLabels } from '../../lib/dictionaries';
import { api } from '../../api/client';
import { errorText } from '../../api/request';
import type { Member } from '../../api/types';
import { mediaUrls } from '../../lib/media';
Page({
  data: {
    id: '',
    member: null as
      (Member & { hometownLabel?: string; residenceLabel?: string; industryLabel?: string }) | null,
    avatar: '',
    loading: false,
    error: '',
  },
  onLoad(o) {
    this.setData({ id: o.id || '' });
  },
  onShow() {
    void this.load();
  },
  onPullDownRefresh() {
    void this.load();
  },
  async load() {
    this.setData({ loading: true, error: '', member: null, avatar: '' });
    try {
      const member = await api.member(this.data.id);
      const [labeled] = await memberLabels([member]);
      this.setData({ member: labeled });
      if (member.avatarAssetId) {
        try {
          const urls = await mediaUrls('MEMBER_PROFILE', member.id, member.version, [
            member.avatarAssetId,
          ]);
          this.setData({ avatar: urls[0] });
        } catch {
          /* Member text remains usable when avatar service is unavailable. */
        }
      }
    } catch (e) {
      this.setData({ error: errorText(e) });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },
  call() {
    const phone = this.data.member?.phone;
    if (phone) wx.makePhoneCall({ phoneNumber: phone });
  },
});

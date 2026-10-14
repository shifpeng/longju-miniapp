import type { Activity, Me } from '../api/types';
export function selectTab(index: number) {
  const pages = getCurrentPages() as unknown as Array<{
    getTabBar?: () => { setData: (value: { selected: number }) => void };
  }>;
  pages[pages.length - 1]?.getTabBar?.()?.setData({ selected: index });
}
export function membership(me: Me | null) {
  if (!me) return { title: '加入老乡社群', detail: '联络老乡 · 报名活动', action: '申请加入' };
  if (me.qualification === 'ACTIVE')
    return {
      title: me.profile?.name || '老乡，欢迎回来',
      detail: '已加入老乡社群',
      action: '查看我的资料',
    };
  if (me.qualification === 'DISABLED')
    return {
      title: '成员资格已停用',
      detail: '如有疑问，请通过帮助与反馈联系运营组',
      action: '查看当前状态',
    };
  if (me.qualification === 'LEFT')
    return {
      title: '你已退出老乡社群',
      detail: '已有报名仍可在「我的报名」查看',
      action: '查看申请资料',
    };
  const state = me.applicationSummary?.status;
  return state === 'PENDING'
    ? { title: '申请已提交', detail: '社群运营组正在审核，请耐心等待', action: '查看申请进度' }
    : state === 'NEEDS_INFO'
      ? { title: '申请需补充资料', detail: '请查看审核意见并补充资料', action: '补充申请资料' }
      : state === 'REJECTED'
        ? { title: '申请未通过', detail: '请查看审核结果', action: '查看审核结果' }
        : { title: '加入老乡社群', detail: '联络老乡 · 报名活动', action: '申请加入' };
}
export function dateText(value: string | null | undefined) {
  if (!value) return '未设置';
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return '';
  const local = new Date(d.getTime() + 8 * 3600000);
  return `${local.getUTCFullYear()}.${String(local.getUTCMonth() + 1).padStart(2, '0')}.${String(local.getUTCDate()).padStart(2, '0')} ${String(local.getUTCHours()).padStart(2, '0')}:${String(local.getUTCMinutes()).padStart(2, '0')}`;
}
function activityListDate(value: string | null | undefined) {
  if (!value) return '时间待定';
  const date = new Date(new Date(value).getTime() + 8 * 3600000);
  if (!Number.isFinite(date.getTime())) return '';
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${String(date.getUTCMonth() + 1).padStart(2, '0')}.${String(date.getUTCDate()).padStart(2, '0')} ${weekdays[date.getUTCDay()]}`;
}
export function activityView(a: Activity) {
  return {
    ...a,
    date: dateText(a.startAt),
    listDate: activityListDate(a.startAt),
    summaryPreview: a.summary
      ? a.summary.length > 44
        ? `${a.summary.slice(0, 44)}…`
        : a.summary
      : '',
    statusText:
      a.lifecycle === 'ENDED'
        ? '已结束'
        : a.lifecycle === 'CANCELLED'
          ? '活动已取消'
          : a.lifecycle === 'ONGOING'
            ? '进行中'
            : a.signupWindow === 'NOT_OPEN'
              ? '报名未开始'
              : a.signupWindow === 'CLOSED'
                ? '报名已截止'
                : a.isFull
                  ? '名额已满'
                  : '报名中',
  };
}
export function go(page: string, id?: string) {
  wx.navigateTo({ url: `/pages/${page}/index${id ? '?id=' + encodeURIComponent(id) : ''}` });
}
export function confirm(title: string, content: string): Promise<boolean> {
  return new Promise((resolve) =>
    wx.showModal({
      title,
      content,
      confirmColor: '#68481D',
      success: (r) => resolve(r.confirm),
      fail: () => resolve(false),
    }),
  );
}
export function validProfile(p: {
  name: string;
  phone?: string;
  hometownCode: string;
  residenceCode: string;
  industryCode: string;
  introduction?: string;
}) {
  if (!p.name.trim() || p.name.trim().length > 40) throw new Error('请填写 1–40 字的姓名');
  if (p.phone !== undefined && !/^(\+86)?1[3-9][0-9]{9}$/.test(p.phone))
    throw new Error('请填写有效的大陆手机号码');
  if (!p.hometownCode || !p.residenceCode || !p.industryCode)
    throw new Error('请选择家乡、现居区域和行业');
  if ((p.introduction || '').length > 300) throw new Error('个人介绍不能超过 300 字');
}

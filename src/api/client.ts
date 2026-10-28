import { request, query } from './request';
import type {
  Schema,
  Me,
  Application,
  Activity,
  Registration,
  Recap,
  Announcement,
  Member,
  Option,
  Feedback,
  PageResult,
} from './types';
export const api = {
  homeSummary: () =>
    request<{
      me: Me;
      nextGathering: Schema['NextGatheringView'] | null;
      carousel: Schema['HomeCarouselPhoto'][];
    }>('/home/summary'),
  nextGathering: () => request<Schema['NextGatheringView'] | null>('/home/next-gathering'),
  homeCarousel: () => request<Schema['HomeCarouselPhoto'][]>('/home/carousel'),
  exitMembership: (version: number, key: string) =>
    request<Schema['MembershipExitResponse']['data']>('/me/membership-exit', {
      method: 'POST',
      data: { confirmed: true },
      version,
      key,
    }),
  closeAccount: (confirmationCode: string, key: string) =>
    request<Schema['AccountClosureResponse']['data']>('/me/closure', {
      method: 'POST',
      data: { confirmationCode, confirmed: true },
      key,
    }),
  me: () => request<Me>('/me'),
  application: () => request<Application | null>('/me/application'),
  submitApplication: (data: Schema['ApplicationInput'], key: string, version?: number) =>
    request('/me/application/submissions', { method: 'POST', data, key, version }),
  profile: (data: Schema['UpdateMyProfileInput'], version: number) =>
    request<Schema['PrivateProfile']>('/me/profile', { method: 'PUT', data, version }),
  profileChange: () => request<Schema['ProfileChange'] | null>('/me/profile-change'),
  directoryVisibility: (visible: boolean, version: number) =>
    request<Schema['PrivateProfile']>('/me/directory-visibility', {
      method: 'PUT',
      data: { directoryVisible: visible },
      version,
    }),
  regions: (parentCode?: string) =>
    request<Option[]>('/dictionaries/regions?' + query({ parentCode }), { auth: 'public' }),
  industries: () => request<Option[]>('/dictionaries/industries', { auth: 'public' }),
  members: (page = 1, q = '') =>
    request<PageResult<Member>>('/members?' + query({ page, query: q })),
  member: (id: string) => request<Member>('/members/' + encodeURIComponent(id)),
  activities: (page = 1, lifecycle = '') =>
    request<PageResult<Activity>>('/activities?' + query({ page, lifecycle }), {
      auth: 'optional',
    }),
  activity: (id: string) =>
    request<Activity>('/activities/' + encodeURIComponent(id), { auth: 'optional' }),
  recap: (id: string) =>
    request<Recap>(`/activities/${encodeURIComponent(id)}/recap`, { auth: 'optional' }),
  announcements: () => request<PageResult<Announcement>>('/announcements', { auth: 'optional' }),
  announcement: (id: string) =>
    request<Announcement>('/announcements/' + encodeURIComponent(id), { auth: 'optional' }),
  register: (id: string, data: Schema['ActivityRegistrationInput'], key: string) =>
    request<Registration>(`/activities/${encodeURIComponent(id)}/registrations`, {
      method: 'POST',
      data,
      key,
    }),
  registrations: (page = 1) =>
    request<PageResult<Registration>>('/me/registrations?' + query({ page })),
  registration: (id: string) =>
    request<Registration>('/me/registrations/' + encodeURIComponent(id)),
  cancel: (id: string, version: number, key: string) =>
    request<Registration>(`/me/registrations/${encodeURIComponent(id)}/cancel`, {
      method: 'POST',
      data: { confirmed: true },
      version,
      key,
    }),
  selfCheckin: (id: string, token: string) =>
    request<Schema['CheckinMutation']>(`/me/registrations/${encodeURIComponent(id)}/checkin`, {
      method: 'POST',
      data: { token },
    }),
  tickets: (data: Schema['MediaAccessTicketInput']) =>
    request<Schema['MediaAccessTicketResult']>('/media/access-tickets', { method: 'POST', data }),
  feedback: (data: Schema['FeedbackSubmitInput'], key: string) =>
    request<Schema['FeedbackCreated']>('/feedback', { method: 'POST', data, key }),
  feedbackList: (page = 1) => request<PageResult<Feedback>>('/me/feedback?' + query({ page })),
};

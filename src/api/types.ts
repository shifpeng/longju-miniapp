import type { components } from './schema';
export type Schema = components['schemas'];
export type Me = Schema['Me'];
export type Application = Schema['ApplicationView'];
export type ProfileInput = Schema['ProfileInput'];
export type Profile = Schema['PrivateProfile'];
export type Member = Schema['MemberView'];
export type Activity = Schema['ActivityView'];
export type Registration = Schema['RegistrationView'];
export type Recap = Schema['ActivityRecap'];
export type Announcement = Schema['AnnouncementView'];
export type Option = Schema['DictionaryOption'];
export type Feedback = Schema['FeedbackView'];
export interface PageResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

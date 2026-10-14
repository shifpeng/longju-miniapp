import { api } from '../api/client';
import { dateText } from './view';

export async function nextGathering() {
  const gathering = await api.nextGathering();
  return gathering ? { ...gathering, date: dateText(gathering.startAt) } : null;
}

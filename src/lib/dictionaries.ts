import { api } from '../api/client';
import type { Member, Option } from '../api/types';
const dictionaries = new Map<string, Promise<Option[]>>();
function cached(key: string, load: () => Promise<Option[]>) {
  let promise = dictionaries.get(key);
  if (!promise) {
    promise = load().catch((e) => {
      dictionaries.delete(key);
      throw e;
    });
    dictionaries.set(key, promise);
  }
  return promise;
}
export async function mapLimited<T, R>(items: T[], map: (item: T) => Promise<R>): Promise<R[]> {
  let next = 0;
  const results = new Array<R>(items.length);
  await Promise.all(
    Array.from({ length: Math.min(items.length, 4) }, async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await map(items[index]);
      }
    }),
  );
  return results;
}
export async function memberLabels<
  T extends Pick<Member, 'hometownCode' | 'residenceCode' | 'industryCode'>,
>(members: T[]) {
  const parents = [...new Set(members.map((m) => m.hometownCode.slice(0, 4) + '00'))];
  const [cities, residences, industries, counties] = await Promise.all([
    cached('cities', () => api.regions('620000')),
    cached('residences', () => api.regions('610100')),
    cached('industries', api.industries),
    mapLimited(parents, (code) => cached(code, () => api.regions(code))),
  ]);
  const labels = new Map(
    [...cities, ...residences, ...industries, ...counties.flat()].map((v) => [v.code, v.name]),
  );
  return members.map((m) => ({
    ...m,
    hometownLabel: labels.get(m.hometownCode) || '家乡信息待更新',
    residenceLabel: labels.get(m.residenceCode) || '现居信息待更新',
    industryLabel: labels.get(m.industryCode) || '行业信息待更新',
  }));
}

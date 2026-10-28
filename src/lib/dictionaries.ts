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
  const regionCodes = [...new Set(members.flatMap((m) => [m.hometownCode, m.residenceCode]))];
  const provinceCodes = [...new Set(regionCodes.map((code) => code.slice(0, 2) + '0000'))];
  const cityCodes = [
    ...new Set(
      regionCodes
        .filter((code) => code.length >= 6 && code !== code.slice(0, 2) + '0000')
        .map((code) => code.slice(0, 4) + '00'),
    ),
  ];
  const [provinces, cities, counties, industries] = await Promise.all([
    cached('provinces', () => api.regions()),
    mapLimited(provinceCodes, (code) => cached(code, () => api.regions(code))),
    mapLimited(cityCodes, (code) => cached(code, () => api.regions(code))),
    cached('industries', api.industries),
  ]);
  const labels = new Map(
    [...provinces, ...cities.flat(), ...counties.flat(), ...industries].map((v) => [
      v.code,
      v.name,
    ]),
  );
  const regionLabel = (code: string) => {
    const provinceCode = code.slice(0, 2) + '0000';
    const cityCode = code.slice(0, 4) + '00';
    const parts =
      code === provinceCode
        ? [labels.get(code)]
        : code === cityCode
          ? [labels.get(provinceCode), labels.get(code)]
          : [labels.get(provinceCode), labels.get(cityCode), labels.get(code)];
    return parts.filter((part): part is string => Boolean(part)).join('·');
  };
  return members.map((m) => ({
    ...m,
    hometownLabel: regionLabel(m.hometownCode) || '家乡信息待更新',
    residenceLabel: regionLabel(m.residenceCode) || '现居信息待更新',
    industryLabel: labels.get(m.industryCode) || '行业信息待更新',
  }));
}

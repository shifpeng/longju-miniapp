import { test } from 'node:test';
import assert from 'node:assert/strict';
import { memberLabels } from '../src/lib/dictionaries';

(globalThis as any).wx = {
  getStorageSync: () => undefined,
  getAccountInfoSync: () => ({ miniProgram: { envVersion: 'develop' } }),
  request: (options: any) => {
    const url = new URL(options.url);
    const parentCode = url.searchParams.get('parentCode');
    const data = url.pathname.endsWith('/industries')
      ? [{ code: 'I', name: '信息传输、软件和信息技术服务业', level: null }]
      : parentCode === null
        ? [
            { code: '620000', name: '甘肃省', level: 1 },
            { code: '610000', name: '陕西省', level: 1 },
          ]
        : parentCode === '620000'
          ? [{ code: '620100', name: '兰州市', level: 2 }]
          : parentCode === '610000'
            ? [{ code: '610100', name: '西安市', level: 2 }]
            : parentCode === '620100'
              ? [{ code: '620102', name: '城关区', level: 3 }]
              : parentCode === '610100'
                ? [{ code: '610113', name: '雁塔区', level: 3 }]
                : [];
    queueMicrotask(() =>
      options.success({
        statusCode: 200,
        header: {},
        data: { data, requestId: 'region-test', serverTime: new Date().toISOString() },
      }),
    );
  },
};

test('member cards qualify hometown and current residence with their own province and city', async () => {
  const [member] = await memberLabels([
    { hometownCode: '620100', residenceCode: '610113', industryCode: 'I' },
    { hometownCode: '620102', residenceCode: '610113', industryCode: 'I' },
  ]);
  assert.equal(member.hometownLabel, '甘肃省·兰州市');
  assert.equal(member.residenceLabel, '陕西省·西安市·雁塔区');
  const [countyMember] = await memberLabels([
    { hometownCode: '620102', residenceCode: '610113', industryCode: 'I' },
  ]);
  assert.equal(countyMember.hometownLabel, '甘肃省·兰州市·城关区');
});

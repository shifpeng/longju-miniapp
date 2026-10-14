import { test } from 'node:test';
import assert from 'node:assert/strict';
import { membership, validProfile, activityView, dateText } from '../src/lib/view';
import type { Me, Activity } from '../src/api/types';
test('historical approval never overrides a lost membership', () => {
  for (const q of ['DISABLED', 'LEFT'] as const) {
    const me = { qualification: q, applicationSummary: { status: 'APPROVED' } } as Me;
    assert.notEqual(membership(me).detail, '已加入老乡社群');
  }
});
test('pending and returned applications have distinct recovery actions', () => {
  assert.equal(
    membership({ qualification: 'NONE', applicationSummary: { status: 'NEEDS_INFO' } } as Me)
      .action,
    '补充申请资料',
  );
  assert.equal(
    membership({ qualification: 'NONE', applicationSummary: { status: 'PENDING' } } as Me).action,
    '查看申请进度',
  );
});
test('profile validation rejects missing dictionaries and malformed phones', () => {
  const p = {
    name: '张三',
    phone: '13800138000',
    hometownCode: '620102',
    residenceCode: '610113',
    industryCode: 'I',
  };
  assert.doesNotThrow(() => validProfile(p));
  assert.throws(() => validProfile({ ...p, phone: '123' }), /手机/);
  assert.throws(() => validProfile({ ...p, hometownCode: '' }), /家乡/);
  assert.throws(() => validProfile({ ...p, name: ' '.repeat(3) }), /姓名/);
});
test('ended/cancelled events do not display signup even if window says OPEN', () => {
  assert.equal(
    activityView({ lifecycle: 'ENDED', signupWindow: 'OPEN' } as Activity).statusText,
    '已结束',
  );
  assert.equal(
    activityView({ lifecycle: 'CANCELLED', signupWindow: 'OPEN' } as Activity).statusText,
    '活动已取消',
  );
});
test('dates show Beijing time independently of host timezone', () =>
  assert.equal(dateText('2026-10-06T01:30:00Z'), '2026.10.06 09:30'));

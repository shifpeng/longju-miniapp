import { test } from 'node:test';
import assert from 'node:assert/strict';
import { api } from '../src/api/client';
import { nextGathering } from '../src/lib/next-gathering';

test('next gathering uses one summary request and never enumerates historical registrations', async () => {
  let calls = 0;
  api.registrations = api.activity = async () => {
    throw new Error('unexpected historical query');
  };
  api.nextGathering = async () => {
    calls++;
    return { id: '4', title: '相聚', place: '西安', startAt: '2026-10-15T02:00:00Z' };
  };
  const result = await nextGathering();
  assert.equal(result?.id, '4');
  assert.ok(result?.date);
  assert.equal(calls, 1);
});
test('empty summary returns null while failed reads remain errors', async () => {
  api.nextGathering = async () => null;
  assert.equal(await nextGathering(), null);
  api.nextGathering = async () => {
    throw new Error('读取失败');
  };
  await assert.rejects(nextGathering(), /读取失败/);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { api } from '../src/api/client';
import { homeCarousel } from '../src/lib/home-carousel';

test('carousel tickets are grouped by activity and version and preserve server photo order', async () => {
  const photos = [
    { activityId: '2', recapVersion: 4, assetId: '21', activityTitle: '合影', caption: null },
    { activityId: '2', recapVersion: 4, assetId: '22', activityTitle: '合影', caption: null },
    { activityId: '1', recapVersion: 9, assetId: '11', activityTitle: '出游', caption: null },
  ];
  api.homeCarousel = async () => photos;
  const contexts: string[] = [];
  api.tickets = async (input) => {
    contexts.push(`${input.contextId}:${input.version}`);
    return {
      expiresAt: '2026-10-09T10:00:00Z',
      items: [...input.items].reverse().map((item) => ({
        ...item,
        url: `https://example.test/${item.assetId}`,
      })),
    };
  };
  const result = await homeCarousel();
  assert.deepEqual(contexts, ['2:4', '1:9']);
  assert.deepEqual(
    result.map((photo) => photo.url),
    ['https://example.test/21', 'https://example.test/22', 'https://example.test/11'],
  );
  api.tickets = async () => ({ expiresAt: '', items: [] });
  await assert.rejects(homeCarousel(), /照片暂时无法查看/);
});

test('carousel reuses valid URLs but reauthorizes expired tickets and changed recap versions', async () => {
  let version = 1;
  let reads = 0;
  api.homeCarousel = async () => [
    { activityId: '1', recapVersion: version, assetId: '2', activityTitle: '相聚', caption: null },
  ];
  api.tickets = async (input) => {
    reads++;
    return {
      expiresAt: new Date(Date.now() + 300_000).toISOString(),
      items: input.items.map((item) => ({ ...item, url: `https://example.test/${reads}` })),
    };
  };
  const first = await homeCarousel();
  const second = await homeCarousel(first);
  assert.equal(reads, 1);
  assert.equal(second[0].url, first[0].url);
  await homeCarousel(second.map((photo) => ({ ...photo, renewAt: 0 })));
  assert.equal(reads, 2);
  version++;
  await homeCarousel(second);
  assert.equal(reads, 3);
  api.homeCarousel = async () => [];
  assert.deepEqual(await homeCarousel(second), []);
});

test('account change after first ticket prevents later batches from requesting another session', async () => {
  let current = true;
  let tickets = 0;
  const photos = [1, 2].map((id) => ({
    activityId: '1',
    recapVersion: 1,
    assetId: String(id),
    activityTitle: '相聚',
    caption: null,
  }));
  api.tickets = async (input) => {
    tickets++;
    return {
      expiresAt: new Date(Date.now() + 300_000).toISOString(),
      items: input.items.map((item) => ({ ...item, url: `https://example.test/${item.assetId}` })),
    };
  };
  await assert.rejects(
    homeCarousel(
      [],
      photos,
      () => {
        current = false;
      },
      () => current,
    ),
    /图片加载已取消/,
  );
  assert.equal(tickets, 1);
});

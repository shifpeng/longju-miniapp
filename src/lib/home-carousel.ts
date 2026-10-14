import { api } from '../api/client';
import { mediaLinks } from './media';
import { serverNow } from '../api/request';
import type { Schema } from '../api/types';

type CarouselPhoto = Schema['HomeCarouselPhoto'] & { key: string; url: string; renewAt: number };

export async function homeCarousel(
  previous: CarouselPhoto[] = [],
  photos: Schema['HomeCarouselPhoto'][] | undefined = undefined,
  onFirst?: (photo: CarouselPhoto) => void,
  isCurrent: () => boolean = () => true,
): Promise<CarouselPhoto[]> {
  photos ??= await api.homeCarousel();
  const groups = new Map<string, Schema['HomeCarouselPhoto'][]>();
  for (const photo of photos) {
    const key = `${photo.activityId}:${photo.recapVersion}`;
    groups.set(key, [...(groups.get(key) || []), photo]);
  }
  const urls = new Map<string, { url: string; renewAt: number }>();
  const authorize = async (group: Schema['HomeCarouselPhoto'][]) => {
    if (!isCurrent()) throw new Error('图片加载已取消');
    const reusable = group.map((photo) =>
      previous.find(
        (old) =>
          old.activityId === photo.activityId &&
          old.assetId === photo.assetId &&
          old.recapVersion === photo.recapVersion &&
          old.renewAt > serverNow(),
      ),
    );
    if (reusable.every((photo) => !!photo)) {
      reusable.forEach((photo) => urls.set(photo!.key, photo!));
      return;
    }
    const links = await mediaLinks(
      'ACTIVITY_RECAP',
      group[0].activityId,
      group[0].recapVersion,
      group.map((photo) => photo.assetId),
      'THUMBNAIL',
    );
    const expiry = Date.parse(links.expiresAt);
    const renewAt = Number.isFinite(expiry) ? expiry - 60_000 : serverNow() + 240_000;
    group.forEach((photo, index) =>
      urls.set(`${photo.activityId}:${photo.assetId}`, { url: links.urls[index], renewAt }),
    );
  };
  if (onFirst && photos.length) {
    const first = photos[0];
    await authorize([first]);
    if (!isCurrent()) return [];
    const key = `${first.activityId}:${first.assetId}`;
    onFirst({ ...first, key, ...urls.get(key)! });
  }
  await Promise.all(
    [...groups.values()].map((group) => {
      const remaining = group.filter((photo) => !urls.has(`${photo.activityId}:${photo.assetId}`));
      return remaining.length ? authorize(remaining) : Promise.resolve();
    }),
  );
  return photos.map((photo) => ({
    ...photo,
    key: `${photo.activityId}:${photo.assetId}`,
    ...urls.get(`${photo.activityId}:${photo.assetId}`)!,
  }));
}

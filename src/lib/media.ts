import { api } from '../api/client';
import { runtime } from '../config/runtime';
import type { Schema } from '../api/types';
export async function mediaUrls(
  contextType: Schema['MediaAccessTicketInput']['contextType'],
  contextId: string,
  version: number,
  ids: string[],
  variant: 'DISPLAY' | 'THUMBNAIL' = 'DISPLAY',
) {
  return (await mediaLinks(contextType, contextId, version, ids, variant)).urls;
}
export async function mediaLinks(
  contextType: Schema['MediaAccessTicketInput']['contextType'],
  contextId: string,
  version: number,
  ids: string[],
  variant: 'DISPLAY' | 'THUMBNAIL' = 'DISPLAY',
) {
  if (!ids.length) return { urls: [], expiresAt: '' };
  // Some existing API rows serialize BIGINT asset IDs as numbers, while ticket
  // results follow the contract and return IDs as strings.
  const normalizedIds = ids.map(String);
  const result = await api.tickets({
    contextType,
    contextId,
    version,
    items: normalizedIds.map((assetId) => ({ assetId, variant })),
  });
  const urls = normalizedIds.map((id) => {
    const item = result.items.find((i) => String(i.assetId) === id);
    if (!item) throw new Error('照片暂时无法查看，请重试');
    return /^https?:\/\//.test(item.url) ? item.url : runtime.apiOrigin + item.url;
  });
  return { urls, expiresAt: result.expiresAt };
}

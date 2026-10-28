// Refresh every visible page together so returning from a detail keeps the list and scroll stable.
export async function refreshPages<T>(
  fetchPage: (page: number) => Promise<{ items: T[]; page: number; total: number }>,
  visiblePages: number,
) {
  const first = await fetchPage(1);
  const items = [...first.items];
  let page = first.page;
  while (page < visiblePages && items.length < first.total) {
    const next = await fetchPage(page + 1);
    items.push(...next.items);
    page = next.page;
  }
  return { items, page, total: first.total };
}

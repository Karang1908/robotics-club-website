import { site } from '../content/site';

export { site };

export const PAGE_SIZE = { news: 3, facilities: 4, members: 6 };

export const publishedNews = site.news
  .filter((item) => item.published)
  .sort((a, b) => b.date.localeCompare(a.date));

export const membersOf = (group) => site.members
  .filter((member) => member.group === group)
  .sort((a, b) => (a.order ?? 101) - (b.order ?? 101));

export const pageCount = (total, size) => Math.max(1, Math.ceil(total / size));

// Pages are prerendered at /news, /news/page/2, /news/page/3 ... so the whole site stays static.
export function pageParams(total, size) {
  return Array.from({ length: pageCount(total, size) }, (_, index) => ({ page: index === 0 ? [] : ['page', String(index + 1)] }));
}

// Reads the page number from the URL segments. Returns null for anything that is not a real page.
export function paginate(items, segments = [], size) {
  const totalPages = pageCount(items.length, size);
  let page = 1;
  if (segments.length) {
    const [word, number, ...rest] = segments;
    page = Number(number);
    if (word !== 'page' || rest.length || !Number.isInteger(page) || page < 2 || page > totalPages) return null;
  }
  return { page, totalPages, visible: items.slice((page - 1) * size, page * size) };
}

import Link from 'next/link';

export function paginate(items, requestedPage, pageSize) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const requested = Number(requestedPage);
  const page = Number.isInteger(requested) && requested > 0 ? Math.min(requested, totalPages) : 1;
  return { page, totalPages, visible: items.slice((page - 1) * pageSize, page * pageSize) };
}

export function Pagination({ page, totalPages, path }) {
  if (totalPages < 2) return null;
  return <nav className="page-pagination" aria-label="Page navigation">
    {page > 1 ? <Link href={`${path}?page=${page - 1}`}>Previous</Link> : <span className="page-control-disabled">Previous</span>}
    <span>Page {page} of {totalPages}</span>
    {page < totalPages ? <Link href={`${path}?page=${page + 1}`}>Next</Link> : <span className="page-control-disabled">Next</span>}
  </nav>;
}

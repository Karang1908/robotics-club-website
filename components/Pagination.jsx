import Link from 'next/link';

const hrefFor = (path, page) => (page === 1 ? path : `${path}/page/${page}`);

export function Pagination({ page, totalPages, path }) {
  if (totalPages < 2) return null;
  return <nav className="page-pagination" aria-label="Pages">
    {page > 1 ? <Link href={hrefFor(path, page - 1)} rel="prev">Previous</Link> : <span className="page-control-disabled" aria-disabled="true">Previous</span>}
    <span aria-current="page">Page {page} of {totalPages}</span>
    {page < totalPages ? <Link href={hrefFor(path, page + 1)} rel="next">Next</Link> : <span className="page-control-disabled" aria-disabled="true">Next</span>}
  </nav>;
}

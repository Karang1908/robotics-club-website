import { getSite } from '../../lib/store';
import { InnerPage } from '../../components/InnerPage';
import { paginate, Pagination } from '../../components/Pagination';

export const dynamic = 'force-dynamic';

export default async function LabPage({ searchParams }) {
  const site = await getSite();
  const { page, totalPages, visible } = paginate(site.facilities, (await searchParams)?.page, 4);
  return <InnerPage site={site} active="/lab-facilities" title={site.pages.lab.heading} description={site.pages.lab.description} className="lab-page">
    {site.facilities.length ? <><div className="facility-grid">{visible.map((facility) => <article className="facility" key={facility.id}><div className={`facility-image${facility.image ? '' : ' facility-image-empty'}`}>{facility.image ? <><img src={facility.image} alt="" />{facility.imageNote && <small className="facility-image-note">{facility.imageNote}</small>}</> : <span>Lab image coming soon</span>}</div><div className="facility-copy"><span>{facility.category}</span><h2>{facility.name}</h2><p>{facility.description}</p></div></article>)}</div><Pagination page={page} totalPages={totalPages} path="/lab-facilities" /></> : <div className="empty-page"><h2>{site.ui.labEmptyText}</h2></div>}
  </InnerPage>;
}

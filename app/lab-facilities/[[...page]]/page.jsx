import { notFound } from 'next/navigation';
import { site, paginate, pageParams, PAGE_SIZE } from '../../../lib/content';
import { InnerPage } from '../../../components/InnerPage';
import { Pagination } from '../../../components/Pagination';

export const dynamicParams = false;
export const generateStaticParams = () => pageParams(site.facilities.length, PAGE_SIZE.facilities);
export const metadata = { title: site.pages.lab.heading, description: site.pages.lab.description };

export default async function LabPage({ params }) {
  const current = paginate(site.facilities, (await params).page, PAGE_SIZE.facilities);
  if (!current) notFound();
  const { page, totalPages, visible } = current;
  return <InnerPage title={site.pages.lab.heading} description={site.pages.lab.description} className="lab-page">
    {site.facilities.length
      ? <>
          <div className="facility-grid">{visible.map((facility) => <article className="facility" key={facility.id}>
            <div className={`facility-image${facility.image ? '' : ' facility-image-empty'}`}>
              {facility.image
                ? <><img src={facility.image} alt={facility.name} loading="lazy" decoding="async" />{facility.imageNote && <small className="image-note">{facility.imageNote}</small>}</>
                : <span>Lab image coming soon</span>}
            </div>
            <div className="facility-copy"><span className="eyebrow">{facility.category}</span><h2>{facility.name}</h2><p>{facility.description}</p></div>
          </article>)}</div>
          <Pagination page={page} totalPages={totalPages} path="/lab-facilities" />
        </>
      : <div className="empty-page"><h2>{site.ui.labEmptyText}</h2></div>}
  </InnerPage>;
}

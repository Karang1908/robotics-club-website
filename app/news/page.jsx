import { getSite } from '../../lib/store';
import { InnerPage } from '../../components/InnerPage';
import { ArrowIcon } from '../../components/Icons';
import { paginate, Pagination } from '../../components/Pagination';

export const dynamic = 'force-dynamic';

export default async function NewsPage({ searchParams }) {
  const site = await getSite();
  const news = site.news.filter((item) => item.published).sort((a, b) => b.date.localeCompare(a.date));
  const { page, totalPages, visible } = paginate(news, (await searchParams)?.page, 3);
  return <InnerPage site={site} active="/news" title={site.pages.news.heading} description={site.pages.news.description} className="news-page">
    {news.length ? <><div className="news-list">{visible.map((item) => <article className="news-row" key={item.id} id={item.id}><div className="news-row-meta"><span>{item.date}</span><span>{item.category}</span></div><div><h2>{item.title}</h2><p>{item.summary}</p>{item.body && <details><summary>{site.ui.newsReadMore} <ArrowIcon diagonal size={15}/></summary><p className="news-full">{item.body}</p></details>}</div>{item.image && <img src={item.image} alt="" />}</article>)}</div><Pagination page={page} totalPages={totalPages} path="/news" /></> : <div className="empty-page"><span className="empty-orbit" aria-hidden="true"/><h2>{site.ui.newsPageEmptyTitle}</h2><p>{site.home.newsEmptyText}</p></div>}
  </InnerPage>;
}

import { notFound } from 'next/navigation';
import { site, publishedNews, paginate, pageParams, PAGE_SIZE } from '../../../lib/content';
import { formatDate } from '../../../lib/format';
import { InnerPage } from '../../../components/InnerPage';
import { Pagination } from '../../../components/Pagination';

export const dynamicParams = false;
export const generateStaticParams = () => pageParams(publishedNews.length, PAGE_SIZE.news);
export const metadata = { title: site.pages.news.heading, description: site.pages.news.description };

export default async function NewsPage({ params }) {
  const current = paginate(publishedNews, (await params).page, PAGE_SIZE.news);
  if (!current) notFound();
  const { page, totalPages, visible } = current;
  return <InnerPage title={site.pages.news.heading} description={site.pages.news.description} className="news-page">
    {publishedNews.length
      ? <>
          <div className="news-list">{visible.map((item) => <article className="news-row" key={item.id} id={item.id}>
            <div className="news-row-meta"><time dateTime={item.date}>{formatDate(item.date)}</time><span>{item.category}</span></div>
            <div className="news-row-body">
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              {item.body && <details><summary>{site.ui.newsReadMore}</summary><p className="news-full">{item.body}</p></details>}
            </div>
            {item.image && <img src={item.image} alt="" loading="lazy" decoding="async" />}
          </article>)}</div>
          <Pagination page={page} totalPages={totalPages} path="/news" />
        </>
      : <div className="empty-page"><h2>{site.ui.newsPageEmptyTitle}</h2><p>{site.home.newsEmptyText}</p></div>}
  </InnerPage>;
}

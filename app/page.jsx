import Link from 'next/link';
import { site, publishedNews } from '../lib/content';
import { formatDate } from '../lib/format';
import { PublicShell } from '../components/PublicShell';
import Showcase from '../components/Showcase';
import { ArrowIcon } from '../components/Icons';

export default function Home() {
  const news = publishedNews.slice(0, 3);
  return <PublicShell home>
    <main id="main" className="home-main container">
      <section className="home-intro">
        <p className="eyebrow">{site.ui.homeKicker}</p>
        <div className="intro-body">
          <h1>{site.home.heading}</h1>
          <div className="intro-side">
            <p>{site.home.description}</p>
            <div className="intro-actions">
              <Link className="button-primary" href={site.home.primaryHref}>{site.home.primaryLabel}<ArrowIcon /></Link>
              <Link className="button-text" href={site.home.secondaryHref}>{site.home.secondaryLabel}<ArrowIcon size={16} /></Link>
            </div>
          </div>
        </div>
      </section>
      <Showcase robots={site.robots} label={site.home.showcaseLabel} emptyText={site.ui.showcaseEmptyText} />
      <aside className="news-rail" aria-labelledby="news-rail-title">
        <div className="news-rail-head">
          <p className="eyebrow">{site.ui.newsKicker}</p>
          <h2 id="news-rail-title">{site.home.newsHeading}</h2>
        </div>
        <div className="news-rail-body">
          {news.length
            ? <ul className="news-rail-list">{news.map((item) => <li key={item.id}>
                <Link className="news-rail-item" href={`/news#${item.id}`}>
                  <time dateTime={item.date}>{item.date ? formatDate(item.date) : item.category}</time>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </Link>
              </li>)}</ul>
            : <div className="news-empty"><h3>{site.home.newsEmptyTitle}</h3><p>{site.home.newsEmptyText}</p></div>}
        </div>
        <Link className="news-all" href="/news">{site.ui.newsAllLabel}<ArrowIcon size={16} /></Link>
      </aside>
    </main>
  </PublicShell>;
}

import Link from 'next/link';
import { getSite } from '../lib/store';
import { PublicShell } from '../components/PublicShell';
import Showcase from '../components/Showcase';
import { ArrowIcon } from '../components/Icons';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const site = await getSite();
  const news = site.news.filter((item) => item.published).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  return <PublicShell site={site} active="/" home>
    <main className="home-main">
      <section className="home-intro">
        <div className="intro-top"><span className="intro-rule" /><span>{site.ui.homeKicker}</span></div>
        <div className="intro-body"><h1>{site.home.heading}</h1><p>{site.home.description}</p><div className="intro-actions"><Link className="button-primary" href={site.home.primaryHref}>{site.home.primaryLabel}<ArrowIcon /></Link><Link className="button-text" href={site.home.secondaryHref}>{site.home.secondaryLabel}<ArrowIcon diagonal size={16} /></Link></div></div>
      </section>
      <Showcase robots={site.robots} label={site.home.showcaseLabel} emptyText={site.ui.showcaseEmptyText} />
      <aside className="news-rail"><div className="news-rail-head"><div><span className="rail-indicator" /> <span>{site.ui.newsKicker}</span></div><h2>{site.home.newsHeading}</h2></div>
        <div className="news-rail-body">{news.length ? news.map((item) => <Link key={item.id} className="news-rail-item" href={`/news#${item.id}`}><span>{item.date ? new Date(`${item.date}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : item.category}</span><h3>{item.title}</h3><p>{item.summary}</p><ArrowIcon diagonal size={16} /></Link>) : <div className="news-empty"><h3>{site.home.newsEmptyTitle}</h3><p>{site.home.newsEmptyText}</p></div>}</div>
        <Link className="news-all" href="/news">{site.ui.newsAllLabel} <ArrowIcon diagonal size={17} /></Link>
      </aside>
    </main>
  </PublicShell>;
}

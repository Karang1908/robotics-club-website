import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSite } from '../../../lib/store';
import { InnerPage } from '../../../components/InnerPage';
import { paginate, Pagination } from '../../../components/Pagination';

export const dynamic = 'force-dynamic';

export default async function MembersPage({ params, searchParams }) {
  const { group } = await params;
  if (!['faculty', 'council'].includes(group)) notFound();
  const site = await getSite();
  const members = site.members.filter((member) => member.group === group).sort((a, b) => (a.order ?? 101) - (b.order ?? 101));
  const { page, totalPages, visible } = paginate(members, (await searchParams)?.page, 6);
  return <InnerPage site={site} active={`/members/${group}`} title={site.pages[group].heading} description={site.pages[group].description} className="members-page">
    <nav className="member-tabs" aria-label="Member groups"><Link className={group === 'council' ? 'selected' : ''} href="/members/council">{site.ui.councilTab}</Link><Link className={group === 'faculty' ? 'selected' : ''} href="/members/faculty">{site.ui.facultyTab}</Link></nav>
    {members.length ? <><div className="member-grid">{visible.map((member, index) => <article className={`member member-${member.layout || 'side'}${member.showNumber ? ' is-numbered' : ''}`} key={member.id}>{member.showNumber && <span className="member-number">{String((page - 1) * 6 + index + 1).padStart(2, '0')}</span>}<div className="member-photo">{member.image ? <img src={member.image} alt={member.name} /> : <span>{member.name.charAt(0)}</span>}</div><div><span>{member.role}</span><h2>{member.name}</h2><p>{member.bio}</p></div></article>)}</div><Pagination page={page} totalPages={totalPages} path={`/members/${group}`} /></> : <div className="empty-page"><h2>{site.ui.membersEmptyTitle}</h2><p>{site.ui.membersEmptyText}</p></div>}
  </InnerPage>;
}

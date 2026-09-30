import Link from 'next/link';
import { notFound } from 'next/navigation';
import { site, membersOf, paginate, pageParams, PAGE_SIZE } from '../../../../lib/content';
import { InnerPage } from '../../../../components/InnerPage';
import { Pagination } from '../../../../components/Pagination';

const groups = ['council', 'faculty'];

export const dynamicParams = false;
export const generateStaticParams = () => groups.flatMap((group) => pageParams(membersOf(group).length, PAGE_SIZE.members).map((params) => ({ group, ...params })));

export async function generateMetadata({ params }) {
  const { group } = await params;
  return { title: site.pages[group].heading, description: site.pages[group].description };
}

export default async function MembersPage({ params }) {
  const { group, page: segments } = await params;
  const members = membersOf(group);
  const current = paginate(members, segments, PAGE_SIZE.members);
  if (!groups.includes(group) || !current) notFound();
  const { page, totalPages, visible } = current;
  return <InnerPage title={site.pages[group].heading} description={site.pages[group].description} className="members-page">
    <nav className="member-tabs" aria-label="Member groups">
      <Link className={group === 'council' ? 'selected' : ''} href="/members/council" aria-current={group === 'council' ? 'page' : undefined}>{site.ui.councilTab}</Link>
      <Link className={group === 'faculty' ? 'selected' : ''} href="/members/faculty" aria-current={group === 'faculty' ? 'page' : undefined}>{site.ui.facultyTab}</Link>
    </nav>
    {members.length
      ? <>
          <div className="member-grid">{visible.map((member, index) => <article className={`member member-${member.layout || 'side'}`} key={member.id}>
            {member.showNumber && <span className="member-number" aria-hidden="true">{String((page - 1) * PAGE_SIZE.members + index + 1).padStart(2, '0')}</span>}
            <div className="member-photo">{member.image ? <img src={member.image} alt={member.name} loading="lazy" decoding="async" /> : <span aria-hidden="true">{member.name.charAt(0)}</span>}</div>
            <div className="member-copy"><span className="eyebrow">{member.role}</span><h2>{member.name}</h2><p>{member.bio}</p></div>
          </article>)}</div>
          <Pagination page={page} totalPages={totalPages} path={`/members/${group}`} />
        </>
      : <div className="empty-page"><h2>{site.ui.membersEmptyTitle}</h2><p>{site.ui.membersEmptyText}</p></div>}
  </InnerPage>;
}

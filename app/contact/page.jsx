import { getSite } from '../../lib/store';
import { InnerPage } from '../../components/InnerPage';
import ContactForm from '../../components/ContactForm';
import { ArrowIcon } from '../../components/Icons';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const site = await getSite();
  return <InnerPage site={site} active="/contact" title={site.pages.contact.heading} description={site.pages.contact.description} className="contact-page">
    <div className="contact-grid"><div className="contact-details"><h2>{site.ui.contactDetailsHeading}</h2><div><span>{site.ui.contactLocationLabel}</span><p>{site.contact.location}</p></div><div><span>{site.ui.contactEmailLabel}</span><p>{site.contact.email ? <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> : site.ui.contactNoEmail}</p></div>{site.contact.social.length > 0 && <div><span>{site.ui.contactSocialLabel}</span><div className="social-links">{site.contact.social.map((social, i) => <a key={i} href={social.url} target="_blank" rel="noopener noreferrer">{social.label}<ArrowIcon diagonal size={15}/></a>)}</div></div>}</div><ContactForm contact={site.contact} ui={site.ui} /></div>
  </InnerPage>;
}

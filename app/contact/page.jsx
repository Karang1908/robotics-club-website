import { site } from '../../lib/content';
import { InnerPage } from '../../components/InnerPage';
import ContactForm from '../../components/ContactForm';
import { ArrowIcon } from '../../components/Icons';

export const metadata = { title: site.pages.contact.heading, description: site.pages.contact.description };

export default function ContactPage() {
  const { contact, ui } = site;
  return <InnerPage title={site.pages.contact.heading} description={site.pages.contact.description} className="contact-page">
    <div className="contact-grid">
      <div className="contact-details">
        <h2>{ui.contactDetailsHeading}</h2>
        <div><span className="eyebrow">{ui.contactLocationLabel}</span><p>{contact.location}</p></div>
        <div><span className="eyebrow">{ui.contactEmailLabel}</span><p>{contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : ui.contactNoEmail}</p></div>
        {contact.social.length > 0 && <div>
          <span className="eyebrow">{ui.contactSocialLabel}</span>
          <div className="social-links">{contact.social.map((social) => <a key={social.url} href={social.url} target="_blank" rel="noopener noreferrer">{social.label}<ArrowIcon size={15} /></a>)}</div>
        </div>}
      </div>
      {contact.email
        ? <ContactForm contact={contact} ui={ui} />
        : <div className="contact-form"><h2>{contact.formHeading}</h2><p>{ui.contactNoEmail}</p></div>}
    </div>
  </InnerPage>;
}

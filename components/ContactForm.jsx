'use client';

import { useState } from 'react';
import { ArrowIcon } from './Icons';
import { mailtoLink } from '../lib/format';

// There is no server behind this site, so the form prepares an email in the visitor's own mail
// app, addressed to the club. Nothing is stored or sent by the website itself.
export default function ContactForm({ contact, ui }) {
  const [opened, setOpened] = useState(false);

  function submit(event) {
    event.preventDefault();
    window.location.href = mailtoLink(contact.email, Object.fromEntries(new FormData(event.currentTarget)));
    setOpened(true);
  }

  return <form className="contact-form" onSubmit={submit}>
    <h2>{contact.formHeading}</h2>
    <div className="form-row">
      <label>{ui.contactNameLabel}<input required name="name" autoComplete="name" maxLength={120} /></label>
      <label>{ui.contactFormEmailLabel}<input required name="email" type="email" autoComplete="email" maxLength={200} /></label>
    </div>
    <label>{ui.contactMessageLabel}<textarea required name="message" minLength={5} maxLength={5000} rows={5} /></label>
    <div className="form-bottom">
      <button className="button-primary" type="submit">{contact.formButton}<ArrowIcon /></button>
      <p className={`form-status${opened ? ' is-success' : ''}`} role="status">
        {opened && <>{contact.successText} If nothing opens, write to <a href={`mailto:${contact.email}`}>{contact.email}</a>.</>}
      </p>
    </div>
  </form>;
}

'use client';

import { useState } from 'react';
import { ArrowIcon } from './Icons';

export default function ContactForm({ contact, ui }) {
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true); setStatus('');
    const values = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to send your message.');
      setStatus(contact.successText); form.reset();
    } catch (error) { setStatus(error.message); }
    finally { setSending(false); }
  }
  return <form className="contact-form" onSubmit={submit}><h2>{contact.formHeading}</h2><div className="form-row"><label>{ui.contactNameLabel}<input required name="name" autoComplete="name" maxLength="120" /></label><label>{ui.contactFormEmailLabel}<input required name="email" type="email" autoComplete="email" maxLength="200" /></label></div><label>{ui.contactMessageLabel}<textarea required name="message" minLength="5" maxLength="5000" rows="5" /></label><label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off" /></label><div className="form-bottom"><button className="button-primary" type="submit" disabled={sending}>{sending ? 'Sending...' : contact.formButton}<ArrowIcon /></button><p role="status">{status}</p></div></form>;
}

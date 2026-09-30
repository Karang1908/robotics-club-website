// Formats a YYYY-MM-DD date for display (e.g. "5 Mar 2026"). Uses UTC so the day never shifts
// with the server's time zone. Anything that is not a date is returned as it was typed.
export function formatDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || '');
  if (!match) return value || '';
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return value;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

// Picks white or near-black text, whichever is easier to read on the given #rrggbb colour.
export function readableOn(hex) {
  const channel = (start) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  const luminance = 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
  return (1.05 / (luminance + 0.05)) >= ((luminance + 0.05) / 0.05) ? '#ffffff' : '#14201a';
}

// Builds the mailto: link the contact form opens, with the visitor's message pre-filled.
export function mailtoLink(to, { name, email, message }) {
  const subject = `Message from ${name}`;
  const body = `${message}\n\n${name}\n${email}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

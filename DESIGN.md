# Design system

A simple, light interface for a college site: white and soft grey-green surfaces, dark green-black text, and one accent colour. The layout is unchanged from the original concept. On desktop the homepage is one screen: the club introduction sits over the robot showcase, with a slim news column beside both. Inner pages reuse the same header, footer, type scale and accent.

## Tokens

- Page `#f8f9f6`, cards `#ffffff`, footer `#f0f3ee`, text `#1c2a22`, muted text `#56665c`, lines `#dce3da`.
- The accent defaults to `#426c50` and is set in `content/site.js`. The page shell sets `--accent` and `--on-accent` (white or near-black, chosen for readability); hover, soft and tint colours are derived from it with `color-mix`.
- Radii: 6px controls, 10-12px cards. No shadows except the open Members menu.
- One typeface: DM Sans, self-hosted as a 44 KB Latin woff2 through `next/font`. System fonts cover anything else.
- Body 16px; small text never drops below 12px. Headings use modest negative tracking.

## Layout

- Header, page content and footer share one container (max 1320px) so their left edges line up.
- Desktop (1101px and up): homepage fills one viewport. Intro heading left, short description and buttons right; showcase below with the image left and details right; news column on the right.
- Tablet (up to 1100px): the showcase card stacks image over details and the page scrolls.
- Phones (up to 900px): one column, with a Menu button instead of the header links.
- Facilities, members and news use page controls so the default view stays compact as content grows (4, 6 and 3 items per page).

## Behaviour and accessibility

- The showcase advances every 6.5 seconds, pauses on hover or focus, has a Pause/Play button, and does not autoplay for visitors who prefer reduced motion.
- The Members menu opens on hover, click, or the Down Arrow key; Escape closes it and returns focus.
- A "Skip to content" link is the first tab stop. Focus rings are always visible. Current page links use `aria-current`.
- Images carry alt text; decorative ones are empty. Illustrative images show a visible note on the picture.
- The contact form opens the visitor's email app (there is no server) and announces that it did so.

## Imagery

The bundled lab visuals are generated concepts, each labelled as illustrative. Real photos replace them by dropping files into `public/images/` and pointing `content/site.js` at them. The bundled images are 1600px wide JPEGs, about 100 KB each.

The default header wordmark is copied from the [official BITS Pilani Dubai Campus site](https://www.bits-pilani.ac.in/dubai/) and stored locally at `public/images/bits-dubai-campus-logo.webp`.

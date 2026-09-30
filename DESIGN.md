# Design system

The public site uses a quiet, light editorial interface: cream surfaces, deep green type, and a muted sage accent. The desktop homepage stacks the club introduction over the robot showcase, with a slim vertical news rail alongside both. The design gives the lab image the largest share of the viewport while keeping announcements visible. Inner pages reuse the same header, type scale, lines, and accent.

## Tokens

- Background `#f7f7f1`, panel `#fffefa`, text `#24332b`, muted `#627368`.
- Accent defaults to `#426c50` and can be changed in the admin.
- Borders are thin and soft green-gray; image frames and controls use restrained 4–8px radii.
- Self-hosted DM Sans for reading and headings, Chakra Petch for short technical labels and the club identity, and a system monospace stack only for carousel numbering.

## Behavior

- Robot showcase changes every 6.5 seconds, pauses on hover or keyboard focus, and stops autoplay for reduced-motion users.
- Manual carousel controls are buttons with names and a current state.
- Desktop homepage occupies one viewport at ordinary laptop heights; mobile stacks content with natural scrolling.
- Inner-page headings sit near the header, and the current Contact, News, Lab Facilities, and Members content fits with the footer in a standard desktop viewport. Phones keep natural scrolling for readable content and usable forms.
- Longer News, Lab Facilities, and Members collections use page controls to keep the default desktop view compact as content is added.
- The header uses the official campus wordmark, a separate club identity, and a Members dropdown with council and faculty links. Mobile navigation opens from a menu button.
- The footer keeps club identity, a short note, copyright, and quick links together without adding a large section to the homepage.
- Public links and form inputs show visible focus states.

## Imagery

The bundled lab visuals are generated concepts. Each is labeled as illustrative. Admin-uploaded actual lab photos can replace them.

The default header wordmark is copied from the [official BITS Pilani Dubai Campus site](https://www.bits-pilani.ac.in/dubai/) and is stored locally at `public/images/bits-dubai-campus-logo.webp`.

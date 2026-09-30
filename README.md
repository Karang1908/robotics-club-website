# Robotics Club website

Website for the Robotics Club at BITS Pilani Dubai Campus, built with Next.js. Visitors see a one-screen homepage with a robot showcase and a news column, plus pages for members, news, lab facilities and contact.

It is a **standalone static site**: no database, no server code, no accounts, no environment variables. All text lives in one file, `content/site.js`. You edit it, push to GitHub, and Vercel rebuilds and publishes the site.

- **Pages:** `/`, `/news`, `/lab-facilities`, `/members/council`, `/members/faculty`, `/contact`
- **Runs on:** Vercel (or anything that can run `next build`), Node.js 22

## Deploy to Vercel

1. Push this repository to GitHub (it already is).
2. In Vercel choose **Add New > Project**, pick the repository, leave every setting as detected (Framework: Next.js), and click **Deploy**.
3. That is all. Open the `.vercel.app` address Vercel gives you.
4. To use your own domain, add it under **Settings > Domains**. Link previews and the sitemap pick it up automatically.

From then on, every push to the main branch publishes a new version, and every pull request gets its own preview address.

## Change what the site says

Open `content/site.js` (on GitHub you can click the pencil icon, edit, and commit). Each section has a comment explaining it.

| To change | Edit in `content/site.js` |
| --- | --- |
| Club name, logo, header links | `brand`, `navigation` |
| Homepage heading, buttons, rotating pictures | `home`, `robots` |
| Add an announcement | `news`: copy the commented example, fill it in, set `published: true` |
| Add a lab facility | `facilities` |
| Add a council or faculty member | `members`: copy the commented example, set `group` to `'council'` or `'faculty'` |
| Page headings and descriptions | `pages` |
| Contact email, location, social links | `contact` |
| Footer, search title and description, accent colour | `footer`, `seo`, `theme` |
| Small labels and empty-state messages | `ui` |

**Pictures:** put the file in `public/images/` and refer to it as `'/images/file-name.jpg'`. Keep photos under about 300 KB (resize to roughly 1600 px wide), since they load on the visitor's phone.

**Contact form:** the site has no server, so the form does not store anything. Once you fill in `contact.email`, the Contact page shows a form that opens the visitor's own email app with their message ready to send to that address. Until an email is set, the page says contact details are coming soon. If you later want messages to arrive without the visitor's email app, add a form service such as Formspree or a Google Form link.

News starts empty on purpose, and so do the member lists, so nothing unverified is published. The three bundled robot photos are **illustrative concept images**, not photos of the campus lab. Replace them with real photos before presenting them as the actual facilities.

## Run it on your computer

```bash
npm install
npm run dev        # http://localhost:3000, updates as you edit
```

To check the production build the way Vercel makes it:

```bash
npm run build
npm run start
```

## Project layout

```
content/site.js   all the text and settings (the file you edit)
public/images/    pictures
app/              pages, global styles, font, icon
components/       header, showcase carousel, contact form
lib/              small helpers
```

Design notes are in `DESIGN.md` and product intent in `PRODUCT.md`.

## Notes

- Every page is built ahead of time and served from Vercel's CDN, so the site is fast and there is nothing to keep running. The footer year refreshes daily.
- Pages are sent with clickjacking, content-type and referrer protections (`next.config.mjs`).
- Optional: set `SITE_ORIGIN` (for example `https://robotics.example.edu`) in Vercel's environment variables only if link previews show the wrong address. Normally Vercel supplies it.

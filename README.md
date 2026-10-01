# Robotics Club website (in dev)

A Next.js site for the Robotics Club at BITS Pilani Dubai Campus. The public homepage is designed to fit one desktop viewport, with an automatic robot showcase and a news rail. The private editor is at `/admin`; the public site never links to it.

## Run locally

Use Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Set `ADMIN_SETUP_TOKEN` in `.env.local` to a random string of at least 24 characters, restart the app, then visit `http://localhost:3000/admin` to create the first administrator. The setup key and a password of at least 12 characters are required. After the account is created, remove `ADMIN_SETUP_TOKEN` and restart.

Generate a setup key with `openssl rand -hex 32`. Keep it private.

## Admin features

The editor changes the club identity and logo, navigation, homepage text, robot slides, announcements, lab facilities, member profiles, page headings, contact details, social links, footer, search metadata, accent color, and smaller public labels. It accepts JPEG, PNG and WebP uploads up to 5 MB. The Advanced tab exposes the full content document. News starts as a draft and appears publicly only after it is published and saved. Contact form submissions appear in the Inbox.

The three bundled robot images are **illustrative concepts**, not photos of the campus lab. Replace them in the editor before presenting them as documentation of the actual facilities. The reference site had no real news or named members, so those sections start empty.

## Vercel + Supabase deployment

Vercel cannot save files, so on Vercel the site stores its content, admin account, contact messages and uploaded images in Supabase.

1. Create a Supabase project. Open **SQL Editor**, paste the contents of `supabase/setup.sql`, and click **Run**. This creates two locked tables and a public `media` bucket for images.
2. In Supabase, open **Project Settings > API** and copy the **Project URL** and the **service_role** secret key.
3. In Vercel, import this repository. Under **Settings > Environment Variables** add:
   - `SUPABASE_URL`: the Project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: the service_role key. It is only used on the server; never put it in a `NEXT_PUBLIC_` variable.
   - `ADMIN_SETUP_TOKEN`: a random value of 24+ characters (`openssl rand -hex 32`)
   - `SITE_ORIGIN`: the address you open the site on, e.g. `https://your-site.vercel.app`, or leave it unset
4. Deploy (or redeploy after adding variables), open `/admin`, and create the admin account with the setup key.
5. Delete `ADMIN_SETUP_TOKEN` in Vercel and redeploy.

`.env.example` lists the same variables with explanations. Image uploads are limited to 4 MB because Vercel rejects larger requests. Without the Supabase variables (for example on your own computer), the site saves to files in `DATA_DIR` as before.

## College server deployment

This is a Node server application. The server needs Node.js 20.9+, a persistent writable directory, and a reverse proxy such as Nginx or Apache that forwards requests to the Node process.

1. Copy the project to the server and run `npm install` and `npm run build`.
2. Set `DATA_DIR` to an **absolute path** outside a temporary deployment directory, such as `/srv/robotics-club/data`. Make it writable by the Node process. It stores the admin account, edited content, uploaded images, and contact messages.
3. Set `SITE_ORIGIN` to the exact public origin, such as `https://robotics.example.edu`.
4. Set a long `ADMIN_SETUP_TOKEN` for first-time setup. Remove it after creating the admin account.
5. Start the app with `npm run start` and proxy the public HTTPS domain to its local port (default 3000).
6. Back up `DATA_DIR` regularly. Keep it outside the web server's static document root. Use one Node instance with this file-backed store.

Example production environment:

```text
NODE_ENV=production
DATA_DIR=/srv/robotics-club/data
SITE_ORIGIN=https://robotics.example.edu
PORT=3000
```

The app requires a running Node process. It cannot be deployed as static files or served by PHP alone, because editing, uploads, authentication, and contact messages use server routes.

## Routes

- `/` — one-view homepage
- `/news` — published announcements
- `/lab-facilities` — facility entries
- `/members/council` and `/members/faculty` — people
- `/contact` — public contact form
- `/admin` — private editor and inbox

## Content storage

Default content is in `lib/default-site.js`. The first admin save creates `site.json` in `DATA_DIR`; subsequent edits use that file. Admin authentication is stored in `auth.json`, and contact messages in `messages.json`. Uploaded media lives in `DATA_DIR/media` and is served through `/api/media/...`. The `storage` folder in this repository is for local development and is ignored by Git except for `.gitkeep`.

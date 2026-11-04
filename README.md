# ANC Eliezer — Creative Portfolio

A responsive portfolio for Eliezer Chianakwalam (ANC Eliezer), built with plain HTML, CSS and JavaScript. It can be hosted free on GitHub Pages.

## Included

- Home, Long-form Video, Short-form Reels and Graphic Designs sections
- Responsive layout and media lightbox
- Contact email: **chianaeli@gmail.com**
- WhatsApp contact: **+234 703 911 8044** (`https://wa.me/2347039118044`)
- GitHub content editing through `content.js`
- Optional private upload dashboard at `admin.html`, powered by Supabase
- Public portfolio automatically reads published projects from Supabase when configured

## Option A — GitHub-only editing (no backend setup)

1. Upload the contents of this folder to a GitHub repository.
2. In GitHub, open **Settings → Pages**.
3. Under Build and deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
4. Add your media files inside `assets/`.
5. Edit `content.js` and add each item to `longForm`, `reels` or `designs`.
6. Commit your changes. GitHub Pages republishes the site automatically.

Example video entry:

```js
{ title: "Campaign Film", description: "Brand storytelling · 2 min", type: "video", url: "assets/campaign-film.mp4", thumbnail: "assets/campaign-cover.jpg", label: "BRAND FILM" }
```

Example graphic design entry:

```js
{ title: "Visual Identity", description: "Brand identity system", type: "image", url: "assets/identity-board.jpg", thumbnail: "assets/identity-board.jpg", label: "BRAND DESIGN" }
```

You can also use YouTube or Vimeo URLs for video `url` values. Keep the media file sizes reasonable so the GitHub repository does not become unnecessarily large.

## Option B — GitHub + private upload dashboard (recommended)

The dashboard is included, but it needs a Supabase project to provide authentication, a database and file storage. This is a one-time setup. The public site remains a static GitHub Pages site.

### 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings → API**, copy the **Project URL** and the **anon/public key**.
3. Open `supabase-config.js` and replace the placeholders:

```js
window.SUPABASE_CONFIG = {
  url: "https://YOUR-PROJECT.supabase.co",
  anonKey: "YOUR_SUPABASE_ANON_PUBLIC_KEY",
  bucket: "portfolio"
};
```

Only use the anon/public key in the browser. **Never paste a Supabase service-role or secret key into this website.**

### 2. Create the database and storage rules

1. In Supabase, open **SQL Editor → New query**.
2. Paste the full contents of `supabase-setup.sql` and run it.
3. The SQL creates the `portfolio_projects` table, public read access, a public `portfolio` media bucket, and admin-only upload/delete policies.

The policy restricts content management to the email address `chianaeli@gmail.com`.

### 3. Create your admin login

1. In Supabase, open **Authentication → Users → Add user**.
2. Create a user with `chianaeli@gmail.com` and a strong password. Confirm the user if the dashboard asks.
3. In **Authentication → URL Configuration**, add your GitHub Pages website URL to the allowed redirect/site URLs.
4. Deploy the updated website to GitHub Pages.

### 4. Use the dashboard

Visit `https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY/admin.html`.

Sign in with the Supabase admin account. You can then:

- Choose Long-form Video, Short-form Reels or Graphic Designs.
- Upload an image/video, or provide a YouTube/Vimeo link.
- Add a title, description, label and optional thumbnail.
- Publish or delete portfolio entries.

Published items appear on the public portfolio automatically. The upload dashboard uses the Supabase browser client; row-level security and storage policies enforce the admin email restriction.

## Important notes

- The dashboard supports common image formats and MP4/WebM/QuickTime video uploads. Supabase's configured storage limit is 500 MB per file; practical upload reliability depends on connection quality. For large video projects, compress the file or use YouTube/Vimeo and paste the link.
- The portfolio is public by design. Only the admin account can add or delete cloud projects.
- If Supabase is not configured, the public site still works using the arrays in `content.js`.
- GitHub Pages does not run server-side code. Supabase supplies the authentication and media/database services for the optional dashboard.

## Files

- `index.html` — public portfolio
- `styles.css` — visual styling
- `script.js` — rendering and interactions
- `content.js` — GitHub-managed portfolio content and contact details
- `admin.html` / `admin.js` — private upload dashboard
- `supabase-config.js` — public Supabase project configuration placeholders
- `supabase-setup.sql` — database and storage security policies
- `assets/` — local media files for GitHub-only mode

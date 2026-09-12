# Community Service Hub

A Node.js/Express + EJS site for exploring service organizations, service
projects, and project categories.

## Features

- Express server (`server.js`) using ESM `import`/`export`, `const`,
  arrow-function route handlers, and `async`/`await`.
- EJS views for Home, Organizations, Service Projects, and Categories.
- Shared `header.ejs` / `footer.ejs` partials (nav bar, page title, copyright).
- Static assets (`public/css`, `public/images`) served via
  `express.static`.
- Responsive, accessible CSS (visible focus states, `prefers-reduced-motion`
  support, sufficient color contrast) with no framework dependency.

## Local setup

```bash
npm install
cp .env.example .env   # adjust PORT if needed
npm start
```

Then visit `http://localhost:3000`.

## Project structure

```
server.js
views/
  partials/
    header.ejs
    footer.ejs
  index.ejs
  organizations.ejs
  projects.ejs
  categories.ejs
public/
  css/style.css
  images/*.jpg
```

## Pushing to GitHub

The `.gitignore` already excludes `node_modules/` and `.env`, so secrets
are never committed.

```bash
git init
git add .
git commit -m "Initial commit: service project site"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Deploying to Render

1. Create a new **Web Service** on [Render](https://render.com) and connect
   your GitHub repository.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add an environment variable `PORT` is set automatically by Render, but you
   can add any others your `.env.example` lists.
5. Deploy, then verify `/`, `/organizations`, `/projects`, and `/categories`
   all load correctly on the live URL.

## Notes

- Replace the placeholder images in `public/images/` with real photos of
  your partner organizations (keep the same filenames, or update the
  `image` paths in the `organizations` array in `server.js`).
- The CSS in `public/css/style.css` uses CSS custom properties for the
  color palette (forest teal `#1F4B43` primary, warm gold `#E8A33D` accent)
  and Google Fonts (Lora for headings, Source Sans 3 for body text) — feel
  free to adjust the palette to match your organization's branding.

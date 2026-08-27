# Composable Ontologies

Landing page + blog for the composable-ontologies concept and community.
Built with [Astro](https://astro.build). Dark blueprint / monospace aesthetic
modeled on the Galadriel post-mortem deck.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview  # preview the production build
```

## Before you go live — a 3-item checklist

Everything you need to configure lives in **`src/config.ts`**. Search for
`TODO`. The site shows small amber "⚙ TODO" hints in the UI until you fill
these in (toggle with `SHOW_SETUP_HINTS`).

1. **X community link** — set `LINKS.xCommunity` to your X Community invite URL
   (and flip `xCommunityIsPlaceholder` to `false`). Also set `LINKS.xHandle` /
   `LINKS.xProfile`.
2. **Mailing list** — create a free account at
   [buttondown.com](https://buttondown.com), then set
   `LINKS.buttondownUsername` (and flip `buttondownIsPlaceholder` to `false`).
   The form on the site posts straight to Buttondown's embed endpoint — no
   backend needed. Swap providers by editing `src/components/JoinBlock.astro`.
3. **Domain** — confirm `SITE.url` in both `src/config.ts` and
   `astro.config.mjs` is `https://composableontologies.com`.

## Writing the monthly digest

Add a Markdown (or MDX) file to `src/content/blog/`. Frontmatter:

```yaml
---
title: 'Digest #001 — ...'
description: 'One-line summary for cards + meta tags.'
pubDate: 2026-09-15
kind: digest        # 'digest' | 'essay' | 'note'
tags: ['entity-resolution']
draft: false        # true = hidden in production, visible in dev
---
```

The file name becomes the URL slug (`/blog/<filename>/`). RSS lives at
`/rss.xml`.

## Send a post as a newsletter (Buttondown)

Write once, in the post file — it publishes to `/blog` **and** becomes the
email. The script **never sends**; it creates/updates a Buttondown **draft** you
review and send yourself.

**One-time setup:** `cp .env.example .env`, then paste your key from
<https://buttondown.com/requests> into `BUTTONDOWN_API_KEY`.

**Per post:**

1. Add `newsletter: true` to the post's frontmatter (optionally
   `emailSubject: '...'` to override the inbox subject; it defaults to `title`).
2. Run:
   ```bash
   npm run newsletter -- <slug>              # e.g. digest-000-how-this-works
   npm run newsletter -- <slug> --dry-run    # preview the email, no API call
   ```
3. It creates a draft and writes `buttondownId: '...'` back into the frontmatter.
   Open <https://buttondown.com/emails>, review, and **send**.

Re-running the command **updates** that same draft (thanks to the saved
`buttondownId`) instead of creating a duplicate. The script strips frontmatter,
rewrites root-relative URLs to absolute, and appends a canonical
"Read this on the web →" link. See [`docs/adr/0001-newsletter-via-buttondown-draft.md`](docs/adr/0001-newsletter-via-buttondown-draft.md)
for why it's built this way.

## Deploy (free options)

The site is fully static — deploy `dist/` anywhere. Easiest paths:

- **Cloudflare Pages** — connect the repo, build command `npm run build`,
  output dir `dist`. Add the custom domain in the Pages dashboard.
- **Netlify / Vercel** — same idea; both auto-detect Astro.

Then point `composableontologies.com` DNS at the host per its instructions.

## Structure

```
src/
  config.ts              # ← all the knobs (links, provider, domain)
  content.config.ts      # blog collection schema
  styles/global.css      # design system (colors, type, components)
  layouts/BaseLayout.astro
  components/            # Nav, Footer, GraphCanvas, JoinBlock
  content/blog/          # digest + essay markdown
  pages/                 # index, concept, about, blog/, rss.xml
public/                  # favicon.svg, og.svg, robots.txt
```

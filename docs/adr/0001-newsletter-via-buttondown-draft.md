# ADR 0001 — Newsletter delivery: single-source Markdown → Buttondown draft

**Status:** Accepted · 2026-08-27

## Context

Blog posts live as Markdown in `src/content/blog/*.md` and render on `/blog`.
We want a monthly digest emailed via Buttondown (provider username `botos`)
*without* maintaining the content in two places. The site deploys as a static
build with no backend.

Buttondown offers an **RSS-to-email** feature that can auto-generate email drafts
from a feed — and we already publish `/rss.xml`. So "why a custom script?" is a
fair future question.

## Decision

A single source of truth (the post file) drives both site and email. A manual
Node script, `scripts/newsletter.mjs` (`npm run newsletter -- <slug>`), pushes a
post to Buttondown as a **draft** via `POST /v1/emails` (`status: "draft"`).
**The script never sends** — a human reviews and sends in the Buttondown UI.

Supporting choices:

- **Opt-in per post** via `newsletter: true` frontmatter (default false), so not
  every post emails.
- **Dedup** by writing the returned Buttondown `id` back into the post as
  `buttondownId`; a re-run `PATCH`es that draft instead of creating a duplicate.
  An `X-Idempotency-Key` derived from the slug guards the create call.
- The script **strips frontmatter** (Buttondown rejects a body starting with
  `---`), **absolutizes root-relative URLs** (relative links/images break in the
  inbox), and appends a canonical "Read this on the web" link.
- **Subject** = `emailSubject || title`.

## Alternatives considered

- **Buttondown RSS-to-email.** Rejected: it emails *every* feed item (no per-post
  opt-in), gives no human-gated review before send in the way we want, and
  couples inbox content to feed rendering rather than to the source Markdown.
  We wanted precise, per-post control and a hard "review before it hits inboxes"
  gate.
- **Author in Buttondown, import to the site.** Rejected: inverts the source of
  truth away from the repo ("write in the code of the webpage" was the goal).
- **CI/GitHub Action on push.** Deferred: a manual local command avoids CI
  secrets and accidental sends on unrelated pushes. Easy to promote later.

## Consequences

- One place to write; site and email cannot drift.
- Nothing reaches inboxes without a human clicking send in Buttondown.
- `buttondownId` in frontmatter is load-bearing for dedup — don't hand-remove it
  unless you intend a re-run to create a fresh draft.
- If we later want scheduled/auto-send, add a `status: "scheduled"` +
  `publish_date` path (or `about_to_send` with the one-time
  `X-Buttondown-Live-Dangerously: true` confirmation). Intentionally omitted.

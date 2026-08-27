#!/usr/bin/env node
/**
 * newsletter.mjs — publish a blog post to Buttondown as a DRAFT.
 *
 *   npm run newsletter -- <slug> [--dry-run]
 *
 * One source of truth: src/content/blog/<slug>.md is both the website post and
 * the email. This script NEVER sends — it only creates or updates a Buttondown
 * draft. You review and hit "Send" in the Buttondown dashboard.
 *
 * Flow:
 *   - Requires `newsletter: true` in the post's frontmatter.
 *   - Sends the Markdown body BELOW the frontmatter (Buttondown rejects a body
 *     that starts with `---`).
 *   - Rewrites root-relative URLs (/foo) to absolute (https://site/foo) so links
 *     and images resolve in the inbox.
 *   - Appends a canonical "Read this on the web →" link.
 *   - Subject = frontmatter `emailSubject` || `title`.
 *   - No `buttondownId` yet  → POST a new draft, then write the id back into the
 *     post's frontmatter (dedup). Idempotency-Key derived from the slug.
 *   - Has a `buttondownId`    → PATCH that draft (keeps it a single draft).
 *
 * Env: BUTTONDOWN_API_KEY (put it in .env — gitignored — or export it).
 * Docs: https://docs.buttondown.com/api-emails-create
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API_BASE = 'https://api.buttondown.com/v1';
const SITE_URL = 'https://composableontologies.com'; // keep in sync with src/config.ts

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');

// ---- tiny helpers ---------------------------------------------------------
const die = (msg) => {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
};
const unquote = (v) =>
  v == null ? undefined : v.replace(/^['"]/, '').replace(/['"]$/, '').trim();

function loadEnv() {
  // Node ≥20.6 can load a .env directly; fall back to a tiny parser.
  try {
    process.loadEnvFile?.(path.join(ROOT, '.env'));
  } catch {
    /* no .env file — rely on the ambient environment */
  }
}

/** Split a Markdown file into { frontmatter, body, raw }. */
function readPost(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) die(`No frontmatter found in ${path.basename(file)}`);
  return { fm: m[1], body: m[2], raw };
}

/** Read a single scalar key from a frontmatter block. */
const fmGet = (fm, key) => {
  const r = fm.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  return r ? unquote(r[1]) : undefined;
};

/** Insert or replace `buttondownId: <id>` in the raw file and save. */
function writeButtondownId(file, raw, id) {
  let next;
  if (/^buttondownId:\s*.*$/m.test(raw)) {
    next = raw.replace(/^buttondownId:\s*.*$/m, `buttondownId: '${id}'`);
  } else {
    // insert just before the closing frontmatter fence
    next = raw.replace(
      /^(---\r?\n[\s\S]*?)(\r?\n---\r?\n)/,
      (_, head, fence) => `${head}\nbuttondownId: '${id}'${fence}`
    );
  }
  fs.writeFileSync(file, next);
}

/** Root-relative → absolute for Markdown/HTML links and images. */
function absolutizeUrls(md) {
  return md
    .replace(/\]\((\/(?!\/)[^)]*)\)/g, (_, p) => `](${SITE_URL}${p})`) // ](/x)
    .replace(/\b(href|src)="(\/(?!\/)[^"]*)"/g, (_, a, p) => `${a}="${SITE_URL}${p}"`);
}

// ---- main -----------------------------------------------------------------
loadEnv();

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const slug = args.find((a) => !a.startsWith('--'));

if (!slug) {
  const posts = fs.existsSync(BLOG_DIR)
    ? fs.readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f)).map((f) => f.replace(/\.mdx?$/, ''))
    : [];
  console.log('Usage: npm run newsletter -- <slug> [--dry-run]\n\nPosts:');
  posts.forEach((p) => console.log(`  • ${p}`));
  process.exit(0);
}

const file =
  [`${slug}.md`, `${slug}.mdx`]
    .map((f) => path.join(BLOG_DIR, f))
    .find((f) => fs.existsSync(f)) || null;
if (!file) die(`No post found for slug "${slug}" in src/content/blog/`);

const { fm, body, raw } = readPost(file);

if (fmGet(fm, 'newsletter') !== 'true') {
  die(
    `"${slug}" is not opted in. Add \`newsletter: true\` to its frontmatter to email it.`
  );
}

const title = fmGet(fm, 'title');
const subject = fmGet(fm, 'emailSubject') || title;
const buttondownId = fmGet(fm, 'buttondownId');

const emailBody =
  absolutizeUrls(body.trim()) +
  `\n\n---\n\n[Read this on the web →](${SITE_URL}/blog/${slug}/)\n`;

if (dryRun) {
  console.log('── DRY RUN (no API call) ─────────────────────────────');
  console.log('action  :', buttondownId ? `UPDATE draft ${buttondownId}` : 'CREATE draft');
  console.log('subject :', subject);
  console.log('idem-key:', `co-blog-${slug}`);
  console.log('── body ──────────────────────────────────────────────');
  console.log(emailBody);
  process.exit(0);
}

const KEY = process.env.BUTTONDOWN_API_KEY;
if (!KEY) die('BUTTONDOWN_API_KEY is not set. Put it in .env or export it.');

const headers = {
  Authorization: `Token ${KEY}`,
  'Content-Type': 'application/json',
};

async function run() {
  let res, action;
  if (buttondownId) {
    action = 'updated';
    res = await fetch(`${API_BASE}/emails/${buttondownId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ subject, body: emailBody }),
    });
  } else {
    action = 'created';
    res = await fetch(`${API_BASE}/emails`, {
      method: 'POST',
      headers: { ...headers, 'X-Idempotency-Key': `co-blog-${slug}` },
      body: JSON.stringify({ subject, body: emailBody, status: 'draft' }),
    });
  }

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    die(
      `Buttondown API error (${res.status}): ${data.code || ''} ${
        data.detail || data.metadata?.field || text
      }`
    );
  }

  if (action === 'created' && data.id) {
    writeButtondownId(file, raw, data.id);
    console.log(`\n✓ Draft created and buttondownId saved to frontmatter.`);
  } else {
    console.log(`\n✓ Draft ${action}.`);
  }
  console.log(`  id      : ${data.id || buttondownId}`);
  console.log(`  subject : ${subject}`);
  console.log(`\n→ Review and SEND it here: https://buttondown.com/emails\n`);
}

run().catch((e) => die(e.message));

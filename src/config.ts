/**
 * Site-wide configuration. Edit these values — they flow into every page.
 *
 * The three you'll almost certainly want to change first are marked TODO.
 */
export const SITE = {
  name: 'Composable Ontologies',
  domain: 'composableontologies.com',
  url: 'https://composableontologies.com',
  tagline: 'The composable data layer for cross-domain AI.',
  description:
    'Composable ontologies are data-structure infrastructure: let each domain expert model, extract, and resolve their own data — then compose across domains. The payoff is seamless cross-domain data exchange and grounded, higher-quality LLM output. The "company brain" is just one thing it unlocks.',
  author: 'David Botos',
};

export const LINKS = {
  // No X Community yet — the "follow along" card points people at the
  // personal profiles below. When a community exists, set `xCommunity`
  // and flip HAS_X_COMMUNITY to true to swap the card back to a join CTA.
  xHandle: '@dmbotos',
  xProfile: 'https://x.com/dmbotos',
  linkedin: 'https://www.linkedin.com/in/david-botos/',

  // The Discord community — the real gathering place. Shown wherever
  // HAS_DISCORD is true (nav, join block, footer).
  discord: 'https://discord.gg/62XFjSREg',

  // Future: an X Community invite URL. Unused until HAS_X_COMMUNITY is true.
  xCommunity: 'https://x.com/i/communities/1943167428258428948',

  buttondownUsername: 'botos',
  buttondownIsPlaceholder: false,
  email: 'hello@composableontologies.com',
  github: 'https://github.com/dmbotos/composable-ontologies',
};

/** Flip to true once an X Community exists to show a "Join the community" CTA. */
export const HAS_X_COMMUNITY = false;

/** The Discord community is live — it's the primary "join" destination. */
export const HAS_DISCORD = true;

/** Whether to show the yellow "config me" banners in dev. */
export const SHOW_SETUP_HINTS = true;

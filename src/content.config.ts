import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // "digest" = monthly reading digest, "essay" = long-form idea piece.
    kind: z.enum(['essay', 'digest', 'note']).default('essay'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),

    // Newsletter (Buttondown) pipeline — see scripts/newsletter.mjs.
    // newsletter: true opts this post into `npm run newsletter -- <slug>`.
    newsletter: z.boolean().default(false),
    // Optional inbox subject; falls back to `title`.
    emailSubject: z.string().optional(),
    // Written back by the script after a Buttondown draft is created.
    // Its presence makes re-runs UPDATE that draft instead of duplicating.
    buttondownId: z.string().optional(),
  }),
});

export const collections = { blog };

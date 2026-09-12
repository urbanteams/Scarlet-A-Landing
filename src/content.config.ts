import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    // Post taxonomy — drives the eyebrow label on the landing page cards.
    tag: z.enum(['Strategy', 'Game Design']),
    // SORT ORDER ONLY — never rendered. Posts are evergreen: no dates are shown anywhere.
    date: z.coerce.date(),
    author: z.string().default('Devon Sampson'),
  }),
});

export const collections = { blog };

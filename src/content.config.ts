import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// One folder per project in src/content/projects/<name>/, holding index.md and that project's images.
// The folder name is the page address: src/content/projects/red-p/ -> /work/red-p/
const projects = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      title: z.string(),
      short: z.string(),
      year: z.string(),
      platforms: z.string(),
      client: z.string(),
      role: z.string(),
      summary: z.string(),

      // Colour of the image area while there is no image yet (and behind transparent images).
      tint: z.string().default('#E3E1DC'),
      dark: z.boolean().default(false),

      // Card image (cropped to fill the card) and, optionally, a short muted loop instead.
      cover: image().optional(),
      coverAlt: z.string().default(''),
      coverVideo: z.string().optional(),

      // Big image at the top of the project page. Falls back to `cover`.
      hero: image().optional(),
      heroAlt: z.string().default(''),
      heroVideo: z.string().optional(),

      // Images and loops further down the page. `wide: true` = full width, otherwise two per row.
      gallery: z
        .array(
          z.object({
            src: image().optional(),
            video: z.string().optional(),
            poster: image().optional(),
            alt: z.string().default(''),
            wide: z.boolean().default(false),
          }),
        )
        .default([]),

      steps: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
      context: z.string().default(''),
      outcome: z.string().default(''),
      links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    }),
});

export const collections = { projects };

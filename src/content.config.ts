import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Locations — cities / towns / regions we're targeting.
 */
const locations = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/locations' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    parent: z.string().optional(),
    country: z.string().default('United Kingdom'),
    population: z.number().optional(),
    neighborhoods: z.array(z.string()).default([]),
    landmarks: z.array(z.string()).default([]),
    timezone: z.string().default('Europe/London'),
  }),
});

/**
 * Niches — the interest / theme of the site.
 * `pools` holds reusable sets of text variations used by the picker.
 * `faqs` and `testimonials` are structured content used directly in templates.
 */
const niches = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/niches' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    plural: z.string().optional(),
    tagline: z.string().optional(),
    description: z.string().optional(),
    pools: z.record(z.string(), z.array(z.string())).default({}),
    faqs: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([]),
    testimonials: z
      .array(z.object({ name: z.string(), quote: z.string() }))
      .default([]),
  }),
});

export const collections = { locations, niches };

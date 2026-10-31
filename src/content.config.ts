import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

// Optional lesson facts, shown in the flight strip under the page title.
const lesson = z
	.object({
		module: z.string(),
		level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
		time: z.string(),
		needs: z.array(z.object({ label: z.string(), slug: z.string().optional() })).default([]),
	})
	.optional();

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema({ extend: z.object({ lesson }) }) }),
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};

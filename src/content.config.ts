import { defineCollection } from "astro:content";
import { z } from 'astro/zod';
import { file } from "astro/loaders";

const gallery = defineCollection({
	loader: file("src/data/gallery.json"),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			alt: z.string(),
			image: image(),
		}),
});

export const collections = { gallery };

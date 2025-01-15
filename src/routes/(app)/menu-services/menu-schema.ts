import { z } from 'zod';

export const loadMenuSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	imageUrl: z.string().optional(),
	status: z.boolean(),
	createdAt: z.string(),
	lastUpdatedAt: z.string().optional()
});
export type LoadMenuSchema = z.infer<typeof loadMenuSchema>;

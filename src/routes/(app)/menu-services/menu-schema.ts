import { z } from 'zod';

export const loadMenuSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	imagePath: z.string().optional(),
	status: z.boolean(),
	createdAt: z.string(),
	lastUpdatedAt: z.string().optional()
});
export type LoadMenuSchema = z.infer<typeof loadMenuSchema>;

export const insertUpdateMenuSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	imageBase64: z.string().optional(),
	imageName: z.string().optional()
});
export type InsertUpdateMenuSchema = z.infer<typeof insertUpdateMenuSchema>;

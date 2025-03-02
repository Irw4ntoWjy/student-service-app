import { z } from 'zod';

export const menuListSchema = z.object({
	id: z.number().optional(),
	name: z.string(),
	code: z.string(),
	description: z.string(),
	imagePath: z.string(),
	imageBase64: z.string().optional(),
	status: z.boolean(),
	createdBy: z.number().optional()
});
export type MenuList = z.infer<typeof menuListSchema>;

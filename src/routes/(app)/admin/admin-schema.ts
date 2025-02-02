import { z } from 'zod';

const type = ['FORM', 'APPOINTMENT'] as const;

export const menuDialogSchema = z.object({
	id: z.number(),
	menuId: z.string(),
	name: z.string(),
	type: z.enum(type),
	link: z.string(),
	status: z.boolean(),
	createdAt: z.string(),
	lastUpdatedAt: z.string().optional()
});

export type MenuDialogSchema = z.infer<typeof menuDialogSchema>;

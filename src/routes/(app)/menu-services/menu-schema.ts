import { z } from 'zod';

export const menuAction = z.object({
	id: z.number().optional(),
	menuId: z.string(),
	name: z.string(),
	type: z.enum(['LINK', 'APPOINTMENT']),
	status: z.boolean(),
	link: z.string().optional(),
	createdBy: z.number()
});
export type MenuActionSchema = z.infer<typeof menuAction>;

export const currentMenu = z.object({
	id: z.number().optional(),
	name: z.string().optional(),
	code: z.string().optional()
});
export type CurrentMenu = z.infer<typeof currentMenu>;

export const userData = z.object({
	name: z.string(),
	nim: z.string().optional(),
	type: z.enum(['STUDENT', 'EXTERNAL'])
});
export type UserData = z.infer<typeof userData>;

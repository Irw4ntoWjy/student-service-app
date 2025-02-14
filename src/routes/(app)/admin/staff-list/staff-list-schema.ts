import { z } from 'zod';

export const staffListSchema = z.object({
	id: z.number().optional(),
	name: z.string(),
	division: z.string(),
	jobDesc: z.string(),
	createdAt: z.string(),
	lastUpdatedAt: z.string().optional()
});
export type StaffList = z.infer<typeof staffListSchema>;

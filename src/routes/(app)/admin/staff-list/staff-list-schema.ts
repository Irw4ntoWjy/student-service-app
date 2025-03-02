import { z } from 'zod';

export const staffListSchema = z.object({
	id: z.number().optional(),
	name: z.string(),
	divisionId: z.number(),
	jobdesc: z.string(),
	status: z.boolean().default(true)
});
export type StaffList = z.infer<typeof staffListSchema>;

import { z } from 'zod';
import { changeRequestType } from '../../../routes/(app)/admin/change-request-schema';

export const changeRequest = z.object({
	id: z.number().optional(),
	fromId: z.number(),
	type: z.enum(changeRequestType),
	changeJson: z.any(),
	status: z.boolean().default(true),
	createdAt: z.string(),
	createdBy: z.number(),
	lastUpdatedAt: z.string().optional(),
	lastUpdatedBy: z.number().optional()
});
export type ChangeRequestSchema = z.infer<typeof changeRequest>;

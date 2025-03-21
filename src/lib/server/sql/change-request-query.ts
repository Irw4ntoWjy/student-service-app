import { z } from 'zod';
import {
	changeRequestStatus,
	changeRequestType
} from '../../../routes/(app)/admin/change-request-schema';
import { sql } from '@vercel/postgres';

export const changeRequest = z.object({
	id: z.number().optional(),
	fromId: z.number().optional(),
	type: z.enum(changeRequestType),
	changeJson: z.any(),
	status: z.enum(changeRequestStatus),
	createdAt: z.string().optional(),
	createdBy: z.number().optional(),
	lastUpdatedAt: z.string().optional(),
	lastUpdatedBy: z.number().optional()
});
export type ChangeRequestSchema = z.infer<typeof changeRequest>;

export const insertChangeRequest = async (changeReq: ChangeRequestSchema) => {
	try {
		await sql`insert into change_request (from_id, type, changes_json, status, created_by) values (${changeReq.fromId}, ${changeReq.type}, ${changeReq.changeJson}, ${changeReq.status}, 1)`;
	} catch (err) {
		console.error('Error inserting row:', err);
		throw err;
	}
};

export const findTotalChangedRequest = async () => {
	try {
		const { rows } = await sql`select count(*) as count from change_request where status = 'DRAFT'`;
		return Number(rows[0].count);
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

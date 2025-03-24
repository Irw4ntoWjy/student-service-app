import { z } from 'zod';

import { sql } from '@vercel/postgres';
import {
	changeRequestStatus,
	changeRequestType
} from '../../../routes/(app)/admin/edit-request/change-request-schema';

export const changeRequest = z.object({
	id: z.number().optional(),
	fromId: z.number().optional(),
	type: z.enum(changeRequestType),
	changeJson: z.any(),
	menuName: z.string().optional(),
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

export const findAllChangeRequest = async () => {
	try {
		const { rows } = await sql`
			select 
				cr.id as "id",
				cr.from_id as "fromId",
				cr.type,
				cr.changes_json as "changeJson",
				case 
					when cr.type = 'STAFF_LIST' then cr.changes_json->>'divisionId'
					else null
				end as "divisionId",
				m.name as "menuName",
				cr.status,
				cr.created_at as "createdAt",
				cr.created_by as "createdBy",
				cr.last_updated_at as "lastUpdatedAt",
				cr.last_updated_by as "lastUpdatedBy"
			from 
				change_request cr
			left join 
				menu m on m.id = (case when cr.type = 'STAFF_LIST' then (cr.changes_json->>'divisionId')::integer else null end)
			where
				cr.status = 'DRAFT'`;

		return rows as ChangeRequestSchema[];
	} catch (err) {
		console.error('Error fetching change requests:', err);
		throw err;
	}
};

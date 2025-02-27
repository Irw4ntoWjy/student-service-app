import { sql } from '@vercel/postgres';
import { z } from 'zod';

export const staff = z.object({
	id: z.number().optional(),
	divisionId: z.number(),
	name: z.string(),
	jobDesc: z.string(),
	status: z.boolean(),
	createdAt: z.string(),
	createdBy: z.number(),
	lastUpdatedAt: z.string().optional(),
	lastUpdatedBy: z.number().optional()
});
export type StaffSchema = z.infer<typeof staff>;

export const insertStaff = async (staff: StaffSchema) => {
	try {
		await sql`insert into staff_list (division_id, name, job_desc) values (${staff.divisionId}, ${staff.name}, ${staff.jobDesc})`;
	} catch (err) {
		console.error('Error inserting row:', err);
		throw err;
	}
};

export const updateStaff = async () => {};

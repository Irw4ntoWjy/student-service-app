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

export const updateStaff = async (staff: StaffSchema) => {
	try {
		await sql`
		update 
			staff_list 
		set 
			division_id = ${staff.divisionId}, 
			name = ${staff.name}, 
			job_desc = ${staff.jobDesc}, 
			status = ${staff.status},
			last_updated_at = now(),
			last_updated_by = ${staff.lastUpdatedBy}
		where 
			id = ${staff.id}`;
	} catch (err) {
		console.error('Error updating row:', err);
		throw err;
	}
};

export const findById = async (id: number) => {
	try {
		const { rows } = await sql`
			select 
				staff.id as id,
				staff.division_id as divisionId,
				staff.name as name,
				staff.job_desc as jobDesc,
				staff.status as status,
				staff.created_at as createdAt,
				staff.created_by as createdBy,
				staff.last_updated_at as lastUpdatedAt,
				staff.last_updated_by as lastUpdatedBy
			from 
				staff_list staff
			where 
				staff.id = ${id}`;
		if (rows.length === 0) return undefined;
		return rows[0] as StaffSchema;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const findpaginatedstaff = async (filter: string | undefined) => {
	try {
		let query;

		if (filter) {
			query = sql` 
				select 
					staff.id as id,
					staff.division_id as divisionId,
					staff.name as name,
					staff.job_desc as jobdesc,
					staff.status as status,
					staff.created_at as createdat,
					staff.created_by as createdby,
					staff.last_updated_at as lastupdatedat,
					staff.last_updated_by as lastupdatedby
				from 
					staff_list staff
				where 
					upper(staff.name) like ${'%' + filter.toUpperCase() + '%'}
				`;
		} else {
			query = sql`
				select 
					staff.id as id,
					staff.division_id as divisionid,
					staff.name as name,
					staff.job_desc as jobdesc,
					staff.status as status,
					staff.created_at as createdat,
					staff.created_by as createdby,
					staff.last_updated_at as lastupdatedat,
					staff.last_updated_by as lastupdatedby
				from 
					staff_list staff
			`;
		}

		const { rows } = await query;
		return rows as StaffSchema[];
	} catch (err) {
		console.error('error fetching data:', err);
		throw err;
	}
};

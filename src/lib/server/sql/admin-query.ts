import { sql } from '@vercel/postgres';
import { z } from 'zod';

export const adminSchema = z.object({
	id: z.number().optional(),
	userEmail: z.string(),
	userName: z.string(),
	role: z.string(),
	password: z.string(),
	createdAt: z.string(),
	lastUpdatedAt: z.string().optional(),
	lastUpdatedBy: z.number().optional()
});
export type AdminSchema = z.infer<typeof adminSchema>;

export const insertAdmin = async (adminSchema: AdminSchema) => {
	try {
		await sql`insert into admin (user_email, user_name, password) values (${adminSchema.userEmail}, ${adminSchema.userName}, ${adminSchema.password})`;
	} catch (err) {
		console.error('Error inserting row:', err);
		throw err;
	}
};

export const updateAdminPassword = async (adminSchema: AdminSchema) => {
	try {
		const result = await sql`
			update 
				admin 
			set
				password = ${adminSchema.password},
				last_updated_at = now(),
				last_updated_by = ${adminSchema.lastUpdatedBy}
			where 
				id = ${adminSchema.id}
			returning id
		`;
		return result.rows.length > 0;
	} catch (err) {
		console.error('Error updating password:', err);
		throw err;
	}
};

export const getPasswordByUserName = async (username: string) => {
	try {
		const { rows } = await sql`
      select
				adm.password as password
      from 
				admin adm
      where 
				adm.user_name = ${username}`;
		if (rows.length === 0) return undefined;
		return rows[0].password as string;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const findAccountByUserName = async (username: string) => {
	try {
		const { rows } = await sql`
      select
				adm.id,
				adm.user_email as "userEmail",
				adm.user_name as "userName",
				adm.role,
				adm.password,
				adm.created_at as "createdAt"
      from 
				admin adm
      where 
				adm.user_name = ${username}`;
		if (rows.length === 0) return undefined;
		return rows[0] as AdminSchema;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

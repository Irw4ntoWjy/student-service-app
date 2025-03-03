import { sql } from '@vercel/postgres';
import { z } from 'zod';
import type { MenuList } from '../../../routes/(app)/admin/menu-list/menu-list-schema';
import type { MenuActionSchema } from '../../../routes/(app)/menu-services/menu-schema';

export const menu = z.object({
	id: z.number().optional(),
	name: z.string(),
	code: z.string(),
	description: z.string(),
	imagePath: z.string(),
	status: z.boolean(),
	createdAt: z.string(),
	createdBy: z.number(),
	lastUpdatedAt: z.string().optional(),
	lastUpdatedBy: z.number().optional()
});
export type MenuSchema = z.infer<typeof menu>;

export const menuDetail = z.object({
	id: z.number().optional(),
	menuId: z.string(),
	name: z.string(),
	type: z.enum(['LINK', 'APPOINTMENT']),
	status: z.boolean(),
	link: z.string().optional(),
	createdAt: z.string(),
	createdBy: z.number(),
	lastUpdatedAt: z.string().optional(),
	lastUpdatedBy: z.number().optional()
});
export type MenuDetailSchema = z.infer<typeof menuDetail>;

//NOTES created_by masih manual
export const insertMenu = async (menu: MenuList) => {
	try {
		await sql`insert into menu (name, code, description, image_path, created_by) values (${menu.name}, ${menu.code}, ${menu.description}, ${menu.imagePath}, ${menu.createdBy})`;
	} catch (err) {
		console.error('Error inserting row', err);
		throw err;
	}
};

export const insertMenuAction = async (menuAction: MenuActionSchema) => {
	try {
		await sql`insert into menu_detail (menu_id, name, type, status, link, created_by) values (${menuAction.menuId}, ${menuAction.name}, ${menuAction.type}, ${menuAction.status}, ${menuAction.link}, ${menuAction.createdBy})`;
	} catch (err) {
		console.error('Error inserting row', err);
		throw err;
	}
};

export const findMenuById = async (id: number) => {
	try {
		const rows = await sql`
			select
				*
			from 
				menu m
			where m.id = ${id}
		`;
		return rows.rows[0] as MenuSchema;
	} catch (err) {
		console.error('error fetching data:', err);
		throw err;
	}
};

export const findpaginatedMenu = async (filter?: string | undefined) => {
	try {
		let query;

		if (filter) {
			query = sql` 
				select 
					m.id as id,
					m.name as name,
					m.code as code,
					m.description as description,
					m.image_path as imagePath,
					m.status as status,
					m.created_at as createdat,
					m.created_by as createdby,
					m.last_updated_at as lastupdatedat,
					m.last_updated_by as lastupdatedby
				from 
					menu m
				where 
					upper(m.name) like ${'%' + filter.toUpperCase() + '%'}
				`;
		} else {
			query = sql`
				select 
					m.id as id,
					m.name as name,
					m.code as code,
					m.description as "description",
					m.image_path as "imagePath",
					m.status as status,
					m.created_at as "createdAt",
					m.created_by as "createdBy",
					m.last_updated_at as "lastupdatedAt",
					m.last_updated_by as "lastupdatedBy"
				from 
					menu m
			`;
		}

		const { rows } = await query;
		return rows as MenuSchema[];
	} catch (err) {
		console.error('error fetching data:', err);
		throw err;
	}
};

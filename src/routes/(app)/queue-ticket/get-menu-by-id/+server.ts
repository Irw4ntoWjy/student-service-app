import { json } from '@sveltejs/kit';
import type { PageServerLoad } from '../../admin/$types';
import { findMenuById, type MenuSchema } from '$lib/server/sql/menu-query';

export const GET: PageServerLoad = async ({ url }) => {
	const id = url.searchParams.get('id');
	if (id) {
		const menu: MenuSchema = await findMenuById(Number(id));
		return json(menu);
	}
};

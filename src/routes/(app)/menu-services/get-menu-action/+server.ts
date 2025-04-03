import { json } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { findMenuDetailById, type MenuDetailSchema } from '$lib/server/sql/menu-query';

export const GET: PageServerLoad = async ({ url }) => {
	const id = url.searchParams.get('id');

	const getAction: MenuDetailSchema[] = await findMenuDetailById(Number(id));
	return json(getAction);
};

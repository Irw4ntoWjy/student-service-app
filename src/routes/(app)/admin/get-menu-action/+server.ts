import { getMenuAction } from '$lib/server/sql';
import { json } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { MenuDialogSchema } from '../../menu-services/menu-schema';

export const GET: PageServerLoad = async ({ url }) => {
	const id = url.searchParams.get('id');

	const getAction: MenuDialogSchema[] = await getMenuAction(Number(id));
	return json(getAction);
};

import { json } from '@sveltejs/kit';
import type { PageServerLoad } from '../../admin/$types';

export const GET: PageServerLoad = async () => {
	const code = page.url.search;
	const menu: string = await findMenuNameByCode();
	return json(menu);
};

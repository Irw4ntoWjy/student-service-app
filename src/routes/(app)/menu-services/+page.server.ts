import { getAllMenu } from '$lib/server/sql';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const loadPage = await getAllMenu();
	return { loadPage };
};

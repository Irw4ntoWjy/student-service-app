import { getAllDisplayMenu } from '$lib/server/sql';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const loadPage = await getAllDisplayMenu();
	return { loadPage };
};

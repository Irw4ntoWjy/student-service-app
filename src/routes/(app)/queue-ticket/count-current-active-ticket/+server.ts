import { getCurrentActiveTicket } from '$lib/server/sql';
import { json } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const GET: PageServerLoad = async () => {
	const countActiveTicket: number = await getCurrentActiveTicket();
	return json(countActiveTicket);
};

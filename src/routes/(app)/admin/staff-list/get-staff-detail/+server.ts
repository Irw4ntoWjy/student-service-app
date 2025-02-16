import { getStaffListById } from '$lib/server/sql';
import { json } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { StaffList } from '../staff-list-schema';

export const GET: PageServerLoad = async ({ url }) => {
	const id = url.searchParams.get('id');

	const getStaffDetail: StaffList[] = await getStaffListById(Number(id));
	return json(getStaffDetail);
};

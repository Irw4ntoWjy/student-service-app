import { findById, type StaffSchema } from '$lib/server/sql/staff-list-query';
import { json } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const GET: PageServerLoad = async ({ url }) => {
	const id = url.searchParams.get('id');

	const staffDetail: StaffSchema | undefined = await findById(Number(id));
	return json(staffDetail);
};

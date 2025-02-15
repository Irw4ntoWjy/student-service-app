import { getStaffList, getStaffListWithFilter } from '$lib/server/sql';
import type { PageServerLoad } from './$types';
import type { StaffList } from './staff-list-schema';

export const load: PageServerLoad = async ({ url }) => {
	const filter = url.searchParams.get('filter') || undefined;

	let staffList: StaffList[] = [];
	if (!filter) {
		staffList = await getStaffList();
	} else {
		staffList = await getStaffListWithFilter(filter);
	}

	return { staffList };
};

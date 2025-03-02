import { findpaginatedstaff, type StaffSchema } from '$lib/server/sql/staff-list-query';
import type { PageServerLoad } from './$types';
// import { getStaffList, getStaffListWithFilter, insertStaff, updateStaff } from '$lib/server/sql';
// import type { StaffList } from './staff-list-schema';

export const load: PageServerLoad = async ({ url }) => {
	const filter = url.searchParams.get('filter') || undefined;
	const staffList: StaffSchema[] = await findpaginatedstaff(filter);

	return { staffList };
};

// export const actions = {
// 	insertStaffList: async ({ request }) => {
// 		const rawData = await request.formData();

// 		const formatFormData: StaffList = {
// 			name: String(rawData.get('name')),
// 			division: String(rawData.get('division')),
// 			jobDesc: String(rawData.get('jobDesc')),
// 			status: true
// 		};

// 		insertStaff(formatFormData);
// 	},
// 	updateStaffList: async ({ request }) => {
// 		const rawData = await request.formData();

// 		const formatFormData: StaffList = {
// 			id: Number(rawData.get('id')),
// 			name: String(rawData.get('name')),
// 			division: String(rawData.get('division')),
// 			jobDesc: String(rawData.get('jobDesc')),
// 			status: rawData.get('status') === 'true'
// 		};

// 		updateStaff(formatFormData);
// 	}
// };

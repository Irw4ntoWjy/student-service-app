import type { ComboboxType } from '$lib/components/ui/combobox';
import { getComboboxMenu } from '$lib/server/sql/menu-query';
import {
	findpaginatedstaff,
	insertStaff,
	type StaffSchema
} from '$lib/server/sql/staff-list-query';
import type { PageServerLoad } from './$types';
import type { StaffList } from './staff-list-schema';
// import { getStaffList, getStaffListWithFilter, insertStaff, updateStaff } from '$lib/server/sql';
// import type { StaffList } from './staff-list-schema';

export const load: PageServerLoad = async ({ url }) => {
	const filter = url.searchParams.get('filter') || undefined;

	const menuList: ComboboxType[] = await getComboboxMenu();
	const staffList: StaffSchema[] = await findpaginatedstaff(filter);

	return { staffList: staffList, menuList: menuList };
};

export const actions = {
	submitStaffData: async ({ request }) => {
		const formData = await request.formData();

		const formatForm: StaffList = {
			name: String(formData.get('name')),
			divisionId: Number(formData.get('divisionId')),
			jobdesc: String(formData.get('jobdesc')),
			status: true
		};

		await insertStaff(formatForm);
		return { status: 200 };
	}
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

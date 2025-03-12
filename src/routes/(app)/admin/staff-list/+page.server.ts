import type { ComboboxType } from '$lib/components/ui/combobox';
import { getComboboxMenu } from '$lib/server/sql/menu-query';
import {
	findPaginatedStaff,
	insertStaff,
	updateStaff,
	type StaffSchema
} from '$lib/server/sql/staff-list-query';
import type { PageServerLoad } from './$types';
import type { StaffList } from './staff-list-schema';

export const load: PageServerLoad = async ({ url }) => {
	const filter = url.searchParams.get('filter') || undefined;
	const selectedDivision = Number(url.searchParams.get('selectedDivision')) || undefined;

	const menuList: ComboboxType[] = await getComboboxMenu();
	const staffList: StaffSchema[] = await findPaginatedStaff(filter, selectedDivision);

	return { staffList: staffList, menuList: menuList };
};

export const actions = {
	submitStaffData: async ({ request }) => {
		const formData = await request.formData();

		const formatForm: StaffList = {
			id: Number(formData.get('id')),
			name: String(formData.get('name')),
			divisionId: Number(formData.get('divisionId')),
			jobdesc: String(formData.get('jobdesc')),
			status: formData.get('status') === 'true'
		};

		try {
			if (formatForm.id) {
				await updateStaff(formatForm);
			} else {
				await insertStaff(formatForm);
			}
			return { status: 200 };
		} catch (error) {
			console.error('Error occurred:', error);
			return { status: 500, error: 'Failed to process staff data' };
		}
	}
};

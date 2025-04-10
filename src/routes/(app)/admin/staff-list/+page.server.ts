import type { ComboboxType } from '$lib/components/ui/combobox';
import {
	insertChangeRequest,
	type ChangeRequestSchema
} from '$lib/server/sql/change-request-query';
import { getComboboxMenu } from '$lib/server/sql/menu-query';
import {
	findPaginatedStaff,
	insertStaff,
	updateStaff,
	type StaffSchema
} from '$lib/server/sql/staff-list-query';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { StaffList } from './staff-list-schema';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const userSession = cookies.get('user_session');
	if (userSession) {
		try {
			const sessionData = JSON.parse(userSession);
			if (sessionData.role === 'ADMIN') {
				throw error(404, 'No access to this page');
			}
		} catch (e) {
			if (e instanceof Error && e.message === 'No access to this page') {
				throw e;
			}
			throw error(500, 'Sorry No Access To This Page');
		}
	}

	const filter = url.searchParams.get('filter') || undefined;
	const selectedDivision = Number(url.searchParams.get('selectedDivision')) || undefined;

	const menuList: ComboboxType[] = await getComboboxMenu();
	const staffList: StaffSchema[] = await findPaginatedStaff(filter, selectedDivision);

	return { staffList: staffList, menuList: menuList };
};

export const actions = {
	submitStaffData: async ({ request, cookies }) => {
		const formData = await request.formData();

		const id = formData.get('id') || undefined;
		const staff: StaffList = {
			...(id !== null && id !== undefined && { id: Number(id) }),
			name: String(formData.get('name')),
			divisionId: Number(formData.get('divisionId')),
			jobdesc: String(formData.get('jobdesc')),
			status: formData.get('status') === 'true'
		};

		//check user role
		const userSession = cookies.get('user_session');
		if (!userSession) {
			return { success: false, error: 'No user session found' };
		}

		const sessionData = JSON.parse(userSession);

		if (sessionData.role === 'SADMIN') {
			const changeRequest: ChangeRequestSchema = {
				type: 'STAFF_LIST',
				changeJson: JSON.stringify(staff),
				status: 'DRAFT',
				...(id !== null && id !== undefined && !isNaN(Number(id)) && { fromId: Number(id) })
			};

			await insertChangeRequest(changeRequest);
		} else {
			if (staff.id) {
				await updateStaff(staff);
			} else {
				await insertStaff(staff);
			}
		}
	}
};

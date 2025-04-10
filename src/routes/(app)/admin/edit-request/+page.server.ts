import {
	findAllChangeRequest,
	updateChangeRequestStatus,
	type ChangeRequestSchema
} from '$lib/server/sql/change-request-query';
import {
	getAllMenu,
	getAllMenuDetail,
	insertMenu,
	updateMenu,
	type MenuSchema
} from '$lib/server/sql/menu-query';
import {
	getAllStaff,
	insertStaff,
	updateStaff,
	type StaffSchema
} from '$lib/server/sql/staff-list-query';
import type { MenuAndMenuDetailSchema } from '../../menu-services/menu-schema';
import type { PageServerLoad } from './$types';
import type { ChangeRequestStatus, ChangeRequestType } from './change-request-schema';

export const load: PageServerLoad = async ({ cookies }) => {
	const userSession = cookies.get('user_session');
	const changeRequest: ChangeRequestSchema[] = await findAllChangeRequest();
	const staffList: StaffSchema[] = await getAllStaff();
	const menuList: MenuSchema[] = await getAllMenu();
	const menuDetailList: MenuAndMenuDetailSchema[] = await getAllMenuDetail();

	if (userSession) {
		try {
			const sessionData = JSON.parse(userSession);
			return {
				user: {
					userName: sessionData.userName,
					role: sessionData.role
				},
				changeRequest,
				staffList,
				menuList,
				menuDetailList
			};
		} catch (e) {
			console.error('Failed to parse user_session cookie:', e);
		}
	}

	return { changeRequest, staffList, menuList, menuDetailList };
};

export const actions = {
	submitChangeRequest: async ({ request, cookies }) => {
		const userSession = cookies.get('user_session');
		if (!userSession) {
			return { success: false, error: 'No user session found' };
		}

		const sessionData = JSON.parse(userSession);
		if (sessionData.role === 'HEAD') {
			const formData = await request.formData();
			const status = String(formData.get('status')) as ChangeRequestStatus;
			const type = String(formData.get('type')) as ChangeRequestType;
			const requestType = String(formData.get('requestType')) as 'EDIT' | 'NEW';
			const changeJson = String(formData.get('changeJson'));

			await updateChangeRequestStatus(Number(formData.get('id')), status);

			if (status === 'ACCEPTED' && type === 'STAFF_LIST') {
				const data: StaffSchema = JSON.parse(changeJson);

				if (requestType === 'EDIT') {
					await updateStaff(data);
				} else {
					await insertStaff(data);
				}
			}

			if (status === 'ACCEPTED' && type === 'MENU') {
				const data: MenuSchema = JSON.parse(changeJson);
				console.log(data);

				if (requestType === 'EDIT') {
					await updateMenu(data);
				} else {
					await insertMenu(data);
				}
			}
		}
	}
};

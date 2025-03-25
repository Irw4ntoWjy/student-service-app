import {
	findAllChangeRequest,
	type ChangeRequestSchema
} from '$lib/server/sql/change-request-query';
import { getAllStaff, type StaffSchema } from '$lib/server/sql/staff-list-query';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const changeRequest: ChangeRequestSchema[] = await findAllChangeRequest();
	const staffList: StaffSchema[] = await getAllStaff();

	return { changeRequest, staffList };
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
		}
	}
};

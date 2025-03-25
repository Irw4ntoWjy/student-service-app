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

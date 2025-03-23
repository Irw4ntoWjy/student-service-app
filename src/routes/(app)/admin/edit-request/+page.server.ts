import {
	findAllChangeRequest,
	type ChangeRequestSchema
} from '$lib/server/sql/change-request-query';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const changeRequest: ChangeRequestSchema[] = await findAllChangeRequest();
	return { changeRequest };
};

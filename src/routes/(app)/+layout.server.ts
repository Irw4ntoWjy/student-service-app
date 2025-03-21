import { findTotalChangedRequest } from '$lib/server/sql/change-request-query';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const loadChangeRequest = await findTotalChangedRequest();

	const userSession = cookies.get('user_session');
	if (userSession) {
		try {
			const sessionData = JSON.parse(userSession);
			return {
				user: {
					userName: sessionData.userName,
					role: sessionData.role
				},
				loadChangeRequest
			};
		} catch (e) {
			console.error('Failed to parse user_session cookie:', e);
		}
	}
	return { user: undefined, loadChangeRequest };
};

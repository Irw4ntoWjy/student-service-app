import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
	const userSession = cookies.get('user_session');
	if (userSession) {
		try {
			const sessionData = JSON.parse(userSession);
			return {
				user: {
					userName: sessionData.userName,
					role: sessionData.role
				}
			};
		} catch (e) {
			console.error('Failed to parse user_session cookie:', e);
		}
	}
	return { user: undefined };
};

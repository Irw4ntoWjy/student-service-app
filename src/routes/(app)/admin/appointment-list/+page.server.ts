import { findAllAppointment } from '$lib/server/sql/appointment-query';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { AppointmentListSchema } from './appointment-list-schema';

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
	const startDate = url.searchParams.get('startDate') || undefined;
	const endDate = url.searchParams.get('endDate') || undefined;

	const appointmentList: AppointmentListSchema[] = await findAllAppointment(
		filter,
		startDate,
		endDate
	);

	return { appointmentList };
};

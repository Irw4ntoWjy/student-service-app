import { findAllAppointment } from '$lib/server/sql/appointment-query';
import type { PageServerLoad } from '../$types';
import type { AppointmentListSchema } from './appointment-list-schema';

export const load: PageServerLoad = async ({ url }) => {
	const filter = url.searchParams.get('filter') || undefined;
	const startDate = url.searchParams.get('startDate') || undefined;
	const endDate = url.searchParams.get('endDate') || undefined;

	const appointmentList: AppointmentListSchema[] = await findAllAppointment(
		filter,
		startDate,
		endDate
	);

	// if (filter || (startDate && endDate)) {
	// 	appointmentList = await getFilteredAppointment(filter, startDate, endDate);
	// } else {
	// 	appointmentList = await getAllAppointment();
	// }

	return { appointmentList };
};

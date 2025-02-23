import { getAllAppointment, getFilteredAppointment } from '$lib/server/sql';
import type { PageServerLoad } from '../$types';
import type { AppointmentTicketSchema } from '../../queue-ticket/queue-ticket-schema';

export const load: PageServerLoad = async ({ url }) => {
	const filter = url.searchParams.get('filter') || undefined;
	const startDate = url.searchParams.get('startDate') || undefined;
	const endDate = url.searchParams.get('endDate') || undefined;

	let appointmentList: AppointmentTicketSchema[] = [];

	if (filter || (startDate && endDate)) {
		appointmentList = await getFilteredAppointment(filter, startDate, endDate);
	} else {
		appointmentList = await getAllAppointment();
	}

	return { appointmentList };
};

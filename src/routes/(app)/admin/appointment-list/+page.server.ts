import { getAllAppointment } from '$lib/server/sql';
import type { PageServerLoad } from '../$types';
import type { AppointmentTicketSchema } from '../../queue-ticket/queue-ticket-schema';

export const load: PageServerLoad = async () => {
	const appointmentList: AppointmentTicketSchema[] = await getAllAppointment();
	return { appointmentList };
};

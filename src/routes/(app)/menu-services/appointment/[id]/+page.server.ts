import { getAppointmentTicket, getAppointmentTicketByAppointmentNo } from '$lib/server/sql';
import { broadcastUpdate } from '$lib/server/web-socket';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const appointmentNo = params.id;

	const loadPage = await getAppointmentTicketByAppointmentNo(appointmentNo);
	const updatedTickets = await getAppointmentTicket();
	broadcastUpdate({ type: 'UPDATE', data: updatedTickets });

	return { loadPage };
};

import { broadcastUpdate } from '$lib/server/ably';
import {
	getAppointmentTicket,
	getAppointmentTicketByAppointmentNo,
	updateAppointmentPending
} from '$lib/server/sql';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const appointmentNo = params.id;
	const fetchData = await getAppointmentTicketByAppointmentNo(appointmentNo);

	//update the status of current ticket into pending
	await updateAppointmentPending(fetchData.id);

	const updatedTickets = await getAppointmentTicket();
	broadcastUpdate({ type: 'UPDATE', data: updatedTickets });

	return { fetchData };
};

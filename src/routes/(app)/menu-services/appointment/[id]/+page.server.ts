import { broadcastUpdate } from '$lib/server/ably';
import {
	getAppointmentTicket,
	getAppointmentTicketByAppointmentNo,
	updateAppointmentTicket
} from '$lib/server/sql';
import type { UpdateAppointmentTicketSchema } from '../../../queue-ticket/queue-ticket-schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const appointmentNo = params.id;

	const fetchData = await getAppointmentTicketByAppointmentNo(appointmentNo);
	const model: UpdateAppointmentTicketSchema = {
		id: fetchData.id,
		status: 'pending'
	};

	//update the status of current ticket into pending
	await updateAppointmentTicket(model);

	const updatedTickets = await getAppointmentTicket();
	broadcastUpdate({ type: 'UPDATE', data: updatedTickets });

	return { fetchData };
};

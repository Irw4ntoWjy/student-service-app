import { getAppointmentTicket, updateAppointmentTicket } from '$lib/server/sql';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Status, UpdateAppointmentTicketSchema } from './queue-ticket-schema';

export const load: PageServerLoad = async () => {
	const appointmentTicket = await getAppointmentTicket();

	return {
		appointmentTicket
	};
};

export const actions = {
	updateStatusActive: async ({ request }) => {
		const rawData = await request.formData();

		const formData: UpdateAppointmentTicketSchema = {
			id: Number(rawData.get('id')),
			status: String(rawData.get('status')) as Status,
			cancelReason: String(rawData.get('cancelReason'))
		};

		updateAppointmentTicket(formData);
	}
} satisfies Actions;

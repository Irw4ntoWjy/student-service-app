import {
	getAppointmentTicket,
	updateAppointmentActive,
	updateAppointmentCancelled,
	updateAppointmentClosed,
	updateAppointmentWaiting
} from '$lib/server/sql';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Status } from './queue-ticket-schema';

export const load: PageServerLoad = async () => {
	const appointmentTicket = await getAppointmentTicket();

	return {
		appointmentTicket
	};
};

export const actions = {
	updateStatusActive: async ({ request }) => {
		const rawData = await request.formData();
		const status = String(rawData.get('status')) as Status;

		if (status === 'active') {
			updateAppointmentActive(Number(rawData.get('id')));
		}

		if (status === 'closed') {
			updateAppointmentClosed(Number(rawData.get('id')));
		}

		if (status === 'waiting') {
			updateAppointmentWaiting(Number(rawData.get('id')));
		}

		if (status === 'cancelled') {
			updateAppointmentCancelled(Number(rawData.get('id')), String(rawData.get('cancelReason')));
		}
	}
} satisfies Actions;

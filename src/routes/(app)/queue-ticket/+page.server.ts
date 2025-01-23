import { getAppointmentTicket } from '$lib/server/sql';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const appointmentTicket = await getAppointmentTicket();
	return {
		appointmentTicket
	};
};

export const actions = {
	updateStatusActive: async ({ request }) => {
		const rawData = await request.formData();
		console.log(rawData);
	}
} satisfies Actions;

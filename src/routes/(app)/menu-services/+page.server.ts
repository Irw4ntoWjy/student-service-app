import { getAllDisplayMenu, getAppointmentTicket, insertAppointment } from '$lib/server/sql';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { InsertUpdateAppointmentSchema } from './menu-schema';
import { broadcastUpdate } from '$lib/server/web-socket';

export const load: PageServerLoad = async () => {
	const loadPage = await getAllDisplayMenu();
	return { loadPage };
};

export const actions = {
	insertAppointment: async ({ request }) => {
		const rawData = await request.formData();

		const formData: InsertUpdateAppointmentSchema = {
			menuId: Number(rawData.get('menuId')),
			appointmentNo: String(rawData.get('appointmentNo')),
			reason: String(rawData.get('reason'))
		};

		insertAppointment(formData);

		const updatedTickets = await getAppointmentTicket();

		broadcastUpdate({ type: 'UPDATE', data: updatedTickets });
	}
} satisfies Actions;

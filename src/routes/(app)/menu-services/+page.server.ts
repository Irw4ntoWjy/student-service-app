import { getAllDisplayMenu, insertAppointment } from '$lib/server/sql';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { InsertUpdateAppointmentSchema } from './menu-schema';

export const load: PageServerLoad = async () => {
	const loadPage = await getAllDisplayMenu();
	return { loadPage };
};

export const actions = {
	insertAppointment: async ({ request }) => {
		const rawData = await request.formData();
		console.log(rawData);

		const formData: InsertUpdateAppointmentSchema = {
			menuId: String(rawData.get('menuId')),
			appointmentNo: String(rawData.get('appointmentNo')),
			reason: String(rawData.get('reason'))
		};

		insertAppointment(formData);
	}
} satisfies Actions;

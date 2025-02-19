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

		const formData: InsertUpdateAppointmentSchema = {
			menuId: String(rawData.get('menuId')),
			appointmentNo: String(rawData.get('appointmentNo')),
			reason: String(rawData.get('reason')),
			status: 'created',
			userStatus: String(rawData.get('userStatus')) as 'GENERAL' | 'ACTIVE',
			userName: String(rawData.get('userName'))
		};

		const userNim = rawData.get('userNim');
		if (userNim !== undefined && formData.userStatus !== 'GENERAL') {
			formData.userNim = String(userNim);
		}

		insertAppointment(formData);
	}
} satisfies Actions;

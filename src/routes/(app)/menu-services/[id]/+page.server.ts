import { insertAppointment } from '$lib/server/sql';
import type { Actions } from '@sveltejs/kit';
import type { InsertUpdateAppointmentSchema } from '../menu-schema';

export const actions = {
	insertAppointment: async ({ request }) => {
		const rawData = await request.formData();

		const formattedFormData: InsertUpdateAppointmentSchema = {
			appointmentNo: String(rawData.get('appointmentNo')),
			menuId: Number(rawData.get('menuId')),
			reason: rawData.get('reason')?.toString() ?? ''
		};

		await insertAppointment(formattedFormData);

		return {
			status: 200,
			body: { message: 'Appointment inserted successfully' }
		};
	}
} satisfies Actions;

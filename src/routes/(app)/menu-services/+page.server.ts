import { createAppointment } from '$lib/server/sql/appointment-query';
import { findpaginatedMenu } from '$lib/server/sql/menu-query';
import type { Actions } from '@sveltejs/kit';
import type { Appointment, AppointmentDetail } from '../queue-ticket/queue-ticket-schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const menuList = await findpaginatedMenu();
	return { menuList };
};

export const actions = {
	createAppointment: async ({ request }) => {
		const formData = await request.formData();

		const appointment: Appointment = {
			menuId: Number(formData.get('menuId')),
			appointmentNo: String(formData.get('appointmentNo')),
			statusType: 'CREATED',
			reason: String(formData.get('reason')),
			createdBy: Number(1)
		};

		const appointmentDetail: AppointmentDetail = {
			userName: String(formData.get('userName')),
			userType: String(formData.get('userType')) as 'STUDENT' | 'EXTERNAL',
			...(formData.get('userNim') !== 'undefined' && { userNim: String(formData.get('userNim')) })
		};

		createAppointment(appointment, appointmentDetail);
	}
} satisfies Actions;

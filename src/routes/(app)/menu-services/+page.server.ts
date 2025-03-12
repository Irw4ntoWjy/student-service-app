import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { findpaginatedMenu } from '$lib/server/sql/menu-query';
import { createAppointment } from '$lib/server/sql/appointment-query';
import type { Appointment, AppointmentDetail } from '../queue-ticket/queue-ticket-schema';

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

		// const formData: InsertUpdateAppointmentSchema = {
		// 	menuId: String(rawData.get('menuId')),
		// 	appointmentNo: String(rawData.get('appointmentNo')),
		// 	reason: String(rawData.get('reason')),
		// 	status: 'created',
		// 	userStatus: String(rawData.get('userStatus')) as 'GENERAL' | 'ACTIVE',
		// 	userName: String(rawData.get('userName'))
		// };

		// const userNim = rawData.get('userNim');
		// if (userNim !== undefined && formData.userStatus !== 'GENERAL') {
		// 	formData.userNim = String(userNim);
		// }

		// insertAppointment(formData);
	}
} satisfies Actions;

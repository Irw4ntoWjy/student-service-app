import type { ComboboxType } from '$lib/components/ui/combobox';
import {
	createAppointment,
	findAppointmentDetailById,
	findOngoingAppointment,
	findTodayAppointment,
	updateAppointmentStatus,
	type AppointmentDetailSchema,
	type StatusType
} from '$lib/server/sql/appointment-query';
import { getComboboxMenu } from '$lib/server/sql/menu-query';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Appointment, AppointmentWithDetail } from './queue-ticket-schema';
import { getComboboxStaff } from '$lib/server/sql/staff-list-query';
import type { AppointmentDetail } from './queue-ticket-schema';

export const load: PageServerLoad = async () => {
	const todayTicket: AppointmentWithDetail[] = await findTodayAppointment();
	const staffList: ComboboxType[] = await getComboboxStaff();
	const menuList: ComboboxType[] = await getComboboxMenu();

	return {
		todayTicket,
		menuList,
		staffList
	};
};

export const actions = {
	insertAppointment: async ({ request }) => {
		const formData = await request.formData();

		const pastAppointmentDetail: AppointmentDetailSchema = await findAppointmentDetailById(
			Number(formData.get('id'))
		);

		const appointment: Appointment = {
			menuId: Number(formData.get('menuId')),
			appointmentNo: String(formData.get('appointmentNo')),
			fromAppointmentId: pastAppointmentDetail.appointmentId,
			statusType: 'SCANNED',
			reason: String(formData.get('reason')),
			createdBy: Number(1)
		};

		const appointmentDetail: AppointmentDetail = {
			userName: pastAppointmentDetail.userName,
			userType: pastAppointmentDetail.userType,
			...(pastAppointmentDetail.userNim !== 'undefined' && {
				userNim: pastAppointmentDetail.userNim
			})
		};

		createAppointment(appointment, appointmentDetail);
	},

	updateAppointmentStatus: async ({ request }) => {
		const formData = await request.formData();

		if ((formData.get('status') as StatusType) === 'ONGOING') {
			const isAppointmentOngoing: boolean = await findOngoingAppointment(
				Number(formData.get('menuId'))
			);
			if (isAppointmentOngoing) {
				return fail(400, {
					message: 'Cannot set to ONGOING: There is already an ongoing appointment'
				});
			}
		}

		const params = {
			id: Number(formData.get('id')),
			status: formData.get('status') as StatusType,
			...(formData.get('status') === 'COMPLETED' && {
				servedBy: Number(formData.get('servedBy'))
			}),
			...(formData.get('status') === 'CANCELLED' && {
				cancelReason: formData.get('cancelReason') as string
			})
		};

		await updateAppointmentStatus(params.id, params.status, params.cancelReason, params.servedBy);

		return { success: true };
	}
};

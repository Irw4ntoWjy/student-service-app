// import type { ComboboxType } from '$lib/components/ui/combobox';
// import {
// 	comboboxMenu,
// 	comboboxStaffList,
// 	getAppointmentTicket,
// 	getAppointmentTicketById,
// 	insertAppointment,
// 	updateAppointmentActive,
// 	updateAppointmentCancelled,
// 	updateAppointmentClosed,
// 	updateAppointmentDetail,
// 	updateAppointmentWaiting
// } from '$lib/server/sql';
// import type { Actions } from '@sveltejs/kit';
// import type { InsertUpdateAppointmentSchema } from '../menu-services/menu-schema';
// import type { PageServerLoad } from './$types';
// import type { QueueTicketSchema, Status } from './queue-ticket-schema';

import type { ComboboxType } from '$lib/components/ui/combobox';
import {
	findOngoingAppointment,
	findTodayAppointment,
	updateAppointmentStatus,
	type StatusType
} from '$lib/server/sql/appointment-query';
import { getComboboxMenu } from '$lib/server/sql/menu-query';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { AppointmentWithDetail } from './queue-ticket-schema';
import { getComboboxStaff } from '$lib/server/sql/staff-list-query';

// export const load: PageServerLoad = async () => {
// 	const appointmentTicket = await getAppointmentTicket();
// 	const staffList: ComboboxType[] = await comboboxStaffList();
// 	const menuList: ComboboxType[] = await comboboxMenu();

// 	return {
// 		appointmentTicket,
// 		staffList,
// 		menuList
// 	};
// };

// export const actions = {
// 	updateStatusActive: async ({ request }) => {
// 		const rawData = await request.formData();
// 		const status = String(rawData.get('status')) as Status;

// 		if (status === 'active') {
// 			updateAppointmentActive(Number(rawData.get('id')));
// 		}

// 		if (status === 'closed') {
// 			updateAppointmentClosed(Number(rawData.get('id')));
// 		}

// 		if (status === 'waiting') {
// 			updateAppointmentWaiting(Number(rawData.get('id')));
// 		}

// 		if (status === 'cancelled') {
// 			updateAppointmentCancelled(Number(rawData.get('id')), String(rawData.get('reason')));
// 		}
// 	},

// 	insertAppointment: async ({ request }) => {
// 		const rawData = await request.formData();

// 		const appointment: QueueTicketSchema = await getAppointmentTicketById(
// 			Number(rawData.get('id'))
// 		);

// 		const formData: InsertUpdateAppointmentSchema = {
// 			menuId: String(rawData.get('menuId')),
// 			appointmentNo: String(rawData.get('appointmentNo')),
// 			reason: String(rawData.get('reason')),
// 			status: 'pending',
// 			scannedAt: 'true',
// 			userName: appointment.userName,
// 			userStatus: appointment.userStatus,
// 			fromAppointmentId: Number(rawData.get('id'))
// 		};

// 		if (formData.userStatus !== 'GENERAL') {
// 			formData.userNim = appointment.userNim;
// 		}

// 		insertAppointment(formData);
// 	},
// 	updateAppointmentDetail: async ({ request }) => {
// 		const rawData = await request.formData();
// 		updateAppointmentDetail(
// 			Number(rawData.get('id')),
// 			Number(rawData.get('servedId')),
// 			String(rawData.get('servedBy'))
// 		);
// 	}
// } satisfies Actions;

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
	updateAppointmentStatus: async ({ request }) => {
		const formData = await request.formData();

		if ((formData.get('status') as StatusType) === 'ONGOING') {
			const isAppointmentOngoing: boolean = await findOngoingAppointment();
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

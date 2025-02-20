import type { ComboboxType } from '$lib/components/ui/combobox';
import {
	comboboxMenu,
	comboboxStaffList,
	getAppointmentTicket,
	getAppointmentTicketById,
	insertAppointment,
	updateAppointmentActive,
	updateAppointmentCancelled,
	updateAppointmentClosed,
	updateAppointmentDetail,
	updateAppointmentWaiting
} from '$lib/server/sql';
import type { Actions } from '@sveltejs/kit';
import type { InsertUpdateAppointmentSchema } from '../menu-services/menu-schema';
import type { PageServerLoad } from './$types';
import type { QueueTicketSchema, Status } from './queue-ticket-schema';

export const load: PageServerLoad = async () => {
	const appointmentTicket = await getAppointmentTicket();
	const staffList: ComboboxType[] = await comboboxStaffList();
	const menuList: ComboboxType[] = await comboboxMenu();

	return {
		appointmentTicket,
		staffList,
		menuList
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
			updateAppointmentCancelled(Number(rawData.get('id')), String(rawData.get('reason')));
		}
	},

	insertAppointment: async ({ request }) => {
		const rawData = await request.formData();

		const appointment: QueueTicketSchema = await getAppointmentTicketById(
			Number(rawData.get('id'))
		);

		const formData: InsertUpdateAppointmentSchema = {
			menuId: String(rawData.get('menuId')),
			appointmentNo: String(rawData.get('appointmentNo')),
			reason: String(rawData.get('reason')),
			status: 'pending',
			scannedAt: 'true',
			userName: appointment.userName,
			userStatus: appointment.userStatus,
			fromAppointmentId: Number(rawData.get('id'))
		};

		if (formData.userStatus !== 'GENERAL') {
			formData.userNim = appointment.userNim;
		}

		insertAppointment(formData);
	},
	updateAppointmentDetail: async ({ request }) => {
		const rawData = await request.formData();
		updateAppointmentDetail(
			Number(rawData.get('id')),
			Number(rawData.get('servedId')),
			String(rawData.get('servedBy'))
		);
	}
} satisfies Actions;

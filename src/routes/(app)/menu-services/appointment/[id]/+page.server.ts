import { broadcastUpdate } from '$lib/server/ably';
import {
	findAppointmentById,
	findByAppointmentNo,
	updateAppointmentStatus
} from '$lib/server/sql/appointment-query';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const appointmentNo = params.id;
	const appointment = await findByAppointmentNo(appointmentNo);

	if (appointment.statusType === 'CREATED' && appointment.id) {
		await updateAppointmentStatus(appointment.id, 'SCANNED');

		const updatedAppointment = await findAppointmentById(appointment.id);
		broadcastUpdate({ type: 'UPDATE', data: updatedAppointment });

		return { appointment };
	}
};

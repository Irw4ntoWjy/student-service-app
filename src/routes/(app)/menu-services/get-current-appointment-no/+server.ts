import { json } from '@sveltejs/kit';
import type { PageServerLoad } from '../../admin/$types';
import { findCurrentAppointmentNo } from '$lib/server/sql/appointment-query';

export const GET: PageServerLoad = async () => {
	const currentAppointmentNo: string = await findCurrentAppointmentNo();
	return json(currentAppointmentNo);
};

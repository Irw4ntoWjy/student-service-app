import { getCurrentAppointmentNo } from '$lib/server/sql';
import { json } from '@sveltejs/kit';
import type { PageServerLoad } from '../../admin/$types';

export const GET: PageServerLoad = async () => {
	const currentAppointmentNo: string = await getCurrentAppointmentNo();
	return json(currentAppointmentNo);
};

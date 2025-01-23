import { z } from 'zod';

export const queueTicketSchema = z.object({
	id: z.number(),
	name: z.string(),
	appointmentNo: z.string(),
	reason: z.string(),
	status: z.string()
});
export type QueueTicketSchema = z.infer<typeof queueTicketSchema>;

export const updateAppointmentTicketSchema = z.object({
	id: z.number(),
	status: z.string(),
	cancelReason: z.string()
});

export type UpdateAppointmentTicketSchema = z.infer<typeof updateAppointmentTicketSchema>;

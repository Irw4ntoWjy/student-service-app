import { z } from 'zod';

export type Status = 'active' | 'pending' | 'waiting' | 'closed' | 'cancelled';

const status = ['active', 'pending', 'waiting', 'closed', 'cancelled'] as const;

export const queueTicketSchema = z.object({
	id: z.number(),
	name: z.string(),
	appointmentNo: z.string(),
	reason: z.string(),
	status: z.enum(status),
	createdAt: z.string()
});
export type QueueTicketSchema = z.infer<typeof queueTicketSchema>;

export const updateAppointmentTicketSchema = z.object({
	id: z.number(),
	status: z.enum(status),
	cancelReason: z.string().optional()
});

export type UpdateAppointmentTicketSchema = z.infer<typeof updateAppointmentTicketSchema>;

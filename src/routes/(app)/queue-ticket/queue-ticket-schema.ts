import { z } from 'zod';

export type Status = 'active' | 'pending' | 'waiting' | 'closed' | 'cancelled';

const status = ['active', 'pending', 'waiting', 'closed', 'cancelled'] as const;

export const queueTicketSchema = z.object({
	id: z.number(),
	name: z.string(),
	appointmentNo: z.string(),
	reason: z.string(),
	status: z.enum(status),
	scannedAt: z.string()
});
export type QueueTicketSchema = z.infer<typeof queueTicketSchema>;

export const appointmentTicketSchema = z.object({
	id: z.number(),
	status: z.enum(status),
	appointmentNo: z.string(),
	menuId: z.string(),
	reason: z.string(),
	createdAt: z.string(),
	scannedAt: z.string().optional(),
	appointmentStartAt: z.string().optional(),
	appointmentFinishedAt: z.string().optional(),
	cancelAt: z.string().optional(),
	cancelReason: z.string().optional()
});
export type AppointmentTicketSchema = z.infer<typeof appointmentTicketSchema>;

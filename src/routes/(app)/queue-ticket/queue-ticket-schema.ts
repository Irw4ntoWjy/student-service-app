import { z } from 'zod';

export type Status = 'active' | 'pending' | 'waiting' | 'closed' | 'cancelled';

const status = ['active', 'pending', 'waiting', 'closed', 'cancelled'] as const;

export const queueTicketSchema = z.object({
	id: z.number(),
	menuId: z.number(),
	menuName: z.string(),
	status: z.enum(status),
	userStatus: z.enum(['GENERAL', 'ACTIVE']),
	userName: z.string(),
	userNim: z.string().optional(),
	servedId: z.number().optional(),
	servedBy: z.string().optional(),
	appointmentNo: z.string(),
	reason: z.string(),
	createdAt: z.string(),
	scannedAt: z.string().optional(),
	appointmentStartAt: z.string().optional(),
	appointmentFinishedAt: z.string().optional(),
	cancelAt: z.string().optional(),
	cancelReason: z.string().optional()
});
export type QueueTicketSchema = z.infer<typeof queueTicketSchema>;

export const appointmentTicketSchema = z.object({
	id: z.number(),
	status: z.enum(status),
	appointmentNo: z.string(),
	fromAppointmentNo: z.string().optional(),
	userName: z.string(),
	userNim: z.string().optional(),
	userStatus: z.enum(['GENERAL', 'ACTIVE']),
	menuName: z.string(),
	reason: z.string(),
	createdAt: z.string(),
	scannedAt: z.string().optional(),
	appointmentStartAt: z.string().optional(),
	appointmentFinishedAt: z.string().optional(),
	servedBy: z.string().optional(),
	cancelAt: z.string().optional(),
	cancelReason: z.string().optional()
});
export type AppointmentTicketSchema = z.infer<typeof appointmentTicketSchema>;

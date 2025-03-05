import { statusType, userType } from '$lib/server/sql/appointment-query';
import { z } from 'zod';

export const appoitnment = z.object({
	menuId: z.number(),
	fromAppointmentId: z.number().optional(),
	statusType: z.enum(statusType),
	appointmentNo: z.string(),
	reason: z.string(),
	createdBy: z.number()
});
export type Appointment = z.infer<typeof appoitnment>;

export const appoitnmentDetail = z.object({
	userType: z.enum(userType),
	userName: z.string(),
	userNim: z.string().optional()
});
export type AppointmentDetail = z.infer<typeof appoitnmentDetail>;

export const appointmentWithDetail = z.object({
	id: z.number(),
	appointmentNo: z.string(),
	statusType: z.enum(statusType),
	reason: z.string(),
	userType: z.enum(userType),
	userName: z.string(),
	userNim: z.string().optional(),
	createdAt: z.string(),
	scannedAt: z.string(),
	appointmentStartAt: z.string().optional(),
	appointmentEndAt: z.string().optional(),
	cancelAt: z.string().optional(),
	cancelReason: z.string().optional()
});
export type AppointmentWithDetail = z.infer<typeof appointmentWithDetail>;

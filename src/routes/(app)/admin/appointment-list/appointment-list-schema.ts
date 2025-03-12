import { statusType, userType } from '$lib/server/sql/appointment-query';
import { z } from 'zod';

export const appointmentList = z.object({
	id: z.number(),
	appointmentNo: z.string(),
	menuId: z.number(),
	menuName: z.string(),
	fromAppointmentId: z.number().optional(),
	fromAppointmentNo: z.string(),
	statusType: z.enum(statusType),
	reason: z.string(),
	userType: z.enum(userType),
	userName: z.string(),
	userNim: z.string().optional(),
	createdAt: z.string(),
	scannedAt: z.string().optional(),
	appointmentStartAt: z.string().optional(),
	appointmentEndAt: z.string().optional(),
	cancelAt: z.string().optional(),
	cancelReason: z.string().optional(),
	servedBy: z.number().optional(),
	servedName: z.string().optional()
});
export type AppointmentListSchema = z.infer<typeof appointmentList>;

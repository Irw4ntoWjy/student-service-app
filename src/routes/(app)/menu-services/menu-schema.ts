import { z } from 'zod';

export const loadMenuSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	imagePath: z.string().optional(),
	status: z.boolean(),
	createdAt: z.string(),
	lastUpdatedAt: z.string().optional()
});
export type LoadMenuSchema = z.infer<typeof loadMenuSchema>;

export const insertUpdateMenuSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	imageBase64: z.string().optional(),
	imageName: z.string().optional(),
	status: z.boolean().optional()
});
export type InsertUpdateMenuSchema = z.infer<typeof insertUpdateMenuSchema>;

export const insertUpdateAppointment = z.object({
	id: z.number().optional(),
	status: z.string().optional(),
	appointmentNo: z.string(),
	menuId: z.number(),
	reason: z.string(),
	cancelAt: z.string().optional(),
	cancelReason: z.string().optional()
});
export type InsertUpdateAppointmentSchema = z.infer<typeof insertUpdateAppointment>;

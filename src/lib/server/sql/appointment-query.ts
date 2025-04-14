import { sql } from '@vercel/postgres';
import { z } from 'zod';
import type {
	Appointment,
	AppointmentDetail,
	AppointmentWithDetail
} from '../../../routes/(app)/queue-ticket/queue-ticket-schema';
import type { AppointmentListSchema } from '../../../routes/(app)/admin/appointment-list/appointment-list-schema';

export const statusType = [
	'CREATED',
	'SCANNED',
	'ONGOING',
	'COMPLETED',
	'CANCELLED',
	'PENDING'
] as const;
export type StatusType = (typeof statusType)[number];

export const userType = ['STUDENT', 'EXTERNAL'] as const;
export type UserType = (typeof userType)[number];

export const appointment = z.object({
	id: z.number().optional(),
	menuId: z.number(),
	fromAppointmentId: z.number().optional(),
	statusType: z.enum(statusType),
	appointmentNo: z.string(),
	reason: z.string(),
	createdAt: z.string(),
	createdBy: z.number(),
	lastUpdatedAt: z.string().optional(),
	lastUpdatedBy: z.number().optional()
});
export type AppointmentSchema = z.infer<typeof appointment>;

export const appointmentDetail = z.object({
	id: z.number().optional(),
	appointmentId: z.number(),
	servedBy: z.number().optional(),
	userType: z.enum(userType),
	userName: z.string(),
	userNim: z.string(),
	scannedAt: z.string().optional(),
	appointmentStartAt: z.string().optional(),
	appointmentEndAt: z.string().optional(),
	cancelAt: z.string().optional(),
	cancelReason: z.string().optional()
});
export type AppointmentDetailSchema = z.infer<typeof appointmentDetail>;

export const appointmentTicket = z.object({
	id: z.number(),
	menuId: z.number(),
	appointmentNo: z.string(),
	statusType: z.enum(statusType)
});

//NOTES created_by masih manual
export const createAppointment = async (
	appointment: Appointment,
	appointmentDetail: AppointmentDetail
) => {
	try {
		const result =
			await sql`insert into appointment (menu_id, from_appointment_id, status_type, appointment_no, reason, created_by) values (${appointment.menuId}, ${appointment.fromAppointmentId}, ${appointment.statusType}, ${appointment.appointmentNo}, ${appointment.reason}, ${appointment.createdBy}) returning id`;

		const appointmentId = result.rows[0]?.id;
		if (!appointmentId) {
			throw new Error('Failed to retrieve appointment Id');
		}
		if (appointment.statusType === 'SCANNED') {
			await sql`insert into appointment_detail (appointment_id, user_type, user_name, user_nim, scanned_at) 
							 values (${appointmentId}, ${appointmentDetail.userType}, ${appointmentDetail.userName}, ${appointmentDetail.userNim}, NOW())`;
		} else {
			await sql`insert into appointment_detail (appointment_id, user_type, user_name, user_nim) 
							 values (${appointmentId}, ${appointmentDetail.userType}, ${appointmentDetail.userName}, ${appointmentDetail.userNim})`;
		}
	} catch (err) {
		console.error('Error inserting row', err);
		throw err;
	}
};

// NOTES last updated by blm sesuai
export const updateAppointmentStatus = async (
	id: number,
	statusType: StatusType,
	cancelReason?: string,
	servedBy?: number
) => {
	try {
		await sql`
			update 
				appointment 
			set  
				status_type = ${statusType},
				last_updated_at = now(),
				last_updated_by = 1
			where id = ${id}`;

		let updateDetailQuery;

		if (statusType === 'SCANNED') {
			updateDetailQuery = sql`
				update 	
					appointment_detail
				set  
					scanned_at = now()
				where appointment_id = ${id}`;
		}

		if (statusType === 'ONGOING') {
			updateDetailQuery = sql`
				update 	
					appointment_detail
				set  
					appointment_start_at = now()
				where appointment_id = ${id}`;
		}

		if (statusType === 'COMPLETED') {
			updateDetailQuery = sql`
				update 	
					appointment_detail
				set  
					appointment_end_at = now(),
					served_by = ${servedBy}
				where appointment_id = ${id}`;
		}

		if (statusType === 'CANCELLED') {
			updateDetailQuery = sql`
				update 	
					appointment_detail
				set  
					cancel_at	 = now(),
					cancel_reason = ${cancelReason}
				where appointment_id = ${id}`;
		}

		await updateDetailQuery;
	} catch (error) {
		console.error('Error updating row:', error);
		throw error;
	}
};

export const findCurrentAppointmentNo = async () => {
	try {
		// Use UTC for consistency
		const now = new Date();
		const currentYear = String(now.getUTCFullYear()).slice(-2);
		const currentMonth = String(now.getUTCMonth() + 1).padStart(2, '0');
		const currentDay = String(now.getUTCDate()).padStart(2, '0');
		const todayPrefix = `${currentYear}${currentMonth}${currentDay}`;

		const { rows } = await sql`
      SELECT 
        appointment_no
      FROM 
        appointment
      WHERE 
        appointment_no LIKE ${`__${todayPrefix}%`}
      ORDER BY appointment_no DESC
      LIMIT 1
    `;

		// Default when no appointment was made today
		if (rows.length === 0) {
			return `${todayPrefix}000`;
		}

		const lastAppointmentNo = rows[0].appointment_no;
		const sequenceMatch = lastAppointmentNo.match(/(\d{3})$/);
		const sequence = sequenceMatch ? Number(sequenceMatch[1]) + 1 : 1;
		return `${todayPrefix}${sequence.toString().padStart(3, '0')}`;
	} catch (err) {
		console.error('Error fetching appointment number:', err);
		throw err;
	}
};

export const findAppointmentDetailById = async (appointmentId: number) => {
	try {
		const result = await sql`
			select
				apd.id,
				apd.appointment_id as "appointmentId",
				apd.served_by as "servedBy",
				apd.user_type as "userType",
				apd.user_name as "userName",
				apd.user_nim as "userNim",
				apd.scanned_at as "scannedAt",
				apd.appointment_start_at as "appointmentStartAt",
				apd.appointment_end_at as "appointmentEndAt",
				apd.cancel_at as "cancelAt",
				apd.cancel_reason as "cancelReason"
			from 
				appointment_detail apd
			where 
				apd.appointment_id = ${appointmentId}`;
		return result.rows[0] as AppointmentDetailSchema;
	} catch (err) {
		console.error('Error Fetching appointment detail id: ', err);
		throw err;
	}
};
export const findAppointmentById = async (appointmentId: number) => {
	try {
		const result = await sql`
			select
				ap.id,
				ap.menu_id as "menuId",
				ap.from_appointment_id as "fromAppointmentId",
				ap.status_type as "statusType",
				ap.appointment_no as "appointmentNo",
				ap.reason,
				ap.created_at as "createdAt",
				ap.created_by as "createdBy",
				ap.last_updated_at as "lastUpdatedAt",
				ap.last_updated_by as "lastUpdatedBy"
			from 
				appointment ap
			where 
				ap.id = ${appointmentId}`;

		return result.rows[0] as AppointmentSchema;
	} catch (err) {
		console.error('Error fetching appointment id:', err);
		throw err;
	}
};

export const findByAppointmentNo = async (appointmentNo: string) => {
	try {
		const result = await sql`
			select
				ap.id,
				ap.menu_id as "menuId",
				ap.from_appointment_id as "fromAppointmentId",
				ap.status_type as "statusType",
				ap.appointment_no as "appointmentNo",
				ap.reason,
				ap.created_at as "createdAt",
				ap.created_by as "createdBy",
				ap.last_updated_at as "lastUpdatedAt",
				ap.last_updated_by as "lastUpdatedBy"
			from 
				appointment ap
			where 
				ap.appointment_no = ${appointmentNo}`;

		return result.rows[0] as AppointmentSchema;
	} catch (err) {
		console.error('Error fetching appointment number:', err);
		throw err;
	}
};

export const findTodayAppointment = async () => {
	try {
		const { rows } = await sql`
			select
				ap.id,
				ap.menu_id as "menuId",
				ap.appointment_no as "appointmentNo",
				ap.status_type as "statusType",
				ap.reason,
				apd.user_type as "userType",
				apd.user_name as "userName",
				apd.user_nim as "userNim",
				ap.created_at as "createdAt",
				apd.scanned_at as "scannedAt",
				apd.appointment_start_at as "appointmentStartAt",
				apd.appointment_end_at as "appointmentEndAt",
				apd.cancel_at as "cancelAt",
				apd.cancel_reason as "cancelReason"
			from
				appointment ap 
			inner join 
				appointment_detail apd on apd.appointment_id = ap.id
			where 
				date(ap.created_at) = current_date
		`;
		return rows as AppointmentWithDetail[];
	} catch (err) {
		console.error('Error fetching appointment:', err);
		throw err;
	}
};

export const findOngoingAppointment = async (menuId: number) => {
	try {
		const { rows } = await sql`
					select exists (
						select 
							1 
						from 
							appointment ap
						where 
							ap.menu_id = ${menuId} and ap.status_type = 'ONGOING' 
							and date(ap.created_at) = current_date
						order by ap.created_at desc
					) as "exists"
			`;
		return rows[0].exists as boolean;
	} catch (err) {
		console.error('Error fetching appointment:', err);
		throw err;
	}
};

export const findAllAppointment = async (
	filter: string | undefined,
	startDate: string | undefined,
	endDate: string | undefined
) => {
	try {
		const { rows } = await sql`
			select 
				ap.id,
				ap.appointment_no as "appointmentNo",
				ap.menu_id as "menuId",
				m.name as menuName,				
				ap.from_appointment_id as "fromAppointmentId",
				(select appointment_no from appointment a where a.id = ap.from_appointment_id) as "fromAppointmentNo",
				ap.status_type as "statusType",
				ap.reason,
				apd.user_type as "userType",
				apd.user_name as "userName",
				apd.user_nim as "userNim",
				ap.created_at as "createdAt",
				apd.scanned_at as "scannedAt",
				apd.appointment_start_at as "appointmentStartAt",
				apd.appointment_end_at as "appointmentEndAt",
				apd.cancel_at as "cancelAt",
				apd.cancel_reason as "cancelReason",
				apd.served_by as "servedBy",
				(select name from staff_list sf where sf.id = apd.served_by) as servedName
			from 
				appointment ap
			inner join 
				appointment_detail apd on apd.appointment_id = ap.id
			inner join 
				menu m on m.id = ap.menu_id
			where 
				(${filter}::text is null or upper(ap.appointment_no) like ${'%' + filter?.toUpperCase() + '%'})
				and (${startDate}::date is null or ${endDate}::date is null or date(ap.created_at) between ${startDate}::date and ${endDate}::date)
			order by 
				ap.created_at desc
		`;
		return rows as AppointmentListSchema[];
	} catch (err) {
		console.error('Error fetching appointment:', err);
		throw err;
	}
};

import type { ComboboxType } from '$lib/components/ui/combobox';
import { sql } from '@vercel/postgres';
import type { StaffList } from '../../routes/(app)/admin/staff-list/staff-list-schema';
import type {
	InsertUpdateAppointmentSchema,
	InsertUpdateMenuSchema,
	LoadMenuSchema,
	MenuDialogSchema
} from '../../routes/(app)/menu-services/menu-schema';
import {
	type AppointmentTicketSchema,
	type QueueTicketSchema
} from '../../routes/(app)/queue-ticket/queue-ticket-schema';

export const getStaffList = async (): Promise<StaffList[]> => {
	try {
		const { rows } = await sql`
            select 
                id, 
                name, 
				division,
                job_desc as "jobDesc",
				status,
                created_at as "createdAt", 
                last_updated_at as "lastUpdatedAt"
            from 
                staff_list 
            order by created_at desc
        `;
		return rows as StaffList[];
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const getStaffListWithFilter = async (filter: string): Promise<StaffList[]> => {
	try {
		const { rows } = await sql`
            select 
				id, 
                name, 
				division,
                job_desc as "jobDesc",
				status,
                created_at as "createdAt", 
                last_updated_at as "lastUpdatedAt"
            from 
                staff_list
            where 
                upper(name) like ${'%' + filter.toUpperCase() + '%'}
            order by created_at desc
        `;
		return rows as StaffList[];
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const getStaffListById = async (id: number) => {
	try {
		const { rows } = await sql`
            select 
                id, 
                name, 
				division,
                job_desc as "jobDesc",
				status,
                created_at as "createdAt", 
                last_updated_at as "lastUpdatedAt"
            from 
                staff_list 
			where
                id = ${id}
  	`;
		return rows as StaffList[];
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const insertAdmin = async (useremail: string, username: string, password: string) => {
	try {
		await sql`insert into admin (user_email, user_name, password) values (${useremail}, ${username}, ${password})`;
	} catch (err) {
		console.error('Error inserting row:', err);
		throw err;
	}
};

export const getAdminAccountPw = async (username: string) => {
	try {
		const { rows } = await sql`
            select
                a.password as password
            from 
                admin a
            where 
                a.user_name = ${username}`;
		return rows[0].password as string;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const insertMenu = async (model: InsertUpdateMenuSchema) => {
	try {
		await sql`insert into menu (name, code, description, image_path, status) values (${model.name}, ${model.code}, ${model.description},${model.imageName}, true)`;
	} catch (error) {
		console.error('Error inserting row:', error);
		throw error;
	}
};

export const updateMenu = async (model: InsertUpdateMenuSchema) => {
	try {
		await sql`update menu set name = ${model.name}, code = ${model.code}, description = ${model.description}, image_path = ${model.imageName}, status = ${model.status}, last_updated_at = now() where id = ${model.id}`;
	} catch (error) {
		console.error('Error updating row:', error);
		throw error;
	}
};

export const getAllDisplayMenu = async (): Promise<LoadMenuSchema[]> => {
	try {
		const { rows } = await sql`
            select 
                id, 
                name, 
				code,
                description,
                image_path AS "imagePath"
			from 
                menu 
            where 
                status = true 
						order by created_at asc
        `;
		return rows as LoadMenuSchema[];
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const getAllMenu = async (): Promise<LoadMenuSchema[]> => {
	try {
		const { rows } = await sql`
            select 
                id, 
                name, 
				code,
                description,
                image_path as "imagePath", 
                status, 
                created_at as "createdAt", 
                last_updated_at as "lastUpdatedAt"
            from 
                menu 
            order by created_at desc
        `;
		return rows as LoadMenuSchema[];
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const getAllMenuWithFilter = async (filter: string): Promise<LoadMenuSchema[]> => {
	try {
		const { rows } = await sql`
            select 
                id, 
                name, 
                code,
                description,
                image_path AS "imagePath", 
                status, 
                created_at AS "createdAt", 
                last_updated_at AS "lastUpdatedAt"
            from 
                menu
            wwhere 
                upper(name) like ${'%' + filter.toUpperCase() + '%'}
            order by created_at desc
        `;
		return rows as LoadMenuSchema[];
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const getAllAppointment = async (): Promise<AppointmentTicketSchema[]> => {
	try {
		const { rows } = await sql`
			select 
				ap.id,
				ap.status,
				ap.appointment_no as "appointmentNo",
				(select appointment_no from appointment a where a.id = ap.from_appointment_id) as "fromAppointmentNo",
				ap.user_name as "userName",
				ap.user_nim as "userNim",
				ap.user_status as "userStatus",
				m.name as menuName,				
				ap.reason,
				ap.created_at as "createdAt",
				ap.scanned_at as "scannedAt",
				ap.appointment_start_at as "appointmentStartAt",
				ap.appointment_finished_at as "appointmentFinishedAt",
				ap.cancel_at as "cancelAt",
				ap.cancel_reason as "cancelReason",
				ap.served_by as "servedBy"
			from 
					appointment ap
			inner join 
				menu m on m.id = ap.menu_id
						order by ap.created_at desc
        `;
		return rows as AppointmentTicketSchema[];
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const getFilteredAppointment = async (
	filter?: string,
	startDate?: string,
	endDate?: string
): Promise<AppointmentTicketSchema[]> => {
	try {
		const { rows } = await sql`
			select 
				ap.id,
				ap.status,
				ap.appointment_no as "appointmentNo",
				(select appointment_no from appointment a where a.id = ap.from_appointment_id) as "fromAppointmentNo",
				ap.user_name as "userName",
				ap.user_nim as "userNim",
				ap.user_status as "userStatus",
				m.name as "menuName",				
				ap.reason,
				ap.created_at as "createdAt",
				ap.scanned_at as "scannedAt",
				ap.appointment_start_at as "appointmentStartAt",
				ap.appointment_finished_at as "appointmentFinishedAt",
				ap.cancel_at as "cancelAt",
				ap.cancel_reason as "cancelReason",
				ap.served_by as "servedBy"
			from 
				appointment ap
			inner join
				menu m ON m.id = ap.menu_id
			where 
				(${filter}::text is null or upper(ap.appointment_no) like ${'%' + filter?.toUpperCase() + '%'})
				and (${startDate}::date is null or ${endDate}::date is null or date(ap.created_at) between ${startDate}::date and ${endDate}::date)
			order by 
				ap.created_at desc;
		`;
		return rows as AppointmentTicketSchema[];
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const insertAppointment = async (insertUpdateAppointment: InsertUpdateAppointmentSchema) => {
	try {
		if (insertUpdateAppointment.scannedAt) {
			await sql`
				insert into appointment (status, appointment_no, menu_id, reason, created_at, scanned_at, user_status, user_name, user_nim, from_appointment_id) 
				values (${insertUpdateAppointment.status}, ${insertUpdateAppointment.appointmentNo}, 
					${insertUpdateAppointment.menuId}, ${insertUpdateAppointment.reason}, 
					now(), now(), ${insertUpdateAppointment.userStatus}, ${insertUpdateAppointment.userName}, 
					${insertUpdateAppointment.userNim !== undefined ? insertUpdateAppointment.userNim : null}, 
					${insertUpdateAppointment.fromAppointmentId})`;
		} else {
			await sql`
				insert into appointment (status, appointment_no, menu_id, reason, created_at, user_status, user_name, user_nim) 
				values (${insertUpdateAppointment.status}, ${insertUpdateAppointment.appointmentNo}, 
					${insertUpdateAppointment.menuId}, ${insertUpdateAppointment.reason}, 
					now(), ${insertUpdateAppointment.userStatus}, ${insertUpdateAppointment.userName}, 
					${insertUpdateAppointment.userNim !== undefined ? insertUpdateAppointment.userNim : null})`;
		}
	} catch (error) {
		console.error('Error inserting row:', error);
		throw error;
	}
};

export const getCurrentAppointmentNo = async (): Promise<string> => {
	try {
		const currentDate = new Date();
		const currentYear = String(currentDate.getFullYear()).slice(-2);
		const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
		const currentDay = String(currentDate.getDate()).padStart(2, '0');
		const todayPrefix = `${currentYear}${currentMonth}${currentDay}`;

		const { rows } = await sql`
            select 
                appointment_no
            from 
                appointment
            order by created_at desc
            limit 1
        `;

		if (rows.length === 0) {
			return `${todayPrefix}000`;
		}

		const lastAppointmentNo = rows[0].appointment_no;
		const lastDatePart = lastAppointmentNo.slice(2, 8);

		if (lastDatePart !== todayPrefix) {
			return `${todayPrefix}000`;
		}

		return lastAppointmentNo;
	} catch (error) {
		console.error('Error fetching appointment number:', error);
		throw error;
	}
};

export const getAppointmentTicket = async () => {
	try {
		const { rows } = await sql`
            select
                ap.id,
                m.name,
                ap.appointment_no as "appointmentNo",
                ap.reason,
                ap.status,
                ap.scanned_at as "scannedAt"
            from 
                appointment ap
            inner join
                menu m on ap.menu_id = m.id
            where 
                date(ap.created_at) = current_date`;
		return rows as QueueTicketSchema[];
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const getAppointmentTicketById = async (id: number) => {
	try {
		const { rows } = await sql`
            select
                ap.id,
				ap.menu_id as "menuId",
                m.name as "menuName",
                ap.status,
				ap.user_status as "userStatus",
				ap.user_name as "userName",
				ap.user_nim as "userNim",
				ap.served_id as "servedId",
				ap.served_by as "servedBy",
                ap.appointment_no as "appointmentNo",
                ap.reason,
				ap.created_at as "createdAt",
                ap.scanned_at as "scannedAt",
                ap.appointment_start_at as "appointmentStartAt",
                ap.appointment_finished_at as "appointmentFinishedAt",
				ap.cancel_at as "cancelAt",
				ap.cancel_reason as "cancelReason"
            from 
                appointment ap
            inner join
                menu m on ap.menu_id = m.id
            where 
                ap.id = ${id}`;
		return rows[0] as QueueTicketSchema;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const getCurrentActiveTicket = async () => {
	try {
		const { rows } = await sql`
            select 
                count(*) as count
            from
                appointment 
            where 
                date(created_at) = current_date and status = 'active'`;

		return rows[0]?.count ?? 0;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const updateAppointmentPending = async (id: number) => {
	try {
		await sql`update appointment set status = 'pending', scanned_at = now() where id = ${id}`;
	} catch (error) {
		console.error('Error updating row:', error);
		throw error;
	}
};

export const updateAppointmentActive = async (id: number) => {
	try {
		await sql`update appointment set status = 'active', appointment_start_at = now() where id = ${id}`;
	} catch (error) {
		console.error('Error updating row:', error);
		throw error;
	}
};

export const updateAppointmentClosed = async (id: number) => {
	try {
		await sql`update appointment set status = 'closed', appointment_finished_at = now() where id = ${id}`;
	} catch (error) {
		console.error('Error updating row:', error);
		throw error;
	}
};

export const updateAppointmentWaiting = async (id: number) => {
	try {
		await sql`update appointment set status = 'waiting' where id = ${id}`;
	} catch (error) {
		console.error('Error updating row:', error);
		throw error;
	}
};

export const updateAppointmentCancelled = async (id: number, reason: string) => {
	try {
		await sql`update appointment set status = 'cancelled', cancel_reason= ${reason}, cancel_at = now() where id = ${id}`;
	} catch (error) {
		console.error('Error updating row:', error);
		throw error;
	}
};

export const getMenuAction = async (id: number) => {
	try {
		const { rows } = await sql`
            select
                md.id,
                md.menu_id as "menuId",
                md.name,
                md.type,
                md.link,
                md.status,
                md.created_at as "createdAt"
            from 
                menu_detail md
            where 
                md.menu_id = ${id}`;
		return rows as MenuDialogSchema[];
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const insertMenuAction = async (insertMenuAction: MenuDialogSchema) => {
	try {
		await sql`insert into menu_detail (menu_id, name, type, link, status, created_at) values (${insertMenuAction.menuId}, ${insertMenuAction.name}, ${insertMenuAction.type}, ${insertMenuAction.link}, true, now())`;
	} catch (error) {
		console.error('Error inserting row:', error);
		throw error;
	}
};

export const getAppointmentTicketByAppointmentNo = async (
	appointmentNo: string
): Promise<QueueTicketSchema> => {
	try {
		const result = await sql`
            select
                ap.id,
                ap.appointment_no as "appointmentNo",
                ap.reason,
                ap.status,
                ap.created_at as "createdAt"
            from 
                appointment ap
            where 
                ap.appointment_no = ${appointmentNo}`;

		return result.rows[0] as QueueTicketSchema;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const comboboxStaffList = async (): Promise<ComboboxType[]> => {
	try {
		const { rows } = await sql`
				select
					(sl.name || ', ' || sl.division) as "label",
					sl.id as "value"
				from 
					staff_list sl`;
		return rows as ComboboxType[];
	} catch (err) {
		console.error('Error fetching data', err);
		throw err;
	}
};

export const comboboxMenu = async (): Promise<ComboboxType[]> => {
	try {
		const { rows } = await sql`
				select
					m.name AS "label",
					m.id as "value",
					m.code as "data"
				from 
					menu m`;
		return rows as ComboboxType[];
	} catch (err) {
		console.error('Error fetching data', err);
		throw err;
	}
};

export const updateAppointmentDetail = async (id: number, servedId: number, servedBy: string) => {
	try {
		await sql`update appointment set served_id = ${servedId}, served_by= ${servedBy} where id = ${id}`;
	} catch (error) {
		console.error('Error updating row:', error);
		throw error;
	}
};

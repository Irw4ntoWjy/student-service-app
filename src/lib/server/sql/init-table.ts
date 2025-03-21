import { sql } from '@vercel/postgres';

export const inittable = async () => {
	try {
		await Promise.all([
			sql`
				create table if not exists admin (
					id serial primary key, 
					user_email varchar(50) not null,
					user_name varchar(50) not null,
					password text not null,
          role varchar(10) not null, 
					created_at timestamp default now(),
					last_updated_at timestamp,
					last_updated_by int4
				)
			`,
			sql`
        create table if not exists menu (
          id serial primary key,
          name varchar(50) not null,
				  code varchar(3) not null,
          description varchar(200) not null,
          image_path text,
          status boolean not null default true,
          created_at timestamp default now(),
					created_by int4 not null,
					last_updated_at timestamp,
					last_updated_by int4,
          constraint fk_created_by 
            foreign key (created_by) 
              references admin(id) on delete cascade on update cascade,
          constraint fk_last_updated_by 
            foreign key (last_updated_by) 
              references admin(id) on delete cascade on update cascade
        )
      `,
			sql`
        create table if not exists menu_detail (
          id serial primary key,
          menu_id int4 not null,
          name varchar(50) not null, 
          type varchar(12) not null check (type in ('LINK', 'APPOINTMENT')), 
          status boolean not null default true,
          link text,
          created_at timestamp default now(),
					created_by int4 not null,
					last_updated_at timestamp,
					last_updated_by int4,
          constraint fk_menu_id
            foreign key (menu_id)
              references menu(id) on delete cascade on update cascade,
          constraint fk_created_by 
            foreign key (created_by) 
              references admin(id) on delete cascade on update cascade,
          constraint fk_last_updated_by
            foreign key (last_updated_by)
              references admin(id) on delete cascade on update cascade,
          constraint check_link_cannot_be_null 
              check (type <> 'APPOINTMENT' or link is not null)
        )
      `,
			sql`
				create table if not exists staff_list (
					id serial primary key,
					division_id int4 not null,
					name varchar(200) not null,
					job_desc varchar(200) not null,
					status boolean not null default true,
					created_at timestamp default now(),
					created_by int4 not null,
					last_updated_at timestamp,
					last_updated_by int4,
          constraint fk_division_id
            foreign key (division_id)
              references menu(id) on delete cascade on update cascade,
          constraint fk_created_by 
            foreign key (created_by) 
              references admin(id) on delete cascade on update cascade,
          constraint fk_last_updated_by
            foreign key (last_updated_by)
              references admin(id) on delete cascade on update cascade
				)
			`,
			sql`
        create table if not exists appointment (
          id serial primary key,
          menu_id int4 not null,
          from_appointment_id int4,
          status_type varchar(15) not null check (status_type in ('CREATED', 'SCANNED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'PENDING')),
          appointment_no varchar(20) not null,
          reason text not null,
          created_at timestamp default now(),
          created_by int4 not null,
          last_updated_at timestamp,
					last_updated_by int4,
          constraint fk_menu_id 
            foreign key (menu_id) 
              references menu(id) on delete cascade on update cascade,
          constraint fk_created_by 
            foreign key (created_by) 
              references admin(id) on delete cascade on update cascade,
          constraint fk_last_updated_by
            foreign key (last_updated_by)
              references admin(id) on delete cascade on update cascade,
          constraint fk_from_appointment_id
            foreign key (from_appointment_id)
              references appointment(id) on delete cascade on update cascade
        )
      `,
			sql`
        create table if not exists appointment_detail (
          id serial primary key,
          appointment_id int4 not null,
          served_by int4,
          user_type varchar(15) not null check (user_type in ('STUDENT', 'EXTERNAL')),
          user_name varchar(50) not null,
          user_nim varchar(20), 
          scanned_at timestamp,
          appointment_start_at timestamp,
          appointment_end_at timestamp,
          cancel_at timestamp,
          cancel_reason text,
          constraint fk_appointment_id
            foreign key (appointment_id) 
              references appointment(id) on delete cascade on update cascade,
          constraint fk_served_by
            foreign key (served_by)
              references staff_list(id) on delete cascade on update cascade,
          constraint check_reason_cannot_be_null
            check (cancel_at is null or cancel_reason is not null),
          constraint check_user_nim_not_null
            check (user_type = 'STUDENT' and user_nim is not null or user_type = 'EXTERNAL')
        )
      `,
			sql`
        create table if not exists change_request (
          id serial primary key,
          from_id int4,
          type varchar(20) not null check (type in ('MENU', 'MENU_DETAIL', 'STAFF_LIST')),
          changes_json JSON not null, 
          status varchar(20) not null check (status in ('DRAFT', 'ACCEPTED', 'REJECTED')),
          created_at timestamp default now(),
          created_by int4 not null,
          last_updated_at timestamp,
					last_updated_by int4,
          constraint fk_created_by 
            foreign key (created_by) 
              references admin(id) on delete cascade on update cascade,
          constraint fk_last_updated_by
            foreign key (last_updated_by)
              references admin(id) on delete cascade on update cascade
        )
      `
		]);
	} catch (err) {
		console.error('error creating tables:', err);
		throw err;
	}
};

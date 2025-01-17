import { sql } from '@vercel/postgres';
import type { InsertUpdateMenuSchema, LoadMenuSchema } from '../../routes/(app)/menu-services/menu-schema';

export const initTable = async () => {
    try {
        await sql`
            create table if not exists menu (
                id SERIAL PRIMARY KEY,
                name varchar(50) not null,
                description varchar(200) not null,
                image_path text,
                status boolean not null,
                created_at timestamp default NOW(),
                last_updated_at timestamp
            )            
        `;
        await sql`
            create table if not exists menu_detail (
                id SERIAL PRIMARY KEY,
                status varchar(10) not null,
                menu_id int4 not null references menu(id) on delete cascade on update cascade,
                created_at timestamp default NOW(),
                last_updated_at timestamp
            )            
        `;
        await sql`
            create table if not exists appoinment (
                id SERIAL PRIMARY KEY,
                status varchar(10) not null,
                appointment_no varchar(5) not null,
                menu_id int4 not null references menu(id) on delete cascade on update cascade,
                reason varchar(200) not null, 
                created_at timestamp default NOW(),
                last_updated_at timestamp,
                cancel_at timestamp,
                cancel_reason varchar(200)
            )            
        `;
    } catch (error) {
        console.error('Error creating table:', error);
        throw error;
    }
};

export const insertMenu = async (model: InsertUpdateMenuSchema) => {
    try {
        await sql`insert into menu (name, description, image_path, status) values (${model.name},${model.description},${model.imageName}, true)`;
    } catch (error) {
        console.error('Error inserting row:', error);
        throw error;
    }
};

export const updateMenu = async (model: InsertUpdateMenuSchema) => {
    try {
        await sql`update menu set name = ${model.name}, description = ${model.description}, image_path = ${model.imageName}, status = ${model.status}, last_updated_at = now() where id = ${model.id}`;
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
                description,
                image_path AS "imagePath"
            from 
                menu 
            where 
                status = true
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
                description,
                image_path AS "imagePath", 
                status, 
                created_at AS "createdAt", 
                last_updated_at AS "lastUpdatedAt"
            from menu 
            order by created_at desc

        `;
        return rows as LoadMenuSchema[];
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

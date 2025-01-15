import { sql } from '@vercel/postgres';
import type { LoadMenuSchema } from '../../routes/(app)/menu-services/menu-schema';

export const getAllMenu = async (): Promise<LoadMenuSchema[]> => {
	try {
		const { rows } = await sql`
            SELECT 
                id, 
                name, 
                description, 
                image_url AS "imageUrl", 
                status, 
                created_at AS "createdAt", 
                last_updated_at AS "lastUpdatedAt"
            FROM menu 
            WHERE status = true
        `;
		return rows as LoadMenuSchema[];
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

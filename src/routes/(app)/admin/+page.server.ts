import { getAllMenu, insertMenu } from '$lib/server/sql';
import type { Actions } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import type { InsertUpdateMenuSchema, LoadMenuSchema } from '../menu-services/menu-schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const menuList: LoadMenuSchema[] = await getAllMenu();
	return { menuList };
};

export const actions = {
	submitForm: async ({ request }) => {
		const rawData = await request.formData();

		const image = rawData.get('image');
		let imageName = rawData.get('imageName');

		if (image && imageName) {
			// Decode the base64 image data
			const base64Data = image.toString().split(';base64,').pop();

			const uploadDir = path.resolve('static/uploads');

			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}

			// Save the image file
			const filePath = path.join(uploadDir, imageName.toString());
			fs.writeFileSync(filePath, base64Data ? base64Data : '', { encoding: 'base64' });

			imageName = filePath;
		}

		const formatFormData: InsertUpdateMenuSchema = {
			id: Number(rawData.get('id')),
			name: String(rawData.get('name')),
			description: String(rawData.get('description')),
			imageName: rawData.get('imageName') ? String(rawData.get('imageName')) : undefined
		};

		insertMenu(formatFormData);
	}
} satisfies Actions;

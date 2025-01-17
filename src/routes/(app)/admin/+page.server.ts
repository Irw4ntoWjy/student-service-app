import { getAllMenu, insertMenu, updateMenu } from '$lib/server/sql';
import type { Actions } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import type { InsertUpdateMenuSchema, LoadMenuSchema } from '../menu-services/menu-schema';
import type { PageServerLoad } from './$types';

const uploadImage = (image: FormDataEntryValue, imageName: FormDataEntryValue) => {
	// Decode the base64 image data
	const base64Data = image.toString().split(';base64,').pop();

	const uploadDir = path.resolve('static/uploads');

	// Ensure the upload directory exists
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true });
	}

	// Skip writing the file and return the existing file path
	const filePath = path.join(uploadDir, imageName.toString());
	if (fs.existsSync(filePath)) {
		return filePath;
	}

	// Save the image file
	fs.writeFileSync(filePath, base64Data ? base64Data : '', { encoding: 'base64' });

	return filePath;
}

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
			imageName = uploadImage(image, imageName)
		}

		const formatFormData: InsertUpdateMenuSchema = {
			id: Number(rawData.get('id')),
			name: String(rawData.get('name')),
			description: String(rawData.get('description')),
			imageName: rawData.get('imageName') ? String(rawData.get('imageName')) : undefined
		};

		insertMenu(formatFormData);
	},
	updateForm: async ({ request }) => {
		const rawData = await request.formData();
		const image = rawData.get('image');
		let imageName = rawData.get('imageName');

		if (image && imageName) {
			imageName = uploadImage(image, imageName)
		}

		const formatFormData: InsertUpdateMenuSchema = {
			id: Number(rawData.get('id')),
			name: String(rawData.get('name')),
			description: String(rawData.get('description')),
			imageName: rawData.get('imageName') ? String(rawData.get('imageName')) : undefined,
			status: rawData.get('status') === 'true'
		};

		updateMenu(formatFormData);
	}
} satisfies Actions;

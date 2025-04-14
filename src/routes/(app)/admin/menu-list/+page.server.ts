import {
	insertChangeRequest,
	type ChangeRequestSchema
} from '$lib/server/sql/change-request-query';
import {
	findpaginatedMenu,
	insertMenu,
	insertMenuAction,
	updateMenu,
	type MenuSchema
} from '$lib/server/sql/menu-query';
import type { Actions } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import type { PageServerLoad } from '../$types';
import type { MenuActionSchema } from '../../menu-services/menu-schema';
import type { MenuList } from './menu-list-schema';
import { error } from '@sveltejs/kit';

export const actions = {
	submitMenu: async ({ request, cookies }) => {
		const formData = await request.formData();

		// handle upload images to project
		const imageBase64 = formData.get('imageBase64');
		let imagePath = formData.get('imagePath');

		if (imageBase64 && imagePath) {
			imagePath = uploadImage(imageBase64, imagePath);
		}

		const id = formData.get('id') || undefined;
		const menuData: MenuList = {
			...(id !== null && id !== undefined && { id: Number(id) }),
			name: String(formData.get('name')),
			code: String(formData.get('code')).toUpperCase(),
			description: String(formData.get('description')),
			imagePath: String(formData.get('imagePath')),
			createdBy: Number(1),
			status: formData.get('status') === 'true'
		};

		//check user role
		const userSession = cookies.get('user_session');
		if (!userSession) {
			return { success: false, error: 'No user session found' };
		}

		const sessionData = JSON.parse(userSession);

		if (sessionData.role === 'SADMIN') {
			const changeRequest: ChangeRequestSchema = {
				type: 'MENU',
				changeJson: JSON.stringify(menuData),
				status: 'DRAFT',
				...(id !== null && id !== undefined && !isNaN(Number(id)) && { fromId: Number(id) })
			};

			await insertChangeRequest(changeRequest);
		} else {
			if (menuData.id) {
				await updateMenu(menuData);
			} else {
				await insertMenu(menuData);
			}
		}
	},

	submitMenuAction: async ({ request, cookies }) => {
		const userSession = cookies.get('user_session');
		if (!userSession) {
			return { success: false, error: 'No user session found' };
		}

		const rawData = await request.formData();

		const id = rawData.get('id') || undefined;
		const formatFormData: MenuActionSchema = {
			id: Number(id),
			menuId: Number(rawData.get('menuId')),
			name: String(rawData.get('name')),
			type: rawData.get('type') as 'LINK' | 'APPOINTMENT',
			link: String(rawData.get('link')),
			status: true,
			createdBy: Number(1)
		};

		const sessionData = JSON.parse(userSession);
		if (sessionData.role === 'SADMIN') {
			const changeRequest: ChangeRequestSchema = {
				type: 'MENU_DETAIL',
				changeJson: JSON.stringify(formatFormData),
				status: 'DRAFT',
				...(id !== null && id !== undefined && !isNaN(Number(id)) && { fromId: Number(id) })
			};

			await insertChangeRequest(changeRequest);
		} else {
			await insertMenuAction(formatFormData);
		}
	}
} satisfies Actions;

const uploadImage = (image: FormDataEntryValue, imageName: FormDataEntryValue) => {
	try {
		// Validate inputs
		if (typeof image !== 'string') {
			throw new Error('Invalid image data: Expected a base64 string');
		}
		if (typeof imageName !== 'string') {
			throw new Error('Invalid image name: Expected a string');
		}

		// Sanitize imageName to prevent path traversal
		const safeImageName = path.basename(imageName);

		// Decode the base64 image data
		const base64Data = image.split(';base64,').pop();
		if (!base64Data) {
			throw new Error('Invalid base64 image data');
		}

		// Define the two upload directories
		const tmpUploadDir = '/tmp/uploads';
		const staticUploadDir = path.resolve('static/uploads');

		// Helper function to save image to a directory
		const saveImage = (uploadDir: string, filePath: string) => {
			// Ensure the upload directory exists
			if (!fs.existsSync(uploadDir)) {
				try {
					fs.mkdirSync(uploadDir, { recursive: true });
				} catch (error) {
					console.warn(`Failed to create directory ${uploadDir}:`, error);
					return false; // Indicate failure
				}
			}

			// Skip writing if the file already exists
			if (fs.existsSync(filePath)) {
				return true; // Indicate success
			}

			// Save the image file
			try {
				fs.writeFileSync(filePath, base64Data, { encoding: 'base64' });
				return true; // Indicate success
			} catch (error) {
				console.warn(`Failed to write file to ${filePath}:`, error);
				return false; // Indicate failure
			}
		};

		const tmpFilePath = path.join(tmpUploadDir, safeImageName);
		const tmpSuccess = saveImage(tmpUploadDir, tmpFilePath);

		const staticFilePath = path.join(staticUploadDir, safeImageName);
		const staticSuccess = saveImage(staticUploadDir, staticFilePath);

		if (tmpSuccess) {
			return tmpFilePath;
		} else if (staticSuccess) {
			return staticFilePath;
		}

		throw new Error('Failed to upload image to any directory');
	} catch (error) {
		console.error('Error in uploadImage:', error);
		throw error;
	}
};

export const load: PageServerLoad = async ({ url, cookies }) => {
	const userSession = cookies.get('user_session');
	if (userSession) {
		try {
			const sessionData = JSON.parse(userSession);
			if (sessionData.role === 'ADMIN') {
				throw error(404, 'No access to this page');
			}
		} catch (e) {
			if (e instanceof Error && e.message === 'No access to this page') {
				throw e;
			}
			throw error(500, 'Sorry No Access To This Page');
		}
	}

	const filter = url.searchParams.get('filter') || undefined;
	const menuList: MenuSchema[] = await findpaginatedMenu(filter);

	return { menuList };
};

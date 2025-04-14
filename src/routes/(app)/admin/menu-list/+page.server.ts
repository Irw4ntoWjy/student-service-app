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
	// Decode the base64 image data
	const base64Data = image.toString().split(';base64,').pop();

	const uploadDir = path.resolve('/tmp');

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

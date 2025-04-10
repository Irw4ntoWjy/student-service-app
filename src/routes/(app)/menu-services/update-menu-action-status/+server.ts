import {
	insertChangeRequest,
	type ChangeRequestSchema
} from '$lib/server/sql/change-request-query';
import { deleteMenuAction } from '$lib/server/sql/menu-query';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { MenuActionSchema } from '../menu-schema';

export const POST: RequestHandler = async ({ url, cookies }) => {
	try {
		const id = url.searchParams.get('id');
		const menuId = url.searchParams.get('menuId');

		if (!id) {
			return json({ message: 'Missing id parameter' }, { status: 400 });
		}

		const parsedId = Number(id);
		if (isNaN(parsedId)) {
			return json({ message: 'Invalid id parameter' }, { status: 400 });
		}

		//check user role
		const userSession = cookies.get('user_session');
		if (!userSession) {
			return json({ success: false, error: 'No user session found' }, { status: 401 });
		}

		const sessionData = JSON.parse(userSession);

		if (sessionData.role === 'SADMIN') {
			const menuAction: MenuActionSchema = {
				id: parsedId,
				name: undefined!,
				type: undefined!,
				menuId: Number(menuId),
				status: false,
				createdBy: 1
			};

			const changeRequest: ChangeRequestSchema = {
				type: 'MENU_DETAIL',
				changeJson: JSON.stringify(menuAction),
				status: 'DRAFT'
			};

			await insertChangeRequest(changeRequest);
		} else {
			await deleteMenuAction(parsedId);
		}

		return json({ message: 'Menu action updated successfully' }, { status: 200 });
	} catch (err) {
		console.error('Error updating menu action:', err);
		return json({ message: 'Internal server error' }, { status: 500 });
	}
};

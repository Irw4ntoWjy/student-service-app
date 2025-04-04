import { deleteMenuAction } from '$lib/server/sql/menu-query';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ url }) => {
	try {
		const id = url.searchParams.get('id');

		if (!id) {
			return json({ message: 'Missing id parameter' }, { status: 400 });
		}

		const parsedId = Number(id);
		if (isNaN(parsedId)) {
			return json({ message: 'Invalid id parameter' }, { status: 400 });
		}

		await deleteMenuAction(parsedId);

		return json({ message: 'Menu action updated successfully' }, { status: 200 });
	} catch (err) {
		console.error('Error updating menu action:', err);
		return json({ message: 'Internal server error' }, { status: 500 });
	}
};

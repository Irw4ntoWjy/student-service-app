import { insertAdmin } from '$lib/server/sql';
import type { Actions } from '@sveltejs/kit';

export const actions = {
	insertAccount: async ({ request }) => {
		const data = await request.formData();

		insertAdmin(
			String(data.get('userEmail')),
			String(data.get('username')),
			String(data.get('password'))
		);
	}
} satisfies Actions;

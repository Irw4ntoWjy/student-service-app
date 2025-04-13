import { findAccountByUserName, updateAdminPassword } from '$lib/server/sql/admin-query';
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

export const actions = {
	updatePassword: async ({ request }) => {
		const formData = await request.formData();
		const username = String(formData.get('userName'));
		const newPassword = String(formData.get('newPassword'));

		const account = await findAccountByUserName(username);
		if (account && account.id) await updateAdminPassword(newPassword, 1, account.id);
	},

	checkAccountValidation: async ({ request }) => {
		const formData = await request.formData();
		const inputUserName = String(formData.get('userName'));
		const inputPassword = String(formData.get('password'));

		const account = await findAccountByUserName(inputUserName);

		if (account && account.password === inputPassword) {
			return { success: true };
		}

		return fail(401, { message: 'Invalid username or password' });
	},

	validateAccount: async ({ request, cookies }) => {
		const formData = await request.formData();
		const inputUserName = String(formData.get('userName'));
		const inputPassword = String(formData.get('password'));

		const account = await findAccountByUserName(inputUserName);

		if (account && account.password === inputPassword) {
			const sessionAge = 60 * 60 * 24; //1 day

			const sessionData = {
				userName: account.userName,
				role: account.role
			};

			cookies.set('user_session', JSON.stringify(sessionData), {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				maxAge: sessionAge
			});

			return { success: true, role: account.role };
		}
		return fail(401, { message: 'Invalid username or password' });
	}
} satisfies Actions;

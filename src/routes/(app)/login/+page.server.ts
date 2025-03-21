import { findAccountByUserName } from '$lib/server/sql/admin-query';
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

export const actions = {
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

			return { success: true };
		}
		return fail(401, { message: 'Invalid username or password' });
	}
} satisfies Actions;

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAdminAccountPw } from '$lib/server/sql';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { username, password } = await request.json();

	const response = await getAdminAccountPw(username);
	console.log(response, 'Res');

	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashedInputPassword = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
	console.log(hashedInputPassword, 'hash');

	if (hashedInputPassword !== response) {
		return json({ error: 'Invalid credentials' }, { status: 401 });
	}

	const maxAge = 60 * 60 * 24;

	cookies.set('user_session', username, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge
	});

	return json({ success: true, username });
};

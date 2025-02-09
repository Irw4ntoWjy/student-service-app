import dotenv from 'dotenv';
import { initTable } from '$lib/server/sql';
import type { ServerInit } from '@sveltejs/kit';
// import { redirect, type Handle, type ServerInit } from '@sveltejs/kit';

export const init: ServerInit = async () => {
	dotenv.config();

	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error('Missing connection string');
	}

	await initTable();
};

// export const handle: Handle = async ({ event, resolve }) => {
// 	const excludedRoutes = ['/queue-ticket', '/admin'];
// 	const userSession = event.cookies.get('user_session');

// 	if (excludedRoutes.includes(event.url.pathname) && !userSession) {
// 		throw redirect(302, '/login');
// 	}

// 	if (event.route.id?.startsWith('/logout')) {
// 		throw redirect(302, '/login');
// 	}

// 	return resolve(event);
// };

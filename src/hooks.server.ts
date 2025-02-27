import { inittable } from '$lib/server/sql/init-table';
import type { ServerInit } from '@sveltejs/kit';
import { redirect, type Handle } from '@sveltejs/kit';
import dotenv from 'dotenv';

export const init: ServerInit = async () => {
	dotenv.config();

	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error('Missing connection string');
	}

	await inittable();
};

export const handle: Handle = async ({ event, resolve }) => {
	// const excludedRoutes = ['/queue-ticket', '/admin'];
	// const userSession = event.cookies.get('user_session');

	// if (excludedRoutes.includes(event.url.pathname) && !userSession) {
	// 	throw redirect(302, '/login');
	// }

	if (event.url.pathname === '/admin') {
		throw redirect(302, '/admin/menu-list');
	}

	return resolve(event);
};

import type { ServerInit } from '@sveltejs/kit';
import dotenv from 'dotenv';

export const init: ServerInit = async () => {
	dotenv.config();

	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error('Missing connection string');
	}
};

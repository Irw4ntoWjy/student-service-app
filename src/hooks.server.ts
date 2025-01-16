import dotenv from 'dotenv';
import { initTable } from "$lib/server/sql";
import type { ServerInit } from "@sveltejs/kit";

export const init: ServerInit = async () => {
    dotenv.config();

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('Missing connection string');
    }
    
    await initTable();
};

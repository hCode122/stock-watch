import { Pool } from 'pg';
import { envConfig } from './environment';

export const pool = new Pool({
    host: envConfig.database.host,
    port: envConfig.database.port,
    database: envConfig.database.name,
    user: envConfig.database.user,
    password: envConfig.database.password,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Database connected successfully');
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
};
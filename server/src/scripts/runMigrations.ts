import { pool } from '../config/database';
import { initDatabase } from './initDatabase';

async function runMigrations() {
    console.log('Running database migrations...');
    
    try {
        await initDatabase();
        console.log('Migrations completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migrations failed:', error);
        process.exit(1);
    }
}

runMigrations();
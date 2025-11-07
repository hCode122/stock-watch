import {Pool} from 'pg';
import {config} from './environment'

export const pool = new Pool({
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})

export const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Connected successfully')
        client.release()
        return true
    } catch(error) {
        console.error('Connection failed', error)
        return false
    }
}
import {Pool} from 'pg';
import {envConfig} from './environment'

export const pool = new Pool({
    host: envConfig.database.host,
    port: envConfig.database.port,
    database: envConfig.database.name,
    user: envConfig.database.user,
    password: envConfig.database.password,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})

export const testConnection = async () => {
    try {
        console.log([pool])
        const client = await pool.connect();
        console.log('Connected successfully')
        client.release()
        return true
    } catch(error) {
        console.error('Connection failed', error)
        return false
    }
}
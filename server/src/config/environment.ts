import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5005,
    nodenv: process.env.NODE_ENV || 'development',

    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        name: process.env.DB_NAME || 'stock_tracker',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
    },
    
    jwt: {
        secret: process.env.JWT_SECRET || 'your-dev-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    
    apis: {
        alphaVantage: process.env.ALPHA_VANTAGE_API_KEY || 'demo',
        coinGecko: process.env.COINGECKO_API_KEY || '',
    },
};
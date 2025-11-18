import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 5005,
    nodeEnv: process.env.NODE_ENV || 'development',

    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        name: process.env.DB_NAME || 'stock-app',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '1234',
    },
    
    jwt: {
        secret: process.env.JWT_SECRET || '4f0d6b3bd2e8b0c4622913f5cafac4204e6204c90b070278b6f619caadae9ed94facc4ce0c28a8e358f950e8',
        expiresIn:( process.env.JWT_EXPIRES_IN || '7d'),
    },
    
    apis: {
        alphaVantage: process.env.ALPHA_VANTAGE_API_KEY || 'demo',
        coinGecko: process.env.COINGECKO_API_KEY || '',
    },
};
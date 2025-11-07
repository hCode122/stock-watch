import {pool} from "../config/database";

export const initDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                username VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );    
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS portfolios (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                stock_symbol VARCHAR(10) NOT NULL,
                quantity DECIMAL NOT NULL,
                purchase_price DECIMAL NOT NULL,
                purchase_date DATE DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS watchlists (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                stock_symbol VARCHAR(10) NOT NULL,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, stock_symbol)
            );
        `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS top_gainers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        symbol VARCHAR(10) NOT NULL,
        company_name VARCHAR(255),
        price DECIMAL NOT NULL,
        change_amount DECIMAL NOT NULL,
        change_percentage DECIMAL NOT NULL,
        volume BIGINT NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS top_losers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        symbol VARCHAR(10) NOT NULL,
        company_name VARCHAR(255),
        price DECIMAL NOT NULL,
        change_amount DECIMAL NOT NULL,
        change_percentage DECIMAL NOT NULL,
        volume BIGINT NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS cryptocurrencies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        coin_id VARCHAR(50) NOT NULL,
        symbol VARCHAR(10) NOT NULL,
        name VARCHAR(100) NOT NULL,
        current_price DECIMAL NOT NULL,
        price_change_percentage_24h DECIMAL,
        market_cap DECIMAL,
        volume_24h DECIMAL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS market_overview (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        data_type VARCHAR(50) NOT NULL, -- 'global_status', 'sector_performance', 'market_indices'
        data JSONB NOT NULL, -- Store complete API response
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_top_gainers_symbol ON top_gainers(symbol);
      CREATE INDEX IF NOT EXISTS idx_top_losers_symbol ON top_losers(symbol);
      CREATE INDEX IF NOT EXISTS idx_cryptocurrencies_symbol ON cryptocurrencies(symbol);
      CREATE INDEX IF NOT EXISTS idx_market_overview_type ON market_overview(data_type);
    `);

    console.log('✅ All database tables created successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};
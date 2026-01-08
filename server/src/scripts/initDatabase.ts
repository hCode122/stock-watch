import {pool} from "../config/database";

export const initDatabase = async () => {
    try {
          await pool.connect()

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                firstname VARCHAR(100) NOT NULL,
                lastname VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );    
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS portfolios (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                stock_symbol VARCHAR(25) NOT NULL,
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
                stock_symbol VARCHAR(25) NOT NULL,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, stock_symbol)
            );
        `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS top_gainers (
         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ticker VARCHAR(25) NOT NULL,
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
        ticker VARCHAR(25) NOT NULL,
        price DECIMAL NOT NULL,
        change_amount DECIMAL NOT NULL,
        change_percentage DECIMAL NOT NULL,
        volume BIGINT NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS most_traded (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ticker VARCHAR(25) NOT NULL,
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
        symbol VARCHAR(25) NOT NULL,
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
        market_type Varchar(25) NOT NULL,
        region VARCHAR(25) NOT NULL,
        primary_exchanges VARCHAR(100) NOT NULL,
        local_open VARCHAR(25) NOT NULL,
        local_close VARCHAR(25) NOT NULL,
        current_status VARCHAR(25) NOT NULL
      );
    `);

       await pool.query(`
          CREATE TABLE IF NOT EXISTS etfs (
            etf_id SERIAL PRIMARY KEY NOT NULL,
            symbol VARCHAR(25) UNIQUE
          )
        `);

      await pool.query(`
          CREATE TABLE IF NOT EXISTS market_calc (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            calculation VARCHAR(25) NOT NULL,
            value DOUBLE PRECISION NOT NULL,
            etf_id INTEGER REFERENCES etfs(etf_id) ON DELETE CASCADE,

            UNIQUE(etf_id, calculation)
            );
      `);

   

      await pool.query(`
          CREATE TABLE IF NOT EXISTS stock_metadata (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            symbols TEXT[] NOT NULL,
            min_dt DATE,
            max_dt DATE,
            ohlc TEXT,
            interval VARCHAR(25)
          );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS coins (
              coin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              coin_name VARCHAR(50) NOT NULL,
              coin_symbol VARCHAR(50) NOT NULL,
              slug VARCHAR(50) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

              UNIQUE(coin_symbol),
              UNIQUE(slug)
            );
          `);

          await pool.query(`
            CREATE TABLE IF NOT EXISTS coin_price (
              price_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              coin_id UUID NOT NULL REFERENCES coins(coin_id) ON DELETE CASCADE,              
              price DECIMAL(20, 8) NOT NULL,
              volume_24h DECIMAL(20, 2),
              percent_change_24h VARCHAR(55),
              market_cap DECIMAL(30, 2),

              recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
              UNIQUE(coin_id, recorded_at)
             );
          `);

          await pool.query(`
              CREATE TABLE IF NOT EXISTS coin_market_overview (
                market_overview_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                active_cryptocurrencies BIGINT,
                total_market_cap JSONB,
                market_cap_percentage JSONB,
                total_volume JSONB,
                market_cap_change_percentage_24h_usd DECIMAL(20, 8),
                recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
                recorded_date DATE GENERATED ALWAYS AS (recorded_at::DATE) STORED,

                UNIQUE(recorded_date)
              )
            `)


    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_top_gainers_symbol ON top_gainers(ticker);
      CREATE INDEX IF NOT EXISTS idx_top_losers_symbol ON top_losers(ticker);
      CREATE INDEX IF NOT EXISTS idx_cryptocurrencies_symbol ON cryptocurrencies(symbol);
      CREATE INDEX IF NOT EXISTS idx_market_overview_type ON market_overview(market_type);
    `);

    console.log('All database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await pool.end()
  }
};
if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
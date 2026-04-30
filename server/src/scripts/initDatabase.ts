import {pool} from "../config/database";

export const initDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              email VARCHAR(255) UNIQUE NOT NULL,
              username VARCHAR(255) UNIQUE NOT NULL,
              password_hash VARCHAR(255) NOT NULL,
              balance DECIMAL(12,2) NOT NULL DEFAULT 1000.00,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT positive_balance CHECK (balance >= 0)
          );
        `);

        await pool.query(`
          CREATE TABLE IF NOT EXISTS holdings (
              user_id UUID REFERENCES users(id) ON DELETE CASCADE,
              stock_symbol VARCHAR(25) NOT NULL,
              quantity DECIMAL NOT NULL,
              avg_purchase_price DECIMAL NOT NULL,
              last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              PRIMARY KEY (user_id, stock_symbol)
          );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS crypto_holdings (
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            crypto_symbol VARCHAR(25) NOT NULL,
            quantity DECIMAL NOT NULL,
            avg_purchase_price DECIMAL NOT NULL,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, crypto_symbol)
        );
    `);

      await pool.query(`
          CREATE TABLE IF NOT EXISTS transactions (
              transaction_id SERIAL PRIMARY KEY,
              user_id UUID REFERENCES users(id) ON DELETE CASCADE,
              type VARCHAR(4) CHECK (type IN ('BUY', 'SELL')),
              asset_type VARCHAR(10) CHECK (asset_type IN ('STOCK', 'CRYPTO')),
              symbol_name VARCHAR(25) NOT NULL,
              quantity DECIMAL NOT NULL,
              price_per_share DECIMAL NOT NULL,
              total_amount DECIMAL NOT NULL,
              transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS net_worth_history (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          snapshot_date DATE NOT NULL,
          balance DECIMAL(12,2) NOT NULL,
          portfolio_value DECIMAL(12,2) NOT NULL,
          net_worth DECIMAL(12,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, snapshot_date)
        );
      `)

      await pool.query(`
    CREATE TABLE IF NOT EXISTS stock_prices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        symbol VARCHAR(25) NOT NULL,
        name VARCHAR(100),
        current_price DECIMAL(12,4) NOT NULL,
        previous_close DECIMAL(12,4),
        price_change DECIMAL(12,4),
        price_change_percent DECIMAL(8,4),
        volume BIGINT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        date DATE GENERATED ALWAYS AS (last_updated::DATE) STORED,
        UNIQUE(symbol, date)
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
          recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
              date DATE GENERATED ALWAYS AS (recorded_at::DATE) STORED
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
          recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
              date DATE GENERATED ALWAYS AS (recorded_at::DATE) STORED
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
          recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
              date DATE GENERATED ALWAYS AS (recorded_at::DATE) STORED
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
        volume_24h DECIMAL
      
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
        current_status VARCHAR(25) NOT NULL,
          recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
              date DATE GENERATED ALWAYS AS (recorded_at::DATE) STORED
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

            recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            date DATE GENERATED ALWAYS AS (recorded_at::DATE) STORED,
            UNIQUE(etf_id, calculation, date)
            );
      `);

   

      await pool.query(`
          CREATE TABLE IF NOT EXISTS stock_metadata (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            symbols TEXT[] NOT NULL,
            min_dt DATE,
            max_dt DATE,
            ohlc TEXT,
            interval VARCHAR(25),
            recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            date DATE GENERATED ALWAYS AS (recorded_at::DATE) STORED
          );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS coins (
              coin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              coin_name VARCHAR(50) NOT NULL,
              coin_symbol VARCHAR(50) NOT NULL,
              slug VARCHAR(50) NOT NULL,
              recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
              date DATE GENERATED ALWAYS AS (recorded_at::DATE) STORED,

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
              percent_change_24h DECIMAL(20, 2),
              market_cap DECIMAL(30, 2),

              recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
              date DATE GENERATED ALWAYS AS (recorded_at::DATE) STORED,
              UNIQUE(coin_id, date)
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
                date DATE GENERATED ALWAYS AS (recorded_at::DATE) STORED,

                UNIQUE(date)
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
  } 
};
if (process.env.NODE_ENV !== 'production') {
  initDatabase()
    .then(() => console.log('Database initialization complete'))
    .catch((error) => console.error('Database initialization failed:', error));
}
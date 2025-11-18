import { pool } from '../config/database';

export const resetDatabase = async () => {
  try {
    console.log('🧹 Resetting database...');
    
    await pool.query('DROP TABLE IF EXISTS watchlists CASCADE');
    await pool.query('DROP TABLE IF EXISTS portfolios CASCADE');
    await pool.query('DROP TABLE IF EXISTS top_gainers CASCADE');
    await pool.query('DROP TABLE IF EXISTS top_losers CASCADE');
    await pool.query('DROP TABLE IF EXISTS cryptocurrencies CASCADE');
    await pool.query('DROP TABLE IF EXISTS market_overview CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    
    console.log(' All tables dropped');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
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

    console.log('Database reset successfully with new schema!');
    
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  resetDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
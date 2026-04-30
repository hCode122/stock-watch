import { pool } from '../config/database';

export const resetDatabase = async () => {
  try {
    await pool.connect()
    console.log('🧹 Resetting database...');
    
    await pool.query('DROP TABLE IF EXISTS watchlists CASCADE');
    await pool.query('DROP TABLE IF EXISTS portfolios CASCADE');
    await pool.query('DROP TABLE IF EXISTS top_gainers CASCADE');
    await pool.query('DROP TABLE IF EXISTS top_losers CASCADE');
    await pool.query('DROP TABLE IF EXISTS most_traded CASCADE');
    await pool.query('DROP TABLE IF EXISTS cryptocurrencies CASCADE');
    await pool.query('DROP TABLE IF EXISTS market_overview CASCADE');
    await pool.query('DROP TABLE IF EXISTS etfs CASCADE');
    await pool.query('DROP TABLE IF EXISTS market_calc CASCADE');
    await pool.query('DROP TABLE IF EXISTS stock_metadata CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    await pool.query('DROP TABLE IF EXISTS coins CASCADE');
    await pool.query('DROP TABLE IF EXISTS coin_price CASCADE');
    await pool.query('DROP TABLE IF EXISTS coin_market_overview CASCADE');
    await pool.query('DROP TABLE IF EXISTS transactions CASCADE');
    await pool.query('DROP TABLE IF EXISTS holdings CASCADE');

    console.log('Database tables dropped successfully');
    
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
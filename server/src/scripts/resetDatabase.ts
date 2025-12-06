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
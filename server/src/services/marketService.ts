import { pool } from "../config/database";

export const getTopStockData = async () => {
    try {
        const gainer = await pool.query(`
            SELECT  id,
            ticker,
            price,
            change_amount,
            change_percentage,
            volume,
            date::TEXT as date 
            FROM top_gainers 
            WHERE date = (SELECT MAX(date) FROM top_gainers)
            ORDER BY change_percentage DESC
        `);

        const loser = await pool.query(`
            SELECT  id,
            ticker,
            price,
            change_amount,
            change_percentage,
            volume,
            date::TEXT as date
            FROM top_losers
            WHERE date = (SELECT MAX(date) FROM top_losers)
            ORDER BY change_percentage ASC
        `)

        const traded = await pool.query(`
            SELECT  id,
            ticker,
            price,
            change_amount,
            change_percentage,
            volume,
            date::TEXT as date
            FROM most_traded
            WHERE date = (SELECT MAX(date) FROM top_losers)
            ORDER BY change_percentage ASC
        `)
        return [gainer.rows, loser.rows, traded.rows]
    } catch (error) {
        console.log(error)
    }
}

export const getStockMarketData = async () => {
    try {
        const data = await pool.query(`
            SELECT id,
            market_type,
            region,
            primary_exchanges,
            local_open,
            local_close,
            current_status,
            date::TEXT
            FROM market_overview
            WHERE date = (SELECT MAX(date) from market_overview)
        `)
        return data.rows;
    } catch (error) {
        console.log(error)
    }
}

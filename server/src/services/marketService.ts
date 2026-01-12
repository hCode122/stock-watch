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
        throw error
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
        throw error
    }
}

export const getStockCalculations = async () => {
    try {
        const data = await pool.query(`
                SELECT e.etf_id, symbol, calculation, value, date::TEXT FROM market_calc c
                INNER JOIN etfs e on e.etf_id = c.etf_id WHERE
                date = (SELECT max(date) FROM market_calc)
                ORDER BY symbol asc
            `)
        return data.rows
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getLatestCoins = async () => {
    try {
        const data = await pool.query(`
                SELECT c.coin_id, coin_name, coin_symbol, slug, c.date,
                price, volume_24h, percent_change_24h, market_cap
                FROM coins c inner join coin_price p
                on c.coin_id = p.coin_id
                WHERE p.date = (SELECT max(date) FROM coin_price)
                ORDER BY p.market_cap DESC;
            `)
        return data.rows
    } catch (error) {
        console.log(error)
        throw error
    }
}
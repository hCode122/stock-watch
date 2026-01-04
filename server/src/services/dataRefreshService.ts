import { coin_resp, topCoinData, market_overview_response, top_changed_response, index_calc_response, index_calc } from "@/types/marketTypes";
import { alphaVintageInstance } from "../axios/alphaVintageInstance";
import nodeCron from "node-cron";
import { pool } from "../config/database";
import { envConfig } from "../config/environment";
import { coinMarketInstance } from "../axios/coinMarketInstance";

const updateTopChanges = async () => {
    try {
        const response = await alphaVintageInstance.get('/query?function=TOP_GAINERS_LOSERS')
        const {last_updated, top_gainers, top_losers, most_actively_traded} : top_changed_response = response.data 

        pool.connect()

         for (const stock of top_gainers) {
            await pool.query(`INSERT INTO top_gainers 
            (ticker, price, change_amount, change_percentage, volume, last_updated) VALUES
            ($1, $2, $3, $4, $5, $6)`, [stock.ticker, stock.price, stock.change_amount, stock.change_percentage.slice(0, -2), stock.volume, last_updated])
        }
        
        for (const stock of top_losers) {
            await pool.query(`INSERT INTO top_losers 
            (ticker, price, change_amount, change_percentage, volume, last_updated) VALUES
            ($1, $2, $3, $4, $5, $6)`, [stock.ticker, stock.price, stock.change_amount, stock.change_percentage.slice(0, -2), stock.volume, last_updated])
        }
          
        for (const stock of most_actively_traded) {
            await pool.query(`INSERT INTO most_traded 
            (ticker, price, change_amount, change_percentage, volume, last_updated) VALUES
            ($1, $2, $3, $4, $5, $6)`, [stock.ticker, stock.price, stock.change_amount, stock.change_percentage.slice(0, -2), stock.volume, last_updated])
        }
        

        console.log(`top_changes updated at ${new Date().toLocaleString()}`);
    } catch (error) {
        throw error;
    }
    
    
}

const updateMatketOverview = async () => {
    try {
        const response = await alphaVintageInstance.get(`query?function=MARKET_STATUS`)
        const {markets: market_overview} : market_overview_response =  response.data

        pool.connect()

        for (const market of market_overview) {
            console.log(market)
            await pool.query(`INSERT INTO market_overview (
                market_type, region, primary_exchanges, local_open,
                local_close, current_status
                ) VALUES ($1, $2, $3, $4, $5, $6)
            `,[market.market_type, market.region, market.primary_exchanges,
                market.local_open, market.local_close, market.current_status
            ])
        }

        console.log(`market_overview updated at ${new Date().toLocaleString()}`);

    } catch (error) {
        throw error
    }
}

const updateCalculations = async () => {
        console.log('Request recieved')

    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

            const axios_response = await alphaVintageInstance.get('/query?function=ANALYTICS_FIXED_WINDOW&SYMBOLS=SPY,QQQ,DIA,IWM&RANGE=30day&INTERVAL=DAILY&OHLC=close&CALCULATIONS=MEAN,STDDEV,CUMULATIVE_RETURN&apikey=9U8WIUR6VJO24GIR')
            
            
        const response: index_calc_response = axios_response.data
        const { symbols, min_dt, max_dt, ohlc, interval } = response.meta_data;
        await pool.query(`
            INSERT INTO stock_metadata (symbols, min_dt, max_dt, ohlc, interval)
            VALUES ($1, $2, $3, $4, $5)
        `, [Array(symbols), min_dt, max_dt, ohlc, interval])
        const symbols_arr = response.meta_data.symbols.split(',');
   
        const results = await pool.query(`
            INSERT INTO public.etfs (symbol)
            SELECT UNNEST($1::VARCHAR(25)[])
            ON CONFLICT (symbol) DO NOTHING
            RETURNING etf_id, symbol;
        `, [symbols_arr])

        let etfs: Map<string, number>;

        if (results.rows.length > 0) {
            etfs = new Map(
                results.rows.map(etf => [etf.symbol, etf.etf_id])
            );
            console.log(`Inserted ${results.rows.length} new ETFs`);
        } else {

            const existingResults = await pool.query(`
                SELECT etf_id, symbol FROM etfs 
                WHERE symbol = ANY($1::VARCHAR(25)[])
            `, [symbols_arr]);
            
            etfs = new Map(
                existingResults.rows.map(etf => [etf.symbol, etf.etf_id])
            );
            console.log(`Fetched ${existingResults.rows.length} existing ETFs`);
        }

        const calculation_names = Object.keys(response.payload.RETURNS_CALCULATIONS) as Array<keyof index_calc>;
        const calculationObj = response.payload.RETURNS_CALCULATIONS


        for (const calcType of calculation_names) {
            const calculationData = calculationObj[calcType];
            
                for (const [symbol, value] of Object.entries(calculationData)) {
                    const etfId = etfs.get(symbol);
                    if (etfId && value !== undefined) {
                                            console.log('a')

                        await pool.query(`
                            INSERT INTO market_calc (calculation, value, etf_id)
                            VALUES ($1, $2, $3)
                            ON CONFLICT (etf_id, calculation) 
                            DO UPDATE SET value = EXCLUDED.value
                        `, [calcType, value, etfId]);
                    }
                }   
            }

            await client.query('COMMIT'); 
            console.log('Successfully updated calculations');

        } catch (error) {
             await client.query('ROLLBACK'); 
            console.error('Failed to update calculations:', error);
            throw error;
        }
}

const updateTopChangesCoins = async () => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const response = await coinMarketInstance.get('listings/latest?start=1&limit=30')
        const response_data: topCoinData = response?.data
        let results = [];
        for (const coin of response_data.data) {
            const res = await pool.query(`
                    INSERT INTO coins (coin_name, coin_symbol, slug)
                    VALUES ($1, $2, $3) 
                    ON CONFLICT (coin_symbol) DO NOTHING
                    RETURNING coin_id, coin_symbol
                `, [coin.name, coin.symbol, coin.slug])
            results.push(...res.rows);

        }
        let coins: Map<string, number>;

        if (results && results.length > 0) {
            coins = new Map(
                results.map(coin => [coin.coin_symbol, coin.coin_id])
            );

        } else {
            let existingResults = [];
            for (const coin of response_data.data) {
                const res = await pool.query(`
                    SELECT coin_id, coin_symbol FROM coins 
                    WHERE coin_symbol = $1
                `, [coin.symbol]);
                 existingResults.push(...res.rows);
            }

            coins = new Map(
                existingResults?.map(coin => [coin.coin_symbol, coin.coin_id])
            );
        }

            for (const price of response_data.data) {
                const data_in_usd = price.quote.USD
                console.log(price.symbol)
                console.log(coins.get(price.symbol))
                const calc_results = await pool.query(`
                        INSERT INTO coin_price (coin_id, price, volume_24h, percent_change_24h, market_cap)
                        VALUES ($1, $2, $3, $4, $5)
                        ON CONFLICT (coin_id, recorded_at)  
                        DO UPDATE SET 
                            price = EXCLUDED.price,
                            volume_24h = EXCLUDED.volume_24h,
                            percent_change_24h = EXCLUDED.percent_change_24h,
                            market_cap = EXCLUDED.market_cap
                    `, [coins.get(price.symbol), data_in_usd.price, data_in_usd.volume_24h, data_in_usd.percent_change_24h, data_in_usd.market_cap])
            }
            await client.query('COMMIT'); 

            console.log("Coin Data Updated successfully!")
        
    } catch (error) {
        console.log(error)
    }
}

export default updateTopChangesCoins
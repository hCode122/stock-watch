import { market_overview, market_overview_response, top_changed_response, index_calc_response, index_calc } from "@/types/marketTypes";
import { alphaVintageInstance } from "../axios/alphaVintageInstance";
import nodeCron from "node-cron";
import { pool } from "../config/database";
import { envConfig } from "../config/environment";

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

export default updateCalculations
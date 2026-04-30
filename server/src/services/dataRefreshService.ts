import { coin_resp, top_coin_data, market_overview_response, top_changed_response, index_calc_response, index_calc, coin_overview } from "../types/marketTypes";
import { alphaVintageInstance } from "../axios/alphaVintageInstance";
import { pool } from "../config/database";
import { coinMarketInstance } from "../axios/coinMarketInstance";
import { coinGeckoInstance } from "../axios/coinGeckoInstance";

const updateTopChanges = async () => {
    const client = await pool.connect()

    try {
        console.log('Updating top gainer and loser stocks...')
        const response = await alphaVintageInstance.get('/query?function=TOP_GAINERS_LOSERS')
        const {last_updated, top_gainers, top_losers, most_actively_traded} : top_changed_response = response.data 


         for (const stock of top_gainers) {
            await client.query(`INSERT INTO top_gainers 
            (ticker, price, change_amount, change_percentage, volume) VALUES
            ($1, $2, $3, $4, $5)`, [stock.ticker, stock.price, stock.change_amount, stock.change_percentage.slice(0, -2), stock.volume])
        }
        
        for (const stock of top_losers) {
            await client.query(`INSERT INTO top_losers 
            (ticker, price, change_amount, change_percentage, volume) VALUES
            ($1, $2, $3, $4, $5)`, [stock.ticker, stock.price, stock.change_amount, stock.change_percentage.slice(0, -2), stock.volume])
        }
          
        for (const stock of most_actively_traded) {
            await client.query(`INSERT INTO most_traded 
            (ticker, price, change_amount, change_percentage, volume) VALUES
            ($1, $2, $3, $4, $5)`, [stock.ticker, stock.price, stock.change_amount, stock.change_percentage.slice(0, -2), stock.volume])
        }
        
        client.query('COMMIT')
        console.log(`top_changes updated at ${new Date().toLocaleString()}`);
    } catch (error) {
        client.query('ROLLBACK')
        throw error;
    }
    finally {
        client.release(); 
    }
}

const updateMarketOverview = async () => {
    console.log('Updating stock market...')
    const client = await pool.connect()
    try {
        const response = await alphaVintageInstance.get(`/query?function=MARKET_STATUS`)
        const {markets: market_overview} : market_overview_response =  response.data


        for (const market of market_overview) {
            await client.query(`INSERT INTO market_overview (
                market_type, region, primary_exchanges, local_open,
                local_close, current_status
                ) VALUES ($1, $2, $3, $4, $5, $6)
            `,[market.market_type, market.region, market.primary_exchanges,
                market.local_open, market.local_close, market.current_status
            ])
        }
        client.query('COMMIT')

        console.log(`market_overview updated at ${new Date().toLocaleString()}`);

    } catch (error) {
        client.query("ROLLBACK")
        throw error
    }
     finally {
        client.release(); 
    }
    
}

const updateCalculations = async () => {
    console.log('Updating stock calculations...')

    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

            const axios_response = await alphaVintageInstance.get('/query?function=ANALYTICS_FIXED_WINDOW&SYMBOLS=SPY,QQQ,DIA,IWM&RANGE=30day&INTERVAL=DAILY&OHLC=close&CALCULATIONS=MEAN,STDDEV,CUMULATIVE_RETURN&apikey=9U8WIUR6VJO24GIR')
            
            
        const response: index_calc_response = axios_response.data
        const { symbols, min_dt, max_dt, ohlc, interval } = response.meta_data;
        await client.query(`
            INSERT INTO stock_metadata (symbols, min_dt, max_dt, ohlc, interval)
            VALUES ($1, $2, $3, $4, $5)
        `, [Array(symbols), min_dt, max_dt, ohlc, interval])
        const symbols_arr = response.meta_data.symbols.split(',');
   
        const results = await client.query(`
            INSERT INTO public.etfs (symbol)
            SELECT UNNEST($1::VARCHAR(25)[])
            ON CONFLICT (symbol) DO NOTHING
            RETURNING etf_id, symbol;
        `, [symbols_arr])

        let etfs: Map<string, number>;

      

            const existingResults = await client.query(`
                SELECT etf_id, symbol FROM etfs 
                WHERE symbol = ANY($1::VARCHAR(25)[])
            `, [symbols_arr]);
            
            etfs = new Map(
                existingResults.rows.map((etf: any) => [etf.symbol, etf.etf_id])
            );
        

        const calculation_names = Object.keys(response.payload.RETURNS_CALCULATIONS) as Array<keyof index_calc>;
        const calculationObj = response.payload.RETURNS_CALCULATIONS


        for (const calcType of calculation_names) {
            const calculationData = calculationObj[calcType];
            
                for (const [symbol, value] of Object.entries(calculationData)) {
                    const etfId = etfs.get(symbol);
                    if (etfId && value !== undefined) {
                                           

                        await client.query(`
                            INSERT INTO market_calc (calculation, value, etf_id)
                            VALUES ($1, $2, $3)
                            ON CONFLICT (etf_id, calculation, date) 
                            DO UPDATE SET value = EXCLUDED.value,
                            recorded_at = EXCLUDED.recorded_at
                        `, [calcType, value, etfId]);
                    }
                }   
            }

            await client.query('COMMIT'); 
            console.log(`Successfully updated calculations at ${new Date().toLocaleString()}`);

        } catch (error) {
             await client.query('ROLLBACK'); 
            console.error('====================== Failed to update calculations: ======================', error);
            throw error;
        }
         finally {
        client.release(); 
        }
    
}

const updateTopChangesCoins = async () => {
    console.log("Updating latest coins")
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const response = await coinMarketInstance.get('v1/cryptocurrency/listings/latest?start=1&limit=30')
        const response_data: top_coin_data = response?.data
        
        for (const coin of response_data.data) {
            await client.query(`
                INSERT INTO coins (coin_name, coin_symbol, slug)
                VALUES ($1, $2, $3) 
                ON CONFLICT (coin_symbol) DO UPDATE SET
                    coin_name = EXCLUDED.coin_name,
                    slug = EXCLUDED.slug
            `, [coin.name, coin.symbol, coin.slug])
        }

        const symbols = response_data.data.map(c => c.symbol);
        const coinResults = await client.query(`
            SELECT coin_id, coin_symbol FROM coins 
            WHERE coin_symbol = ANY($1::text[])
        `, [symbols]);
        
        const coins = new Map(
            coinResults.rows.map(coin => [coin.coin_symbol, coin.coin_id])
        );
        
        for (const price of response_data.data) {
            const data_in_usd = price.quote.USD
            const coinId = coins.get(price.symbol);
            
            if (!coinId) {
                console.error(`❌ MISSING: ${price.symbol} not found in coins table!`);
                continue;
            }
            
            const cleanPrice = Number(data_in_usd.price);
            const cleanVolume = Number(data_in_usd.volume_24h);
            const cleanPercent = Number(data_in_usd.percent_change_24h);
            const cleanMarketCap = Number(data_in_usd.market_cap);
            
            console.log(`Inserting ${price.symbol}: price=${cleanPrice}, volume=${cleanVolume}`);
            
            await client.query(`
                INSERT INTO coin_price (coin_id, price, volume_24h, percent_change_24h, market_cap)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (coin_id, date)  
                DO UPDATE SET 
                    price = EXCLUDED.price,
                    volume_24h = EXCLUDED.volume_24h,
                    percent_change_24h = EXCLUDED.percent_change_24h,
                    market_cap = EXCLUDED.market_cap
            `, [
                coinId,
                cleanPrice,
                cleanVolume,
                cleanPercent,
                cleanMarketCap
            ]);
        }
        
        await client.query('COMMIT'); 
        console.log(`Coin Data Updated successfully at ${new Date().toLocaleString()}`)
        
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('====================== Failed to update latest coins: ======================', error);
        throw error;
    } finally {
        client.release(); 
    }
}

const updateStockPricesTable = async () => {
    const client = await pool.connect();
    
    try {
        console.log('📊 Updating stock_prices table...');
        await client.query('BEGIN');
        
        const response = await alphaVintageInstance.get('/query?function=TOP_GAINERS_LOSERS');
        const { top_gainers, top_losers, most_actively_traded } = response.data;
        
        const allStocks = new Map();
        
        for (const stock of top_gainers) {
            allStocks.set(stock.ticker, {
                symbol: stock.ticker,
                current_price: parseFloat(stock.price),
                previous_close: parseFloat(stock.price) - parseFloat(stock.change_amount),
                price_change: parseFloat(stock.change_amount),
                price_change_percent: parseFloat(stock.change_percentage),
                volume: stock.volume
            });
        }
        
        for (const stock of top_losers) {
            allStocks.set(stock.ticker, {
                symbol: stock.ticker,
                current_price: parseFloat(stock.price),
                previous_close: parseFloat(stock.price) - parseFloat(stock.change_amount),
                price_change: parseFloat(stock.change_amount),
                price_change_percent: parseFloat(stock.change_percentage),
                volume: stock.volume
            });
        }
        
        for (const stock of most_actively_traded) {
            allStocks.set(stock.ticker, {
                symbol: stock.ticker,
                current_price: parseFloat(stock.price),
                previous_close: parseFloat(stock.price) - parseFloat(stock.change_amount),
                price_change: parseFloat(stock.change_amount),
                price_change_percent: parseFloat(stock.change_percentage),
                volume: stock.volume
            });
        }
        
        for (const [symbol, data] of allStocks) {
            await client.query(`
                INSERT INTO stock_prices (
                    symbol, 
                    current_price, 
                    previous_close, 
                    price_change, 
                    price_change_percent, 
                    volume,
                    last_updated
                )
                VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
                ON CONFLICT (symbol, date) 
                DO UPDATE SET
                    current_price = EXCLUDED.current_price,
                    previous_close = EXCLUDED.previous_close,
                    price_change = EXCLUDED.price_change,
                    price_change_percent = EXCLUDED.price_change_percent,
                    volume = EXCLUDED.volume,
                    last_updated = CURRENT_TIMESTAMP
            `, [
                symbol,
                data.current_price,
                data.previous_close,
                data.price_change,
                data.price_change_percent,
                data.volume
            ]);
        }
        
        await client.query('COMMIT');
        console.log(`Stock prices updated: ${allStocks.size} stocks`);
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating stock_prices:', error);
        throw error;
    } finally {
        client.release();
    }
};

const updateCoinMarketOverview = async () => {
    console.log('Updating coin market overview')
    const client = await pool.connect()
    
    try {
        const results = await coinGeckoInstance.get('/v3/global')
        const result_data: coin_overview = results.data.data
        await client.query(`
            INSERT INTO coin_market_overview (active_cryptocurrencies, total_market_cap,
            market_cap_percentage, total_volume, market_cap_change_percentage_24h_usd)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (date) 
            DO UPDATE SET
                active_cryptocurrencies = EXCLUDED.active_cryptocurrencies,
                total_market_cap = EXCLUDED.total_market_cap,
                market_cap_percentage = EXCLUDED.market_cap_percentage,
                total_volume = EXCLUDED.total_volume,
                market_cap_change_percentage_24h_usd = EXCLUDED.market_cap_change_percentage_24h_usd,
                recorded_at = EXCLUDED.recorded_at
        `, [result_data.active_cryptocurrencies, result_data.total_market_cap, result_data.market_cap_percentage
            , result_data.total_volume, result_data.market_cap_change_percentage_24h_usd
        ])

        await client.query('COMMIT')
        console.log(`Coin market overview data updated at ${new Date().toLocaleString()}`)
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('====================== Failed to update coin market overview: ======================', error);
        throw error;
    }
     finally {
        client.release(); 
    }
    
} 




export {
  updateCalculations,
  updateCoinMarketOverview,
  updateMarketOverview,
  updateTopChanges,    
  updateTopChangesCoins,
  updateStockPricesTable
};

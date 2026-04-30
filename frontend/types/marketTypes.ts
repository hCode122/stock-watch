export interface TopStockItem {
    id: string,
    ticker: string,
    price: number,
    change_amount: number,
    change_percentage: number,
    volume: number,
    date: string,
}

export interface TopStockData {
    topGainers: TopStockItem[],
    topLosers: TopStockItem[],
    mostTraded: TopStockItem[],
}

export interface StockMarketOV {
    id: string,
    market_type: string,
    region: string,
    primary_exchanges: string,
    local_open: string,
    local_close: string,
    current_status: string
}

export interface StockMarketCalcs {
    etf_id: string,
    symbol: string,
    calculation: string,
    value: number,
    date: string
}

export interface StockChartData {
    symbol: string,
    daily_data: Array<{
        date: string,
        price: number        
    }> | null
}

export interface LatestCoin {
    coin_id: string,
    coin_name: string,
    coin_symbol: string,
    slug: string,
    date: string,
    price: number,
    volume_24h: number,
    percent_change_24h: number,
    market_cap: number
}

export interface CoinMarketData {
    market_overview_id: string,
    active_cryptocurrencies: number,
    total_market_cap: number,
    market_cap_percentage: {[key: string] : number} ,
    total_volume: number,
    market_cap_change_percentage_24h_usd: number ,
    percArr: Array<{coin: string, change24h: number}>
}
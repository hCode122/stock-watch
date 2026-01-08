
export interface top_changed {
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string
}

export interface top_changed_response {
    last_updated: string;
    top_gainers: top_changed[];
    top_losers: top_changed[];
    most_actively_traded: top_changed[]
}

export interface market_overview {
    market_type: string;
    region: string;
    primary_exchanges: string;
    local_open: string;
    local_close: string;
    current_status: string;
}

export interface market_overview_response {
    markets: market_overview[] 
}

export interface index_calc_response {
    meta_data: {
        meta_id: string;
        symbols: string;
        min_dt: string;
        max_dt: string;
        ohlc: string;
        interval: string
    };

    payload: {
        RETURNS_CALCULATIONS: index_calc
    }
}

export type symbol_obj = {
    SPY: number;
    QQQ: number;
    IWM: number;
    DIA: number
}

export interface index_calc {
    MEAN: symbol_obj;
    STDDEV: symbol_obj;
    CUMULATIVE_RETURN: symbol_obj;

}

export interface top_coin_data {
    data: coin_resp[]
}

export interface coin_resp {
    coin_id: string;
    name: string;
    symbol: string;
    slug: string;
    quote: {
        USD: {
        price: number;
        volume_24h: number;
        percent_change_24h: number;
        market_cap: number;
        };
    };
}

export interface coin_overview {
    active_cryptocurrencies: number;
    total_market_cap: Record<string, number>,
    market_cap_percentage: Record<string, number>,
    total_volume: Record<string, number>,
    market_cap_change_percentage_24h_usd: number,
}
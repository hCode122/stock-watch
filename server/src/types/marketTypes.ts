
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
    primary_exchange: string;
    local_open: string;
    local_close: string;
    current_status: string;
}

export interface market_overview_response {
    markets: market_overview[] 
}
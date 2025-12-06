
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
    most_active: top_changed
}
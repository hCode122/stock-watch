export interface Holding {
    symbol: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    currentValue: number;
    type: 'STOCK' | 'CRYPTO';
}

export interface Portfolio {
    totalValue: number;
    holdings: Holding[];
}

export interface PortfolioResponse {
    data: Portfolio;
}

export interface NetWorthData {
    date: string;
    balance: string;
    portfolio_value: string;
    net_worth: string;
}

export interface NetWorthResponse {
    data: NetWorthData[];
}
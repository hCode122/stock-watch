import { getStockMarketData, getTopStockData } from "../services/marketService";
import { Request, Response } from 'express';

export const getTopStocks = async (req: Request, res: Response) => {
    try {
        const data = await getTopStockData()
        res.json({
            success: true,
            data: data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch top stocks',
            message: error
        });
    }
}


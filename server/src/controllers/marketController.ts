import { getCoinMarketData, getLatestCoins, getStockCalculations, getStockMarketData, getTopStockData } from "../services/marketService";
import { Request, Response } from 'express';
import { Purchase } from '../services/transactionService';
import { getErrorMessage } from "../utils/getErrorMessage";
import { AuthRequest } from "../middleware/auth";

export const getTopStocks = async (req: Request, res: Response) => {
    try {
        const {topGainers, topLosers, mostTraded} = await getTopStockData()

        res.json({
            success: true,
            data:{topGainers, topLosers, mostTraded}

        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch top stocks',
        });
    }
}

export const getStockMarketOV = async (req: Request ,res: Response) => {
    try {
        const data = await getStockMarketData()
        res.status(200).json({
            success: true,
            data: data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch market overview',
        })
    }
}

export const getStockCalcData = async (req: Request ,res: Response) => {
    try {
        const data = await getStockCalculations()
        res.status(200).json({
            success: true,
            data: data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stock calculations',
        })
    }
}

export const getLatestCoinsData = async (req: Request ,res: Response) => {
    try {
        const data = await getLatestCoins()
        res.status(200).json({
            success: true,
            data: data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch cryptocurrencies',
        })
    }
}

export const getCoinMarketOVData = async (req: Request, res: Response) => {
    try {
        const data = await getCoinMarketData()
        res.status(200).json({
            success: true,
            data: data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch crypto market data',
        })
    }
}


export const TradeHandler = async (req: AuthRequest, res: Response) => {
     try {
        const { transactionType, assetType, symbol, quantity, price } = req.body;
        const userId = req.user?.userId;

        if (!transactionType || !assetType || !symbol || !quantity || !price) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }
        
        if (!['BUY', 'SELL'].includes(transactionType)) {
            return res.status(400).json({ 
                success: false, 
                message: 'transactionType must be BUY or SELL' 
            });
        }
        
        if (!['STOCK', 'CRYPTO'].includes(assetType)) {
            return res.status(400).json({ 
                success: false, 
                message: 'assetType must be STOCK or CRYPTO' 
            });
        }
        
        if (quantity <= 0 || price <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Quantity and price must be positive' 
            });
        }

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not authenticated' 
            });
        }
        
        const result = await Purchase({
            transactionType,
            assetType,
            symbol: symbol.toUpperCase(),
            quantity: Number(quantity),
            price: Number(price),
            userId: userId 
        });
        
        res.json(result);
        
    } catch (error) {
        console.error('Trade error:', error);
        res.status(500).json({ 
            success: false, 
            message: error instanceof Error ? error.message : 'Trade failed' 
        });
    }
};
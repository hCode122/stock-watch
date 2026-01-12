import { getCoinMarketData, getLatestCoins, getStockCalculations, getStockMarketData, getTopStockData } from "../services/marketService";
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
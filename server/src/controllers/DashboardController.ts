import { AuthRequest } from "@/middleware/auth";
import { getNetworthHistory, getTransactions, getUserPortfolio, Purchase } from "../services/transactionService"
import { Request, Response } from "express"

export const getPortfolioHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing userId' });
        }

        const portfolioData = await getUserPortfolio(userId);

        return res.json({
                sucess: true,
                data: portfolioData
            }
        )
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user portfolio',
        });
    }
}

export const getUserNetworthHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing userId' });
        }
        
        const networthData = await getNetworthHistory(userId)

        return res.json({
                sucess: true,
                data: networthData
            }
        )
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user networth',
        });
    }
}

export const getTransactionsController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;
        const type = req.query.type as 'BUY' | 'SELL' | undefined;
        const assetType = req.query.assetType as 'STOCK' | 'CRYPTO' | undefined;
        
        if (!userId) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }
        
        const result = await getTransactions({
            userId,
            limit,
            offset,
            type,
            assetType
        });
        
        res.json({
            success: true,
            data: result.transactions,
            pagination: {
                limit,
                offset,
                total: result.total,
                hasMore: offset + limit < result.total
            }
        });
        
    } catch (error) {
        console.error('Error in getTransactionsController:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch transactions' });
    }
};

export const sellAsset = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { assetType, symbol, quantity, price } = req.body;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        
        if (!symbol || !quantity || !price) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        
        if (quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Quantity must be greater than 0' });
        }
        
        const result = await Purchase({
            transactionType: 'SELL',
            assetType: assetType,
            symbol: symbol,
            quantity: quantity,
            price: price,
            userId: userId
        });
        
        res.json({ success: true, data: result });
        
    } catch (error: any) {
        console.error('Sell error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to process sale' });
    }
};
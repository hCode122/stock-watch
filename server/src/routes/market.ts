import { Router } from "express";
import { getTopStocks, getStockMarketOV, getStockCalcData, getLatestCoinsData, getCoinMarketOVData, TradeHandler } from "../controllers/marketController";
import { authenticateToken } from "../middleware/auth";

const router = Router();
router.use('/stockChange', getTopStocks);
router.use('/marketStock', getStockMarketOV);
router.use('/stockCalc', getStockCalcData);
router.use('/coinsLatest', getLatestCoinsData);
router.use('/marketCoins', getCoinMarketOVData);
router.use('/trade',authenticateToken,  TradeHandler)
export default router;
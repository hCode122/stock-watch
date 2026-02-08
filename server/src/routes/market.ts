import { Router } from "express";
import { getTopStocks, getStockMarketOV, getStockCalcData, getLatestCoinsData, getCoinMarketOVData } from "../controllers/marketController";

const router = Router();
router.use('/stockChange', getTopStocks);
router.use('/marketStock', getStockMarketOV);
router.use('/stockCalc', getStockCalcData);
router.use('/coinsLatest', getLatestCoinsData);
router.use('/marketCoins', getCoinMarketOVData);

export default router;
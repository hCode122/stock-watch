import { Router } from "express";
import { getStockMarketOV, getStockCalcData, getLatestCoinsData, getCoinMarketOVData } from "../controllers/marketController";

const router = Router();
router.use('/marketStock', getStockMarketOV);
router.use('/stockCalc', getStockCalcData);
router.use('/coinsLatest', getLatestCoinsData);
router.use('/marketCoins', getCoinMarketOVData);

export default router;
import { Router } from "express";
import { getStockMarketOV, getStockCalcData, getLatestCoinsData } from "../controllers/marketController";

const router = Router();
router.use('/marketStock', getStockMarketOV);
router.use('/stockCalc', getStockCalcData);

export default router;
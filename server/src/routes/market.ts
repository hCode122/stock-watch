import { Router } from "express";
import { getStockMarketOV } from "../controllers/marketController";

const router = Router();
router.use('/marketStock', getStockMarketOV);
export default router;
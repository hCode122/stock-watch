import { Router } from "express";
import { getUserNetworthHandler, getPortfolioHandler, getTransactionsController, sellAsset } from "../controllers/DashboardController";
import { authenticateToken } from "../middleware/auth";
import { getTransactions } from "../services/transactionService";

const router = Router()
router.use('/portfolio', authenticateToken ,getPortfolioHandler)
router.use('/networth', authenticateToken, getUserNetworthHandler)
router.use('/transactions', authenticateToken, getTransactionsController)
router.post('/sell', authenticateToken, sellAsset);
export default router
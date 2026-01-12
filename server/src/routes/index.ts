import { Router } from 'express';
import authRoutes from './auth';
import marketRoutes from "./market"
import { getTopStocks } from '../controllers/marketController';

const router = Router();
router.use('/auth', authRoutes);
router.use('/market', marketRoutes)
export default router;
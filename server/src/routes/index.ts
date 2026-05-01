import { Router } from 'express';
import authRoutes from './auth';
import marketRoutes from "./market"
import dashboardRouter from "./dashboard"
import cronRouter from "./cron"

const router = Router();
router.use('/auth', authRoutes);
router.use('/market', marketRoutes)
router.use('/dashboard', dashboardRouter)
router.use('/cron', cronRouter)
export default router;
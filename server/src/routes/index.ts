import { Router } from 'express';
import authRoutes from './auth';
import marketRoutes from "./market"
import dashboardRouter from "./dashboard"

const router = Router();
router.use('/auth', authRoutes);
router.use('/market', marketRoutes)
router.use('/dashboard', dashboardRouter)
export default router;
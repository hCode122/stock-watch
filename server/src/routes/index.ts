import { Router } from 'express';
import authRoutes from './auth';

import updateTopChanges from '../services/dataRefreshService';

const router = Router();
router.use('/auth', authRoutes);
router.use('/test', updateTopChanges)
export default router;
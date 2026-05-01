import express from 'express';
import { runAllJobs } from '../jobs/scheduler';

const router = express.Router();

router.get('/trigger', async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    
    if (apiKey !== process.env.CRON_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    runAllJobs().catch(console.error);
    
    res.json({ 
        success: true, 
        message: 'Jobs started. Check logs for progress.',
        timestamp: new Date().toISOString()
    });
});

router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
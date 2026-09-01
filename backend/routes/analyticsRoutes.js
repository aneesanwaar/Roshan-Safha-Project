import express from 'express';
import { getTrendAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

// GET /api/analytics/trends
router.get('/trends', getTrendAnalytics);

export default router;
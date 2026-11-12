import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', getDashboardStats);

export default router;
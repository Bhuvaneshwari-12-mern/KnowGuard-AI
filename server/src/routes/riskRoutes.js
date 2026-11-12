import express from 'express';
import { getProjectRisks } from '../controllers/riskController.js';

const router = express.Router();

router.get('/', getProjectRisks);

export default router;

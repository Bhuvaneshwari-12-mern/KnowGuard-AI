import express from 'express';
import { getTransfers, createTransfer, updateTransferStatus } from '../controllers/transferController.js';

const router = express.Router();

router.route('/')
  .get(getTransfers)
  .post(createTransfer);

router.patch('/:id', updateTransferStatus);

export default router;
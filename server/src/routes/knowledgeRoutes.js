import express from 'express';
import { getKnowledge, createKnowledge, uploadDocument, deleteKnowledge } from '../controllers/knowledgeController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getKnowledge)
  .post(createKnowledge);

router.post('/upload', upload.single('document'), uploadDocument);

// New delete route
router.delete('/:id', deleteKnowledge);

export default router;
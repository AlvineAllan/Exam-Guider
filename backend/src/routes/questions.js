// backend/src/routes/questions.js
import express from 'express';
import {
  generateQuestions,
  getQuestionSets,
  getQuestionSet,
} from '../controllers/questionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/generate/\:materialId', generateQuestions);
router.get('/sets', getQuestionSets);
router.get('/sets/\:id', getQuestionSet);

export default router;
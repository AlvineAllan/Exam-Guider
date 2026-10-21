import express from 'express';
import {
  getMaterials,
  createMaterial,
  getMaterial,
  deleteMaterial,
} from '../controllers/materialController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getMaterials);
router.post('/', createMaterial);
router.get('/:id', getMaterial);
router.delete('/:id', deleteMaterial);

export default router;
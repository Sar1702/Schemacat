import express from 'express';
import * as chatHistoryController from '../controllers/chatHistory.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get chat history
router.get('/', chatHistoryController.getHistory);

// Clear chat history
router.delete('/', chatHistoryController.clearHistory);

export default router;

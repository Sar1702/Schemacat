import express from 'express';
import { chat } from '../controllers/chat.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { chatSchema } from '../validations/chat.validation.js';
import { protect } from '../middlewares/auth.middleware.js';
import { chatLimiter } from '../config/rateLimit.js';

const router = express.Router();

router.post('/', protect, chatLimiter, validate(chatSchema), chat);

export default router;

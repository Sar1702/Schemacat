import express from 'express';
import authRoutes from './auth.routes.js';
import dbRoutes from './db.routes.js';
import chatRoutes from './chat.routes.js';
import chatHistoryRoutes from './chatHistory.routes.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SchemaCat API is running',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/db', dbRoutes);
router.use('/chat', chatRoutes);
router.use('/chat/history', chatHistoryRoutes);

export default router;

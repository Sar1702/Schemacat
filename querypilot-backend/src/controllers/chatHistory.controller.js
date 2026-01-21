import asyncHandler from '../utils/asyncHandler.js';
import * as chatHistoryService from '../services/chatHistory.service.js';
import logger from '../utils/logger.js';

/**
 * Get chat history for authenticated user
 * GET /api/chat/history
 */
export const getHistory = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;

    logger.info(`Getting chat history for user ${userId}`);

    const chatHistory = await chatHistoryService.getChatHistory(userId, limit);
    const messageCount = await chatHistoryService.getChatMessageCount(userId);

    res.status(200).json({
        success: true,
        data: {
            messages: chatHistory,
            totalMessages: messageCount,
        },
    });
});

/**
 * Clear chat history for authenticated user
 * DELETE /api/chat/history
 */
export const clearHistory = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    logger.info(`Clearing chat history for user ${userId}`);

    await chatHistoryService.clearChatHistory(userId);

    res.status(200).json({
        success: true,
        message: 'Chat history cleared successfully',
    });
});

import { getChatHistoryCollection } from '../models/chatHistory.model.js';
import { connectCoreDb } from './auth.service.js';
import logger from '../utils/logger.js';

/**
 * Save a chat message to the database
 */
export const saveChatMessage = async (userId, role, content, schemaContext = null) => {
    try {
        const db = await connectCoreDb();
        const chatHistory = getChatHistoryCollection(db);

        const message = {
            role, // 'user' or 'assistant'
            content,
            timestamp: new Date(),
            ...(schemaContext && { schemaContext })
        };

        // Use upsert to create or update user's chat history
        await chatHistory.updateOne(
            { userId },
            {
                $push: { messages: message },
                $set: { updatedAt: new Date() },
                $setOnInsert: { createdAt: new Date() }
            },
            { upsert: true }
        );

        logger.info(`Chat message saved for user ${userId}`);
        return message;
    } catch (error) {
        logger.error(`Error saving chat message: ${error.message}`);
        throw error;
    }
};

/**
 * Get chat history for a user
 */
export const getChatHistory = async (userId, limit = 50) => {
    try {
        const db = await connectCoreDb();
        const chatHistory = getChatHistoryCollection(db);

        const result = await chatHistory.findOne(
            { userId },
            {
                projection: {
                    messages: { $slice: -limit } // Get last N messages
                }
            }
        );

        return result?.messages || [];
    } catch (error) {
        logger.error(`Error getting chat history: ${error.message}`);
        throw error;
    }
};

/**
 * Clear chat history for a user
 */
export const clearChatHistory = async (userId) => {
    try {
        const db = await connectCoreDb();
        const chatHistory = getChatHistoryCollection(db);

        await chatHistory.deleteOne({ userId });

        logger.info(`Chat history cleared for user ${userId}`);
        return { success: true };
    } catch (error) {
        logger.error(`Error clearing chat history: ${error.message}`);
        throw error;
    }
};

/**
 * Get total message count for a user
 */
export const getChatMessageCount = async (userId) => {
    try {
        const db = await connectCoreDb();
        const chatHistory = getChatHistoryCollection(db);

        const result = await chatHistory.findOne(
            { userId },
            { projection: { messages: 1 } }
        );

        return result?.messages?.length || 0;
    } catch (error) {
        logger.error(`Error getting message count: ${error.message}`);
        throw error;
    }
};

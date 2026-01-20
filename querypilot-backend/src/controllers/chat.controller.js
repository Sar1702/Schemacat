import asyncHandler from '../utils/asyncHandler.js';
import * as schemaService from '../services/schema.service.js';
import logger from '../utils/logger.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const chat = asyncHandler(async (req, res) => {
  const { message, collectionName } = req.body;
  const userId = req.user.id;
  
  logger.info(`Chat request from user ${userId}: ${message.substring(0, 50)}...`);
  
  const schemaContext = await schemaService.getSchemaContext(userId);
  
  // System prompt for SchemaCat
  const systemPrompt = `You are SchemaCat, a MongoDB-focused developer assistant.

Your role is to help developers write, understand, and optimize MongoDB queries and schemas using real database context.

You are NOT a general-purpose chatbot.
You ONLY assist with MongoDB-related tasks, including:
- Writing MongoDB queries and aggregation pipelines
- Explaining existing queries in simple terms
- Suggesting indexes and query optimizations
- Providing schema design advice
- Identifying potential performance issues

You will be provided with MongoDB database context, such as:
- Collection names
- Sample document structures
- Field names and data types
- Existing indexes

You MUST strictly follow this context.
Do NOT assume or invent collections, fields, or indexes.
If a requested field or collection does not exist, clearly state that and explain the limitation.

Response rules:
1. If the user asks for a query, first output a valid MongoDB query.
2. Then explain what the query does in clear, developer-friendly language.
3. Then provide optimization or schema suggestions if applicable.
4. Use valid MongoDB syntax only.
5. Keep responses concise, accurate, and practical.

If the request is unclear, ask a clarification question before generating a query.
If the request is outside MongoDB scope, politely refuse and redirect to MongoDB-related help only.

Your tone should be professional, precise, and focused on developer productivity.`;
  
  // Build context for AI
  const contextMessage = `${systemPrompt}

DATABASE SCHEMA CONTEXT:
${schemaContext}

USER QUESTION: ${message}

Provide your response as SchemaCat:`;
  
  try {
    // Call Google Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(contextMessage);
    const response = await result.response;
    const aiResponse = response.text();
    
    const responseData = {
      receivedMessage: message,
      collectionContext: collectionName || null,
      schemaContext: schemaContext,
      aiResponse: aiResponse,
      note: 'Response generated using Google Gemini 1.5 Flash',
    };
    
    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    logger.error(`Chat error: ${error.message}`);
    
    // Fallback response if AI fails
    const response = {
      receivedMessage: message,
      collectionContext: collectionName || null,
      schemaContext: schemaContext,
      aiResponse: 'I apologize, but I encountered an error processing your request. Please try again.',
      note: `Error: ${error.message}`,
    };
    
    res.status(200).json({
      success: true,
      data: response,
    });
  }
});

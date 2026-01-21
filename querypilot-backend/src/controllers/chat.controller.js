import asyncHandler from '../utils/asyncHandler.js';
import * as schemaService from '../services/schema.service.js';
import * as chatHistoryService from '../services/chatHistory.service.js';
import logger from '../utils/logger.js';
import OpenAI from 'openai';

export const chat = asyncHandler(async (req, res) => {
  const { message, collectionName } = req.body;
  const userId = req.user.id;

  logger.info(`Chat request from user ${userId}: ${message.substring(0, 50)}...`);

  const schemaContext = await schemaService.getSchemaContext(userId);

  // System prompt for SchemaCat
  const systemPrompt = `You are SchemaCat, a friendly MongoDB assistant that helps users work with their database.

Your role is to help users write and understand MongoDB queries using their actual database structure.

You ONLY help with MongoDB-related tasks:
- Writing database queries
- Explaining what queries do in simple terms
- Suggesting better ways to organize or query data

IMPORTANT RULES FOR YOUR RESPONSES:

1. **Always start with the MongoDB query code** in a code block
2. **Explain in SIMPLE language** - imagine you're talking to someone who just learned about databases
3. **Use everyday analogies** - compare database operations to real-world actions (like searching through a filing cabinet, counting items in a box, etc.)
4. **Avoid technical jargon** - don't use terms like "documents", "collections", "indexes" without explaining them in plain English first
5. **Be conversational and friendly** - use "you" and "your data" instead of formal language
6. **Keep it short** - 2-3 sentences max for explanations

EXAMPLE OF GOOD RESPONSE:
\`\`\`javascript
db.students.find({})
\`\`\`
This gets all the students from your database - like opening a folder and pulling out every student record you have.

EXAMPLE OF BAD RESPONSE (too technical):
This query retrieves all documents from the students collection. The find() method with an empty object parameter returns all documents without filtering criteria.

You will be given information about the user's database structure. ONLY use collections and fields that actually exist - never make up or assume data that isn't there.

If someone asks for something outside MongoDB or database work, politely say you only help with database queries.`;

  // Build context for AI
  const userPrompt = `DATABASE SCHEMA CONTEXT:
${schemaContext}

USER QUESTION: ${message}

Provide your response as SchemaCat:`;

  try {
    // Call OpenAI API
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    logger.info('Calling OpenAI GPT-4o-mini model');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0].message.content;

    // Save user message to chat history
    await chatHistoryService.saveChatMessage(userId, 'user', message, schemaContext);

    // Save AI response to chat history
    await chatHistoryService.saveChatMessage(userId, 'assistant', aiResponse.trim());

    // Get full chat history to return
    const chatHistory = await chatHistoryService.getChatHistory(userId);

    const responseData = {
      receivedMessage: message,
      collectionContext: collectionName || null,
      schemaContext: schemaContext,
      aiResponse: aiResponse.trim(),
      chatHistory: chatHistory, // Include full chat history
      note: 'Response generated using OpenAI GPT-4o-mini',
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

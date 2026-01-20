import asyncHandler from '../utils/asyncHandler.js';
import * as mongoDbService from '../services/mongoUserDb.service.js';
import * as schemaService from '../services/schema.service.js';
import logger from '../utils/logger.js';

export const connectDatabase = asyncHandler(async (req, res) => {
  const { mongoUri, dbName } = req.body;
  const userId = req.user.id;
  
  logger.info(`Testing MongoDB connection for user ${userId}`);
  
  const testResult = await mongoDbService.testConnection(mongoUri, dbName);
  
  await mongoDbService.saveUserConnection(userId, mongoUri, dbName);
  
  res.status(200).json({
    success: true,
    message: 'Database connected successfully',
    data: testResult,
  });
});

export const getSchema = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  logger.info(`Fetching schema for user ${userId}`);
  
  const schema = await schemaService.getDatabaseSchema(userId);
  
  res.status(200).json({
    success: true,
    data: schema,
  });
});

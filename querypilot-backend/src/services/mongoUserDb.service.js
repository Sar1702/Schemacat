import { MongoClient, ObjectId } from 'mongodb';
import ApiError from '../utils/apiError.js';
import { encrypt, decrypt } from '../utils/crypto.js';
import { getUsersCollection } from '../models/user.model.js';
import logger from '../utils/logger.js';
import { connectCoreDb } from './auth.service.js';

const userDbConnections = new Map();

export const testConnection = async (mongoUri, dbName) => {
  let client;
  
  try {
    client = new MongoClient(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    
    await client.connect();
    const db = client.db(dbName);
    
    await db.admin().ping();
    
    const collections = await db.listCollections().toArray();
    
    return {
      success: true,
      message: 'Connection successful',
      dbName,
      collectionsCount: collections.length,
    };
  } catch (error) {
    logger.error('MongoDB connection test failed:', error.message);
    throw new ApiError(400, `Connection failed: ${error.message}`);
  } finally {
    if (client) {
      await client.close();
    }
  }
};

export const saveUserConnection = async (userId, mongoUri, dbName) => {
  const db = await connectCoreDb();
  const users = getUsersCollection(db);
  
  const encryptedUri = encrypt(mongoUri);
  
  const result = await users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        mongoUri: encryptedUri,
        dbName,
        updatedAt: new Date(),
      },
    }
  );
  
  if (result.matchedCount === 0) {
    throw new ApiError(404, 'User not found');
  }
  
  logger.info(`MongoDB connection saved for user ${userId}`);
  
  return {
    success: true,
    message: 'Connection saved successfully',
  };
};

export const getUserConnection = async (userId) => {
  if (userDbConnections.has(userId)) {
    return userDbConnections.get(userId);
  }
  
  const db = await connectCoreDb();
  const users = getUsersCollection(db);
  
  const user = await users.findOne({ _id: new ObjectId(userId) });
  
  if (!user || !user.mongoUri || !user.dbName) {
    throw new ApiError(404, 'User database connection not configured');
  }
  
  try {
    const decryptedUri = decrypt(user.mongoUri);
    
    const client = new MongoClient(decryptedUri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    await client.connect();
    const userDb = client.db(user.dbName);
    
    const connection = { client, db: userDb, dbName: user.dbName };
    userDbConnections.set(userId, connection);
    
    logger.info(`Connected to user database: ${user.dbName}`);
    
    return connection;
  } catch (error) {
    logger.error('Failed to connect to user database:', error.message);
    throw new ApiError(500, 'Failed to connect to your MongoDB database');
  }
};

export const closeUserConnection = async (userId) => {
  if (userDbConnections.has(userId)) {
    const { client } = userDbConnections.get(userId);
    await client.close();
    userDbConnections.delete(userId);
    logger.info(`Closed database connection for user ${userId}`);
  }
};

export const closeAllUserConnections = async () => {
  for (const [userId, { client }] of userDbConnections.entries()) {
    await client.close();
    logger.info(`Closed database connection for user ${userId}`);
  }
  userDbConnections.clear();
};

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb';
import config from '../config/env.js';
import ApiError from '../utils/apiError.js';
import { getUsersCollection } from '../models/user.model.js';
import logger from '../utils/logger.js';

let coreDbClient = null;
let coreDb = null;

export const connectCoreDb = async () => {
  if (coreDb) return coreDb;
  
  try {
    coreDbClient = new MongoClient(config.mongodb.uri);
    await coreDbClient.connect();
    coreDb = coreDbClient.db();
    logger.info('Connected to core MongoDB database');
    return coreDb;
  } catch (error) {
    logger.error('Failed to connect to core MongoDB:', error.message);
    throw new ApiError(500, 'Database connection failed');
  }
};

const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

export const registerUser = async ({ email, password, name }) => {
  const db = await connectCoreDb();
  const users = getUsersCollection(db);
  
  const existingUser = await users.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = {
    email: email.toLowerCase(),
    password: hashedPassword,
    name: name || email.split('@')[0],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const result = await users.insertOne(newUser);
  
  const token = generateToken({
    id: result.insertedId.toString(),
    email: newUser.email,
  });
  
  return {
    user: {
      id: result.insertedId.toString(),
      email: newUser.email,
      name: newUser.name,
    },
    token,
  };
};

export const loginUser = async ({ email, password }) => {
  const db = await connectCoreDb();
  const users = getUsersCollection(db);
  
  const user = await users.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }
  
  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
  });
  
  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    token,
  };
};

export const getUserById = async (userId) => {
  const db = await connectCoreDb();
  const users = getUsersCollection(db);
  
  const user = await users.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    mongoUri: user.mongoUri ? '***configured***' : null,
    dbName: user.dbName || null,
  };
};

export const closeCoreDb = async () => {
  if (coreDbClient) {
    await coreDbClient.close();
    coreDb = null;
    coreDbClient = null;
    logger.info('Core MongoDB connection closed');
  }
};

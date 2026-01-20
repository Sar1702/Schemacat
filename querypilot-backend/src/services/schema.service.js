import ApiError from '../utils/apiError.js';
import { getUserConnection } from './mongoUserDb.service.js';
import logger from '../utils/logger.js';

const extractFieldTypes = (doc, prefix = '') => {
  const fields = {};
  
  for (const [key, value] of Object.entries(doc)) {
    const fieldPath = prefix ? `${prefix}.${key}` : key;
    
    if (value === null) {
      fields[fieldPath] = 'null';
    } else if (Array.isArray(value)) {
      fields[fieldPath] = 'array';
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        fields[fieldPath] += ' of objects';
      }
    } else if (typeof value === 'object' && value !== null) {
      if (value.constructor.name === 'ObjectId') {
        fields[fieldPath] = 'ObjectId';
      } else if (value instanceof Date) {
        fields[fieldPath] = 'Date';
      } else {
        fields[fieldPath] = 'object';
        if (!prefix || prefix.split('.').length < 2) {
          Object.assign(fields, extractFieldTypes(value, fieldPath));
        }
      }
    } else {
      fields[fieldPath] = typeof value;
    }
  }
  
  return fields;
};

export const getDatabaseSchema = async (userId) => {
  try {
    const { db, dbName } = await getUserConnection(userId);
    
    const collections = await db.listCollections().toArray();
    
    const schema = {
      database: dbName,
      collections: [],
    };
    
    for (const collInfo of collections) {
      const collectionName = collInfo.name;
      const collection = db.collection(collectionName);
      
      const stats = await db.command({ collStats: collectionName });
      
      const samples = await collection.find({}).limit(5).toArray();
      
      const allFields = {};
      samples.forEach(doc => {
        const fields = extractFieldTypes(doc);
        Object.assign(allFields, fields);
      });
      
      const indexes = await collection.indexes();
      
      schema.collections.push({
        name: collectionName,
        count: stats.count,
        size: stats.size,
        fields: allFields,
        indexes: indexes.map(idx => ({
          name: idx.name,
          keys: idx.key,
          unique: idx.unique || false,
        })),
      });
    }
    
    logger.info(`Schema extracted for user ${userId}: ${schema.collections.length} collections`);
    
    return schema;
  } catch (error) {
    logger.error('Schema extraction failed:', error.message);
    throw new ApiError(500, `Failed to extract schema: ${error.message}`);
  }
};

export const getSchemaContext = async (userId) => {
  const schema = await getDatabaseSchema(userId);
  
  let context = `Database: ${schema.database}\n\nCollections:\n`;
  
  schema.collections.forEach(coll => {
    context += `\n- ${coll.name} (${coll.count} documents)\n`;
    context += `  Fields: ${Object.keys(coll.fields).slice(0, 15).join(', ')}${Object.keys(coll.fields).length > 15 ? '...' : ''}\n`;
    
    if (coll.indexes.length > 1) {
      context += `  Indexes: ${coll.indexes.filter(idx => idx.name !== '_id_').map(idx => Object.keys(idx.keys).join(', ')).join('; ')}\n`;
    }
  });
  
  return context;
};

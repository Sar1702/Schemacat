export const getUsersCollection = (db) => {
  return db.collection('users');
};

export const createUserIndexes = async (db) => {
  const users = getUsersCollection(db);
  
  await users.createIndex({ email: 1 }, { unique: true });
  await users.createIndex({ createdAt: 1 });
};

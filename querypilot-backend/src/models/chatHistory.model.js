export const getChatHistoryCollection = (db) => {
    return db.collection('chatHistory');
};

export const createChatHistoryIndexes = async (db) => {
    const chatHistory = getChatHistoryCollection(db);

    // Index on userId for fast lookups
    await chatHistory.createIndex({ userId: 1 });

    // Index on userId and updatedAt for sorting recent chats
    await chatHistory.createIndex({ userId: 1, updatedAt: -1 });
};

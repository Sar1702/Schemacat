import React from 'react';

const ChatBubble = ({ message, isUser = false }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-3xl ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'} rounded-lg px-4 py-3`}>
        {message}
      </div>
    </div>
  );
};

export default ChatBubble;

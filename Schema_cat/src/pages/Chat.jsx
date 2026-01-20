import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import CodeBlock from '../components/CodeBlock';
import ThemeToggle from '../components/ThemeToggle';
import api from '../services/api';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [schema, setSchema] = useState(null);

  useEffect(() => {
    loadSchema();
  }, []);

  const loadSchema = async () => {
    try {
      const response = await api.getSchema();
      setSchema(response.data);
    } catch (err) {
      console.error('Failed to load schema:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      isUser: true,
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await api.sendMessage(inputValue);
      
      const aiMessage = {
        id: Date.now() + 1,
        isUser: false,
        text: response.data.aiResponse,
        schemaContext: response.data.schemaContext,
        note: response.data.note
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        isUser: false,
        text: 'Failed to get response: ' + err.message,
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chat</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Ask questions about your MongoDB database</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              {message.isUser ? (
                <div className="max-w-2xl bg-blue-600 text-white rounded-lg px-5 py-3 shadow-md">
                  <p>{message.text}</p>
                </div>
              ) : (
                <div className="max-w-3xl space-y-3">
                  <div className={`bg-white dark:bg-gray-800 rounded-lg px-5 py-3 shadow-md border ${message.isError ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'}`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 ${message.isError ? 'bg-red-600' : 'bg-blue-600'} rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className={`mb-3 ${message.isError ? 'text-red-900 dark:text-red-100' : 'text-gray-900 dark:text-gray-100'}`}>{message.text}</p>
                        {message.schemaContext && (
                          <div className="my-3 p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Schema Context:</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{message.schemaContext}</p>
                          </div>
                        )}
                        {message.note && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 italic">
                            {message.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <form onSubmit={handleSend} className="flex items-center space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <Button type="submit" className="px-6" disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;

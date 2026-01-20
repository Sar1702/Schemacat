import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import api from '../services/api';

const Connect = () => {
  const navigate = useNavigate();
  const [connectionData, setConnectionData] = useState({
    mongoUri: '',
    databaseName: ''
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState('');
  const [connectionInfo, setConnectionInfo] = useState(null);

  const handleChange = (e) => {
    setConnectionData({
      ...connectionData,
      [e.target.id]: e.target.value
    });
  };

  const handleTestConnection = async (e) => {
    e.preventDefault();
    setIsTesting(true);
    setError('');
    setConnectionInfo(null);

    try {
      const response = await api.connectDatabase(
        connectionData.mongoUri,
        connectionData.databaseName
      );
      
      setIsConnected(true);
      setConnectionInfo(response.data);
    } catch (err) {
      setError(err.message || 'Failed to connect to database');
      setIsConnected(false);
    } finally {
      setIsTesting(false);
    }
  };

  const handleContinue = () => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center px-4">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Connect to Your MongoDB
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your database connection details
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleTestConnection} className="space-y-5">
          <Input
            type="text"
            id="mongoUri"
            label="MongoDB URI"
            placeholder="mongodb+srv://your-cluster"
            value={connectionData.mongoUri}
            onChange={handleChange}
            required
          />

          <Input
            type="text"
            id="databaseName"
            label="Database Name"
            placeholder="Database Name"
            value={connectionData.databaseName}
            onChange={handleChange}
            required
          />

          <Button 
            type="submit" 
            fullWidth 
            className="mt-6"
            disabled={isTesting || isConnected}
          >
            {isTesting ? 'Testing Connection...' : 'Test Connection'}
          </Button>
        </form>

        {/* Success Message */}
        {isConnected && connectionInfo && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-700 dark:text-green-300 font-medium">
                Connection Successful!
              </span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              Database: {connectionInfo.dbName} ({connectionInfo.collectionsCount} collections found)
            </p>
          </div>
        )}

        {/* Continue Button */}
        {isConnected && (
          <Button 
            onClick={handleContinue}
            fullWidth 
            className="mt-4"
          >
            Continue to Chat
          </Button>
        )}

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Need help?</strong> Your MongoDB URI should look like: 
            <code className="ml-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/40 rounded">
              mongodb+srv://username:password@cluster.mongodb.net/
            </code>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Connect;

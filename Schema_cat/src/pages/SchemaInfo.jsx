import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import ThemeToggle from '../components/ThemeToggle';
import api from '../services/api';

const SchemaInfo = () => {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSchema();
  }, []);

  const loadSchema = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getSchema();
      setSchema(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load schema');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Schema Info</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Database structure and statistics</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400">Loading schema...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {!loading && !error && schema && (
            <div className="space-y-6">
              {/* Database Info */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Database: {schema.dbName}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Collections</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{schema.collections.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Documents</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {schema.collections.reduce((sum, col) => sum + (col.documentCount || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Collections */}
              <div className="grid gap-4">
                {schema.collections.map((collection) => (
                  <Card key={collection.name} className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {collection.name}
                    </h3>
                    
                    <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span>Documents: {collection.documentCount?.toLocaleString() || 0}</span>
                    </div>

                    {collection.fields && collection.fields.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Fields:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {collection.fields.map((field, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded px-3 py-2">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{field.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{field.types.join(' | ')}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {collection.indexes && collection.indexes.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Indexes:</h4>
                        <div className="space-y-2">
                          {collection.indexes.map((index, idx) => (
                            <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 rounded px-3 py-2">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{index.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Keys: {JSON.stringify(index.keys)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemaInfo;

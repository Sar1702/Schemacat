import React from 'react';

const CodeBlock = ({ code, language = 'javascript' }) => {
  return (
    <div className="bg-gray-900 dark:bg-black rounded-lg p-4 overflow-x-auto">
      <pre className="text-sm text-gray-100">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;

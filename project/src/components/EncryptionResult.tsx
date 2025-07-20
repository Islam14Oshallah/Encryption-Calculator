import React, { useState, useContext } from 'react';
import { Copy, CheckCircle } from 'lucide-react';
import { NotificationContext } from '../context/NotificationContext';

interface EncryptionResultProps {
  result: string;
}

const EncryptionResult: React.FC<EncryptionResultProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const { success } = useContext(NotificationContext);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    success('Result copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6 hover-scale">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-blue-600 dark:bg-blue-700 text-white rounded-full flex items-center justify-center mr-2">
          <span className="font-bold">3</span>
        </div>
        <h2 className="text-xl font-semibold dark:text-white">Result:</h2>
      </div>
      
      <div className="relative">
        <textarea
          value={result}
          readOnly
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-700 dark:text-white min-h-[100px] focus:ring-2 focus:ring-blue-400"
        />
        
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-500 p-2 rounded-full transition-all duration-200 transform hover:scale-110"
          aria-label="Copy result"
        >
          {copied ? (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          ) : (
            <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>
    </div>
  );
};

export default EncryptionResult;
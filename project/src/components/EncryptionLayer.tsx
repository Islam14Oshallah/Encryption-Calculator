import React from 'react';
import { X, HelpCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { AlgorithmType, EncryptionLayerType } from '../lib/types';
import { getAlgorithmInfo } from '../lib/utils';

interface EncryptionLayerProps {
  layer: EncryptionLayerType;
  onAlgorithmChange: (id: number, algorithm: AlgorithmType) => void;
  onKeyChange: (id: number, key: string) => void;
  onIvChange?: (id: number, iv: string) => void;
  onRandomIvToggle?: (id: number, useRandomIv: boolean) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  showRemoveButton: boolean;
  isFirst: boolean;
  isLast: boolean;
}

const EncryptionLayer: React.FC<EncryptionLayerProps> = ({
  layer,
  onAlgorithmChange,
  onKeyChange,
  onIvChange,
  onRandomIvToggle,
  onRemove,
  onMoveUp,
  onMoveDown,
  showRemoveButton,
  isFirst,
  isLast
}) => {
  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onAlgorithmChange(layer.id, e.target.value as AlgorithmType);
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onKeyChange(layer.id, e.target.value);
  };
  
  const handleIvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onIvChange) {
      onIvChange(layer.id, e.target.value);
    }
  };
  
  const handleRandomIvToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onRandomIvToggle) {
      onRandomIvToggle(layer.id, e.target.checked);
    }
  };

  const algorithmInfo = getAlgorithmInfo(layer.algorithm);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative transition-all duration-300 dark:bg-slate-700 hover-animation">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 flex flex-col gap-1">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className={`p-1 rounded-full transition-colors duration-200 transform hover:scale-110 ${
            isFirst ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900'
          }`}
          aria-label="Move layer up"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className={`p-1 rounded-full transition-colors duration-200 transform hover:scale-110 ${
            isLast ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900'
          }`}
          aria-label="Move layer down"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
      
      {showRemoveButton && (
        <button 
          onClick={onRemove}
          className="absolute right-2 top-2 text-gray-400 hover:text-red-500 transition-all duration-200 transform hover:scale-125 hover:rotate-90"
          aria-label="Remove layer"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="w-full md:w-1/4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Layer {layer.id}:
          </label>
          <select
            value={layer.algorithm}
            onChange={handleAlgorithmChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="none">None</option>
            <option value="aes">AES</option>
            <option value="autokey">Autokey</option>
            <option value="shift">Shift Cipher</option>
            <option value="railfence">Rail Fence</option>
            <option value="vigenere">Vigenère</option>
            <option value="affine">Affine</option>
          </select>
        </div>
        
        {layer.algorithm !== 'none' && (
          <div className="w-full md:w-3/4 relative">
            <div className="flex items-center mb-1">
              <label className="block text-gray-700 dark:text-gray-300 font-medium">
                {algorithmInfo.keyLabel}:
              </label>
              <div className="ml-2 group relative">
                <HelpCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-60 bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  {algorithmInfo.helpText}
                </div>
              </div>
            </div>
            <input
              type={algorithmInfo.inputType}
              value={layer.key}
              onChange={handleKeyChange}
              placeholder={algorithmInfo.placeholder}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            {/* AES-specific IV options */}
            {layer.algorithm === 'aes' && (
              <div className="mt-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`random-iv-${layer.id}`}
                    checked={layer.useRandomIv !== false}
                    onChange={handleRandomIvToggle}
                    className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-500 rounded focus:ring-blue-500"
                  />
                  <label 
                    htmlFor={`random-iv-${layer.id}`}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Use random Initialization Vector (IV)
                  </label>
                  <div className="ml-2 group relative">
                    <HelpCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-60 bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      The IV adds randomness to encryption. Using a random IV (recommended) makes identical texts encrypt differently each time. Custom IVs are stored with the ciphertext and must be exactly 16 characters long. The same custom IV will produce the same ciphertext for identical inputs.
                    </div>
                  </div>
                </div>
                
                {layer.useRandomIv === false && (
                  <div className="mt-2">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
                      Custom IV:
                    </label>
                    <input
                      type="text"
                      value={layer.iv || ''}
                      onChange={handleIvChange}
                      placeholder="Enter exactly 16 characters"
                      maxLength={16}
                      minLength={16}
                      className={`w-full p-2 border ${
                        layer.iv && layer.iv.length !== 16 
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      } dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {layer.iv && layer.iv.length !== 16 && (
                      <p className="text-red-500 text-xs mt-1">IV must be exactly 16 characters</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EncryptionLayer;
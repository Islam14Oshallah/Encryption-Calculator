import React, { useState, useContext } from 'react';
import { Lock, Unlock, X } from 'lucide-react';
import EncryptionLayer from './EncryptionLayer';
import EncryptionResult from './EncryptionResult';
import ProcessSteps from './ProcessSteps';
import CryptoAnalysis from './CryptoAnalysis';
import { useEncryption } from '../hooks/useEncryption';
import { AlgorithmType, EncryptionLayerType } from '../lib/types';
import { NotificationContext } from '../context/NotificationContext';

const EncryptionForm: React.FC = () => {
  const [text, setText] = useState('');
  const [layers, setLayers] = useState<EncryptionLayerType[]>([
    { id: 1, algorithm: 'shift', key: '' }
  ]);
  const [result, setResult] = useState('');
  const [processSteps, setProcessSteps] = useState<string[]>([]);
  const [isEncrypting, setIsEncrypting] = useState(true);
  const [originalText, setOriginalText] = useState('');
  const [lastClickedOperation, setLastClickedOperation] = useState<'encrypt' | 'decrypt' | null>(null);
  const [lastProcessedText, setLastProcessedText] = useState('');
  const [lastProcessedLayers, setLastProcessedLayers] = useState<string>('');
  
  const { encrypt, decrypt, lastOperation } = useEncryption();
  const { success, error, info } = useContext(NotificationContext);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (lastOperation !== 'decrypt') {
      setOriginalText(e.target.value);
    }
  };

  const handleAlgorithmChange = (id: number, algorithm: AlgorithmType) => {
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === id ? { ...layer, algorithm, key: '' } : layer
      )
    );
  };

  const handleKeyChange = (id: number, key: string) => {
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === id ? { ...layer, key } : layer
      )
    );
  };
  
  const handleIvChange = (id: number, iv: string) => {
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === id ? { ...layer, iv } : layer
      )
    );
  };
  
  const handleRandomIvToggle = (id: number, useRandomIv: boolean) => {
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === id ? { ...layer, useRandomIv } : layer
      )
    );
  };

  const addLayer = () => {
    setLayers([...layers, { 
      id: layers.length + 1, 
      algorithm: 'none', 
      key: '' 
    }]);
    success('New encryption layer added');
  };

  const removeLayer = (id: number) => {
    if (layers.length > 1) {
      // First set the layer as removing (this will trigger the exit animation)
      setLayers(prevLayers => 
        prevLayers.map(layer => 
          layer.id === id ? { ...layer, removing: true } : layer
        )
      );
      
      // Then after animation completes, actually remove it
      setTimeout(() => {
        const updatedLayers = layers.filter(layer => layer.id !== id);
        
        // Reindex the remaining layers
        updatedLayers.forEach((layer, index) => {
          layer.id = index + 1;
        });
        
        setLayers(updatedLayers);
        info('Layer removed');
      }, 300); // Match this timing with the CSS animation duration
    }
  };

  const moveLayer = (index: number, direction: 'up' | 'down') => {
    const newLayers = [...layers];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newLayers.length) {
      [newLayers[index], newLayers[newIndex]] = [newLayers[newIndex], newLayers[index]];
      // Update IDs to maintain order
      newLayers.forEach((layer, i) => {
        layer.id = i + 1;
      });
      setLayers(newLayers);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      error('Please enter text to process');
      return;
    }
    
    const activeLayers = layers.filter(layer => layer.algorithm !== 'none');
    
    if (activeLayers.length === 0) {
      error('Please select at least one encryption algorithm');
      return;
    }
    
    // Create a string representation of current layers for comparison
    const layersString = JSON.stringify(activeLayers);
    
    // Check if we're trying to process the exact same text and layers configuration
    if (text === lastProcessedText && layersString === lastProcessedLayers) {
      info('Text and configuration unchanged - keeping current results');
      return;
    }
    
    try {
      if (isEncrypting) {
        const { result: encryptedResult, steps } = await encrypt(text, activeLayers);
        setResult(encryptedResult);
        setProcessSteps(steps);
        setOriginalText(text);
        setLastProcessedText(text);
        setLastProcessedLayers(layersString);
        success('Text encrypted successfully');
      } else {
        const { result: decryptedResult, steps } = await decrypt(text, activeLayers);
        setResult(decryptedResult);
        setProcessSteps(steps);
        setLastProcessedText(text);
        setLastProcessedLayers(layersString);
        success('Text decrypted successfully');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Encryption/Decryption Error:', err);
      error(`Error processing your text: ${errorMessage}`);
    }
  };

  const clearAll = () => {
    setText('');
    setResult('');
    setProcessSteps([]);
    setLayers([{ id: 1, algorithm: 'shift', key: '' }]);
    setOriginalText('');
    setLastProcessedText('');
    setLastProcessedLayers('');
    info('All fields cleared');
  };

  const handleOperationToggle = (encrypting: boolean) => {
    const currentOperation = encrypting ? 'encrypt' : 'decrypt';

    // If this is the second click on the same operation button, perform the calculation
    if (currentOperation === lastClickedOperation) {
      handleSubmit();
      return;
    }

    // First click just switches the mode
    setIsEncrypting(encrypting);
    setLastClickedOperation(currentOperation);
    
    if (!encrypting && lastOperation === 'encrypt') {
      setText(result);
      info('Switched to decryption mode');
    } else if (encrypting && lastOperation === 'decrypt') {
      setText(originalText);
      info('Switched to encryption mode');
    } else {
      info(`Switched to ${encrypting ? 'encryption' : 'decryption'} mode. Click again to process.`);
    }
  };

  // Get active layers for crypto analysis
  const activeLayers = layers.filter(layer => layer.algorithm !== 'none');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Text Input */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6 animate-fadeIn">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-blue-600 dark:bg-blue-700 text-white rounded-full flex items-center justify-center mr-2">
            <span className="font-bold">1</span>
          </div>
          <h2 className="text-xl font-semibold dark:text-white">Enter Text:</h2>
        </div>
        <textarea
          value={text}
          onChange={handleTextChange}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] transition-all duration-200 hover:shadow-sm focus:shadow-md"
          placeholder="Type or paste your text here..."
        />
      </div>
      
      {/* Encryption Layers */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 dark:bg-blue-700 text-white rounded-full flex items-center justify-center mr-2">
              <span className="font-bold">2</span>
            </div>
            <h2 className="text-xl font-semibold dark:text-white">Encryption Layers</h2>
          </div>
          <button 
            onClick={addLayer}
            className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
          >
            Add Layer
          </button>
        </div>
        
        <div className="space-y-4 pl-12">
          {layers.map((layer, index) => (
            <div 
              key={layer.id} 
              className={`layer-item ${layer.removing ? 'layer-removing' : 'layer-visible'}`}
            >
              <EncryptionLayer
                layer={layer}
                onAlgorithmChange={handleAlgorithmChange}
                onKeyChange={handleKeyChange}
                onIvChange={handleIvChange}
                onRandomIvToggle={handleRandomIvToggle}
                onRemove={() => removeLayer(layer.id)}
                onMoveUp={() => moveLayer(index, 'up')}
                onMoveDown={() => moveLayer(index, 'down')}
                showRemoveButton={layers.length > 1}
                isFirst={index === 0}
                isLast={index === layers.length - 1}
              />
            </div>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => handleOperationToggle(true)}
            className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center transform hover:scale-105 active:scale-95 transition-colors duration-200 ${
              lastClickedOperation === 'encrypt' 
                ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white' 
                : 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white'
            }`}
          >
            <Lock className="w-5 h-5 mr-2" />
            {lastClickedOperation === 'encrypt' ? 'Encrypt Now' : 'Switch to Encrypt'}
          </button>
          <button
            onClick={() => handleOperationToggle(false)}
            className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center transform hover:scale-105 active:scale-95 transition-colors duration-200 ${
              lastClickedOperation === 'decrypt' 
                ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white' 
                : 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white'
            }`}
          >
            <Unlock className="w-5 h-5 mr-2" />
            {lastClickedOperation === 'decrypt' ? 'Decrypt Now' : 'Switch to Decrypt'}
          </button>
          <button
            onClick={clearAll}
            className="flex-1 md:flex-none bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center transform hover:scale-105 active:scale-95"
          >
            <X className="w-5 h-5 mr-2" />
            Clear
          </button>
        </div>
      </div>
      
      {/* Results */}
      {result && (
        <>
          <div className="animate-slideUp" style={{animationDelay: '200ms'}}>
            <EncryptionResult result={result} />
          </div>
          <div className="animate-slideUp" style={{animationDelay: '300ms'}}>
            <ProcessSteps steps={processSteps} />
          </div>
          <div className="animate-slideUp" style={{animationDelay: '400ms'}}>
            <CryptoAnalysis activeLayers={activeLayers} />
          </div>
        </>
      )}
    </div>
  );
};

export default EncryptionForm;
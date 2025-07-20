// filepath: c:\Users\Islam Oshallah\OneDrive\Desktop\project\src\hooks\useEncryption.ts
import { useState } from 'react';
import { EncryptionLayerType, EncryptionResult } from '../lib/types';
import { isValidKey } from '../lib/utils';

// Import all encryption algorithms
import { aesEncrypt, aesDecrypt } from '../lib/algorithms/aes';
import { shiftEncrypt, shiftDecrypt } from '../lib/algorithms/shift';
import { railfenceEncrypt, railfenceDecrypt } from '../lib/algorithms/railfence';
import { vigenereEncrypt, vigenereDecrypt } from '../lib/algorithms/vigenere';
import { autokeyEncrypt, autokeyDecrypt } from '../lib/algorithms/autokey';
import { affineEncrypt, affineDecrypt } from '../lib/algorithms/affine';

export const useEncryption = () => {
  const [error, setError] = useState<string | null>(null);
  const [lastOperation, setLastOperation] = useState<'encrypt' | 'decrypt' | null>(null);
  
  const validateLayers = (layers: EncryptionLayerType[]): boolean => {
    for (const layer of layers) {
      if (layer.algorithm === 'none') continue;
      
      if (!layer.key.trim()) {
        setError(`Please provide a key for ${layer.algorithm.toUpperCase()}`);
        return false;
      }
      
      if (!isValidKey(layer.algorithm, layer.key)) {
        setError(`Invalid key format for ${layer.algorithm.toUpperCase()}`);
        return false;
      }
    }
    
    return true;
  };  const encrypt = async (text: string, layers: EncryptionLayerType[]): Promise<EncryptionResult> => {
    setError(null);
    setLastOperation('encrypt');
    
    if (!validateLayers(layers)) {
      throw new Error(error || 'Invalid layer configuration');
    }
    
    let result = text;
    const steps: string[] = [];
    
    // Process each layer in order for encryption
    for (const layer of layers) {
      if (layer.algorithm === 'none') continue;
      
      let encryptionResult: EncryptionResult;
      
      try {
        switch (layer.algorithm) {
          case 'aes':
            encryptionResult = await aesEncrypt(result, {
              key: layer.key,
              iv: layer.iv,
              useRandomIv: layer.useRandomIv
            });
            break;
          case 'shift':
            encryptionResult = shiftEncrypt(result, layer.key);
            break;
          case 'railfence':
            encryptionResult = railfenceEncrypt(result, layer.key);
            break;
          case 'vigenere':
            encryptionResult = vigenereEncrypt(result, layer.key);
            break;
          case 'autokey':
            encryptionResult = autokeyEncrypt(result, layer.key);
            break;
          case 'affine':
            encryptionResult = affineEncrypt(result, layer.key);
            break;
          default:
            continue;
        }
        
        result = encryptionResult.result;
        steps.push(...encryptionResult.steps);
      } catch (err) {
        console.error(`Error in ${layer.algorithm} encryption:`, err);
        throw err;
      }
    }
    
    return { result, steps };
  };  const decrypt = async (text: string, layers: EncryptionLayerType[]): Promise<EncryptionResult> => {
    setError(null);
    setLastOperation('decrypt');
    
    if (!validateLayers(layers)) {
      throw new Error(error || 'Invalid layer configuration');
    }
    
    let result = text;
    const steps: string[] = [];
    
    // Get only active layers and reverse them for decryption
    const activeLayers = layers
      .filter(layer => layer.algorithm !== 'none')
      .reverse();
    
    // Add information about decryption order to help user understand the process
    if (activeLayers.length > 1) {
      steps.push(`IMPORTANT: Decrypting in reverse order of encryption: ${activeLayers.map(l => l.algorithm.toUpperCase()).join(' → ')}`);
    }
    
    // Process layers in reverse order for decryption
    for (const layer of activeLayers) {
      let decryptionResult: EncryptionResult;
      
      try {
        steps.push(`Attempting to decrypt with ${layer.algorithm.toUpperCase()}...`);
        
        switch (layer.algorithm) {
          case 'aes':
            decryptionResult = await aesDecrypt(result, {
              key: layer.key,
              iv: layer.iv,
              useRandomIv: layer.useRandomIv
            });
            break;
          case 'shift':
            decryptionResult = shiftDecrypt(result, layer.key);
            break;
          case 'railfence':
            decryptionResult = railfenceDecrypt(result, layer.key);
            break;
          case 'vigenere':
            decryptionResult = vigenereDecrypt(result, layer.key);
            break;
          case 'autokey':
            decryptionResult = autokeyDecrypt(result, layer.key);
            break;
          case 'affine':
            decryptionResult = affineDecrypt(result, layer.key);
            break;
          default:
            continue;
        }
        
        result = decryptionResult.result;
        steps.push(...decryptionResult.steps);
      } catch (err: any) {
        console.error(`Error in ${layer.algorithm} decryption:`, err);
        
        // Provide more helpful error message
        const errorMessage = `Error in ${layer.algorithm.toUpperCase()} decryption: ${err.message || 'Unknown error'}`;
        throw new Error(errorMessage);
      }
    }
    
    return { result, steps };
  };
  
  return {
    encrypt,
    decrypt,
    error,
    lastOperation
  };
};

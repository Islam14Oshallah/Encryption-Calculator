import { EncryptionResult } from '../types';

export const shiftEncrypt = (text: string, key: string): EncryptionResult => {
  const shift = parseInt(key);
  
  if (isNaN(shift)) {
    throw new Error('Shift value must be a number');
  }
  
  // Process text input directly
  const result = text.split('').map(char => {
    const code = char.charCodeAt(0);
    
    // Handle all characters using a full 8-bit (0-255) range to ensure compatibility
    // with output from other algorithms like RSA
    return String.fromCharCode(((code + shift) % 256 + 256) % 256);
  }).join('');
  
  return {
    result,
    steps: [
      `Encrypting with SHIFT using key: ${shift}`,
      `Processed in 8-bit mode (0-255) for compatibility with other algorithms`
    ]
  };
};

export const shiftDecrypt = (text: string, key: string): EncryptionResult => {
  const shift = parseInt(key);
  
  if (isNaN(shift)) {
    throw new Error('Shift value must be a number');
  }
  
  // Process text input directly, supporting full character range for compatibility
  const result = text.split('').map(char => {
    const code = char.charCodeAt(0);
    
    // Use a full 8-bit (0-255) range for compatibility with output from other algorithms
    return String.fromCharCode(((code - shift) % 256 + 256) % 256);
  }).join('');
  
  return {
    result,
    steps: [
      `Decrypting with SHIFT using key: ${shift}`,
      `Processed in 8-bit mode (0-255) for compatibility with other algorithms`
    ]
  };
};
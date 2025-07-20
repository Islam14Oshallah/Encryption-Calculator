import { EncryptionResult } from '../types';

export const autokeyEncrypt = (text: string, key: string): EncryptionResult => {
  if (!key || !/^[A-Za-z]+$/.test(key)) {
    throw new Error('Autokey key must contain only letters');
  }
  
  // Normalize key and text to uppercase for consistency
  const normalizedKey = key.toUpperCase();
  
  // Generate the full key stream (initial key + plaintext)
  let keyStream = normalizedKey;
  
  const result = text.split('').map((char, index) => {
    const code = char.charCodeAt(0);
    
    // Handle uppercase letters (ASCII 65-90)
    if (code >= 65 && code <= 90) {
      // Get current key character
      const keyChar = index < keyStream.length 
        ? keyStream.charCodeAt(index) - 65 
        : 0;
      
      // Add current plaintext character to key stream
      keyStream += char;
      
      // Apply Autokey encryption (similar to Vigenère)
      return String.fromCharCode(((code - 65 + keyChar) % 26) + 65);
    }
    
    // Handle lowercase letters (ASCII 97-122)
    if (code >= 97 && code <= 122) {
      // Get current key character
      const keyChar = index < keyStream.length 
        ? keyStream.charCodeAt(index) - 65 
        : 0;
      
      // Add uppercase version of current plaintext character to key stream
      keyStream += char.toUpperCase();
      
      // Apply Autokey encryption
      return String.fromCharCode(((code - 97 + keyChar) % 26) + 97);
    }
    
    // Return unchanged for non-alphabetic characters
    return char;
  }).join('');
  
  return {
    result,
    steps: [`Encrypting with AUTOKEY using initial key: ${key}`]
  };
};

export const autokeyDecrypt = (text: string, key: string): EncryptionResult => {
  if (!key || !/^[A-Za-z]+$/.test(key)) {
    throw new Error('Autokey key must contain only letters');
  }
  
  // Normalize key to uppercase
  const normalizedKey = key.toUpperCase();
  
  // Initialize key stream with the provided key
  let keyStream = normalizedKey;
  let result = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);
    
    // Handle uppercase letters (ASCII 65-90)
    if (code >= 65 && code <= 90) {
      // Get current key character
      const keyChar = i < keyStream.length 
        ? keyStream.charCodeAt(i) - 65 
        : 0;
      
      // Decrypt current character
      const decrypted = String.fromCharCode(((code - 65 - keyChar + 26) % 26) + 65);
      
      // Add decrypted character to key stream
      keyStream += decrypted;
      
      result += decrypted;
    }
    // Handle lowercase letters (ASCII 97-122)
    else if (code >= 97 && code <= 122) {
      // Get current key character
      const keyChar = i < keyStream.length 
        ? keyStream.charCodeAt(i) - 65 
        : 0;
      
      // Decrypt current character
      const decrypted = String.fromCharCode(((code - 97 - keyChar + 26) % 26) + 97);
      
      // Add uppercase version of decrypted character to key stream
      keyStream += decrypted.toUpperCase();
      
      result += decrypted;
    }
    // Return unchanged for non-alphabetic characters
    else {
      result += char;
    }
  }
  
  return {
    result,
    steps: [`Decrypting with AUTOKEY using initial key: ${key}`]
  };
};
import { EncryptionResult } from '../types';

export const vigenereEncrypt = (text: string, key: string): EncryptionResult => {
  if (!key || !/^[A-Za-z]+$/.test(key)) {
    throw new Error('Vigenère key must contain only letters');
  }
  
  // Normalize key to uppercase
  const normalizedKey = key.toUpperCase();
  
  const result = text.split('').map((char, index) => {
    const code = char.charCodeAt(0);
    
    // Handle uppercase letters (ASCII 65-90)
    if (code >= 65 && code <= 90) {
      // Get key character (cycling through the key)
      const keyChar = normalizedKey[index % normalizedKey.length];
      const keyShift = keyChar.charCodeAt(0) - 65;
      
      // Apply Vigenère encryption
      return String.fromCharCode(((code - 65 + keyShift) % 26) + 65);
    }
    
    // Handle lowercase letters (ASCII 97-122)
    if (code >= 97 && code <= 122) {
      // Get key character (cycling through the key)
      const keyChar = normalizedKey[index % normalizedKey.length];
      const keyShift = keyChar.charCodeAt(0) - 65;
      
      // Apply Vigenère encryption
      return String.fromCharCode(((code - 97 + keyShift) % 26) + 97);
    }
    
    // Return unchanged for non-alphabetic characters
    return char;
  }).join('');
  
  return {
    result,
    steps: [`Encrypting with VIGENÈRE using key: ${key}`]
  };
};

export const vigenereDecrypt = (text: string, key: string): EncryptionResult => {
  if (!key || !/^[A-Za-z]+$/.test(key)) {
    throw new Error('Vigenère key must contain only letters');
  }
  
  // Normalize key to uppercase
  const normalizedKey = key.toUpperCase();
  
  const result = text.split('').map((char, index) => {
    const code = char.charCodeAt(0);
    
    // Handle uppercase letters (ASCII 65-90)
    if (code >= 65 && code <= 90) {
      // Get key character (cycling through the key)
      const keyChar = normalizedKey[index % normalizedKey.length];
      const keyShift = keyChar.charCodeAt(0) - 65;
      
      // Apply Vigenère decryption
      return String.fromCharCode(((code - 65 - keyShift + 26) % 26) + 65);
    }
    
    // Handle lowercase letters (ASCII 97-122)
    if (code >= 97 && code <= 122) {
      // Get key character (cycling through the key)
      const keyChar = normalizedKey[index % normalizedKey.length];
      const keyShift = keyChar.charCodeAt(0) - 65;
      
      // Apply Vigenère decryption
      return String.fromCharCode(((code - 97 - keyShift + 26) % 26) + 97);
    }
    
    // Return unchanged for non-alphabetic characters
    return char;
  }).join('');
  
  return {
    result,
    steps: [`Decrypting with VIGENÈRE using key: ${key}`]
  };
};
import { EncryptionResult } from '../types';

export const railfenceEncrypt = (text: string, key: string): EncryptionResult => {
  const rails = parseInt(key);
  
  if (isNaN(rails) || rails < 2) {
    throw new Error('Number of rails must be a number greater than 1');
  }
  
  // Remove spaces for clarity
  const plaintext = text.replace(/\s/g, '');
  
  // Create empty rails with explicit typing
  const fence: string[][] = Array(rails).fill(null).map(() => []);
  
  let rail = 0;
  let direction = 1; // 1 for moving down, -1 for moving up
  
  // Place characters in rails
  for (let i = 0; i < plaintext.length; i++) {
    fence[rail].push(plaintext[i]);
    
    rail += direction;
    
    // Change direction when we reach the top or bottom rail
    if (rail === 0 || rail === rails - 1) {
      direction = -direction;
    }
  }
  
  // Read off the rails
  const result = fence.flat().join('');
  
  return {
    result,
    steps: [`Encrypting with RAIL FENCE using ${rails} rails`]
  };
};

export const railfenceDecrypt = (text: string, key: string): EncryptionResult => {
  const rails = parseInt(key);
  
  if (isNaN(rails) || rails < 2) {
    throw new Error('Number of rails must be a number greater than 1');
  }
  
  // Create empty fence with explicit typing
  const fence: string[][] = Array(rails).fill(null).map(() => Array(text.length).fill(''));
  
  let rail = 0;
  let direction = 1;
  
  // Mark fence positions
  for (let i = 0; i < text.length; i++) {
    fence[rail][i] = '*';
    
    rail += direction;
    
    if (rail === 0 || rail === rails - 1) {
      direction = -direction;
    }
  }
  
  // Fill the fence with ciphertext
  let index = 0;
  for (let i = 0; i < rails; i++) {
    for (let j = 0; j < text.length; j++) {
      if (fence[i][j] === '*' && index < text.length) {
        fence[i][j] = text[index++];
      }
    }
  }
  
  // Read off in zigzag pattern
  let result = '';
  rail = 0;
  direction = 1;
  
  for (let i = 0; i < text.length; i++) {
    result += fence[rail][i];
    
    rail += direction;
    
    if (rail === 0 || rail === rails - 1) {
      direction = -direction;
    }
  }
  
  return {
    result,
    steps: [`Decrypting with RAIL FENCE using ${rails} rails`]
  };
};
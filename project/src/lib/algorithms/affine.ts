import { EncryptionResult } from '../types';

// Calculate modular multiplicative inverse
const modInverse = (a: number, m: number): number => {
  // Ensure a is positive
  a = ((a % m) + m) % m;
  
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      return x;
    }
  }
  
  throw new Error(`Modular multiplicative inverse does not exist for a=${a}, m=${m}`);
};

// Check if two numbers are coprime
const areCoprime = (a: number, b: number): boolean => {
  const gcd = (x: number, y: number): number => {
    return y === 0 ? x : gcd(y, x % y);
  };
  
  return gcd(a, b) === 1;
};

export const affineEncrypt = (text: string, key: string): EncryptionResult => {
  // Parse a and b from key
  const [a, b] = key.split(',').map(k => parseInt(k.trim()));
  
  if (isNaN(a) || isNaN(b)) {
    throw new Error('Affine parameters must be numbers in the format "a,b"');
  }
  
  if (!areCoprime(a, 26)) {
    throw new Error('Parameter "a" must be coprime with 26');
  }
  
  const result = text.split('').map(char => {
    const code = char.charCodeAt(0);
    
    // Handle uppercase letters (ASCII 65-90)
    if (code >= 65 && code <= 90) {
      // Apply affine cipher: E(x) = (ax + b) mod 26
      const x = code - 65;
      const encrypted = (a * x + b) % 26;
      return String.fromCharCode(encrypted + 65);
    }
    
    // Handle lowercase letters (ASCII 97-122)
    if (code >= 97 && code <= 122) {
      // Apply affine cipher: E(x) = (ax + b) mod 26
      const x = code - 97;
      const encrypted = (a * x + b) % 26;
      return String.fromCharCode(encrypted + 97);
    }
    
    // Return unchanged for non-alphabetic characters
    return char;
  }).join('');
  
  return {
    result,
    steps: [`Encrypting with AFFINE using parameters a=${a}, b=${b}`]
  };
};

export const affineDecrypt = (text: string, key: string): EncryptionResult => {
  // Parse a and b from key
  const [a, b] = key.split(',').map(k => parseInt(k.trim()));
  
  if (isNaN(a) || isNaN(b)) {
    throw new Error('Affine parameters must be numbers in the format "a,b"');
  }
  
  if (!areCoprime(a, 26)) {
    throw new Error('Parameter "a" must be coprime with 26');
  }
  
  // Calculate modular multiplicative inverse of a
  const aInverse = modInverse(a, 26);
  
  const result = text.split('').map(char => {
    const code = char.charCodeAt(0);
    
    // Handle uppercase letters (ASCII 65-90)
    if (code >= 65 && code <= 90) {
      // Apply affine cipher decryption: D(y) = a^-1 * (y - b) mod 26
      const y = code - 65;
      const decrypted = (aInverse * (y - b + 26)) % 26;
      return String.fromCharCode(decrypted + 65);
    }
    
    // Handle lowercase letters (ASCII 97-122)
    if (code >= 97 && code <= 122) {
      // Apply affine cipher decryption: D(y) = a^-1 * (y - b) mod 26
      const y = code - 97;
      const decrypted = (aInverse * (y - b + 26)) % 26;
      return String.fromCharCode(decrypted + 97);
    }
    
    // Return unchanged for non-alphabetic characters
    return char;
  }).join('');
  
  return {
    result,
    steps: [`Decrypting with AFFINE using parameters a=${a}, b=${b}`]
  };
};
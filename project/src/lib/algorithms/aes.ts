// filepath: c:\Users\Islam Oshallah\OneDrive\Desktop\project\src\lib\algorithms\aes.ts
import { EncryptionResult } from '../types';

// Note: This is a simplified implementation for demonstration purposes.
// For production, use a proper encryption library like CryptoJS.

export interface AesOptions {
  key: string;
  iv?: string;
  useRandomIv?: boolean;
}

export const aesEncrypt = async (text: string, options: AesOptions): Promise<EncryptionResult> => {
  try {
    const { key, iv: customIv, useRandomIv = true } = options;
    
    // Convert key to buffer and ensure it's the right length
    const keyBuffer = new TextEncoder().encode(key.padEnd(32, '0').slice(0, 32));
      // Generate initialization vector or use provided one
    let iv: Uint8Array;
    
    if (!useRandomIv && customIv) {
      // Check if custom IV has exactly 16 characters
      if (customIv.length !== 16) {
        throw new Error('Custom IV must be exactly 16 characters long');
      }
      
      // Convert custom IV string to bytes
      const ivStr = customIv.slice(0, 16);
      iv = new TextEncoder().encode(ivStr);
    } else {
      // Generate random IV
      iv = crypto.getRandomValues(new Uint8Array(16));
    }
    
    // Convert text to buffer
    const textBuffer = new TextEncoder().encode(text);
    
    // Import key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-CBC', length: 256 },
      false,
      ['encrypt']
    );
    
    // Encrypt
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-CBC', iv },
      cryptoKey,
      textBuffer
    );
    
    // Convert to base64
    const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
    const ivArray = Array.from(iv);
    const combined = [...ivArray, ...encryptedArray];
    const base64 = btoa(String.fromCharCode(...combined));
    
    const ivDesc = useRandomIv 
      ? 'with random IV' 
      : `with custom IV: ${customIv?.slice(0, 3)}${'*'.repeat((customIv?.length || 0) - 6)}${customIv?.slice(-3)}`;
    
    return {
      result: base64,
      steps: [`Encrypting with AES using key: ${key.slice(0, 3)}${'*'.repeat(key.length - 6)}${key.slice(-3)} ${ivDesc}`]
    };
  } catch (error) {
    console.error('AES Encryption Error:', error);
    throw new Error('AES encryption failed. Check your key and try again.');
  }
};

export const aesDecrypt = async (text: string, options: AesOptions): Promise<EncryptionResult> => {
  try {
    const { key, iv: customIv } = options;
    
    // Convert key to buffer
    const keyBuffer = new TextEncoder().encode(key.padEnd(32, '0').slice(0, 32));
      // First attempt: Try standard Base64-encoded format with embedded IV
    if (/^[A-Za-z0-9+/=]+$/.test(text)) {
      try {
        // Try to decode base64
        const combined = new Uint8Array(
          atob(text)
            .split('')
            .map(char => char.charCodeAt(0))
        );
        
        // Check if there's enough data (at least 16 bytes for IV)
        if (combined.length >= 16) {
          // Extract IV and encrypted data - IV is always stored in the first 16 bytes
          const iv = combined.slice(0, 16);
          const encryptedBuffer = combined.slice(16);
          
          // Import key
          const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyBuffer,
            { name: 'AES-CBC', length: 256 },
            false,
            ['decrypt']
          );
          
          // Try to decrypt
          try {
            const decryptedBuffer = await crypto.subtle.decrypt(
              { name: 'AES-CBC', iv },
              cryptoKey,
              encryptedBuffer
            );
            
            // Convert to text
            const decryptedText = new TextDecoder().decode(decryptedBuffer);
            
            return {
              result: decryptedText,
              steps: [`Decrypting with AES using key: ${key.slice(0, 3)}${'*'.repeat(key.length - 6)}${key.slice(-3)} (successfully decoded embedded IV)`]
            };
          } catch (decryptError) {
            // Failed with embedded IV, will try fallback methods
            console.warn('AES decryption with embedded IV failed:', decryptError);
          }
        }
      } catch (base64Error) {
        // Base64 decoding failed, will try fallback
        console.warn('Base64 decoding failed:', base64Error);
      }
    } 
    
    // Add a special case for text output from RSA or other text-based algorithms
    try {
      // For a simple text input (likely output from RSA or Shift), extract bytes and try to decrypt
      const textBytes = new TextEncoder().encode(text);
      
      if (textBytes.length >= 16) {
        // Extract first 16 bytes as IV
        const iv = textBytes.slice(0, 16);
        const encryptedBuffer = textBytes.slice(16);
        
        // Import key
        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: 'AES-CBC', length: 256 },
          false,
          ['decrypt']
        );
        
        try {
          const decryptedBuffer = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv },
            cryptoKey,
            encryptedBuffer
          );
          
          const decryptedText = new TextDecoder().decode(decryptedBuffer);
          
          return {
            result: decryptedText,
            steps: [
              `Decrypting with AES using key: ${key.slice(0, 3)}${'*'.repeat(key.length - 6)}${key.slice(-3)}`,
              `Successfully processed text output from another algorithm (RSA/Shift)`
            ]
          };
        } catch (textDecryptError) {
          console.warn('Text-mode AES decryption failed:', textDecryptError);
        }
      }
    } catch (textModeError) {
      console.warn('Text mode processing failed:', textModeError);
    }
    
    // If we have a custom IV and the standard approach failed, try with the custom IV
    if (customIv && customIv.length === 16) {
      try {
        // Convert custom IV string to bytes
        const iv = new TextEncoder().encode(customIv);
        
        // Try various potential formats for the ciphertext
        let encryptedBuffer: Uint8Array | null = null;
        
        // Try 1: Treat as raw base64 (without embedded IV)
        try {
          encryptedBuffer = new Uint8Array(
            atob(text)
              .split('')
              .map(char => char.charCodeAt(0))
          );
        } catch (e) {
          // Not valid base64, try next approach
        }
          // Try 2: Treat as hex string
        if (!encryptedBuffer && /^[0-9A-Fa-f]+$/.test(text.replace(/\s/g, ''))) {
          const hex = text.replace(/\s/g, '');
          encryptedBuffer = new Uint8Array(
            hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
          );
        }        // Try 3: Handle numeric input from other algorithms (e.g., RSA decryption output)
        if (!encryptedBuffer && /^[0-9\s]+$/.test(text)) {
          try {
            // Convert space-separated numbers to binary data
            const numbers = text.split(/\s+/).map(n => parseInt(n));
            
            // Different approaches for numeric data
            
            // Approach 1: Treat numbers as ASCII/Unicode code points
            const asciiChars = numbers.map(n => {
              // Handle ASCII range specifically (common for RSA output)
              if (n >= 0 && n <= 255) {
                return String.fromCharCode(n);
              } else {
                // For larger numbers, try modulo 256 to get a valid byte
                return String.fromCharCode(n % 256);
              }
            }).join('');
            
            // Try base64 decoding if the ASCII looks like base64
            if (/^[A-Za-z0-9+/=]+$/.test(asciiChars)) {
              try {
                const base64Decoded = atob(asciiChars);
                encryptedBuffer = new TextEncoder().encode(base64Decoded);
              } catch (base64Error) {
                // If base64 decoding fails, continue with the ASCII approach
                encryptedBuffer = new TextEncoder().encode(asciiChars);
              }
            } else {
              encryptedBuffer = new TextEncoder().encode(asciiChars);
            }
            
            // Approach 2: Treat numbers directly as byte values
            if (!encryptedBuffer || encryptedBuffer.length === 0) {
              encryptedBuffer = new Uint8Array(numbers.map(n => n % 256));
            }
          } catch (e) {
            console.warn('Failed to parse numeric input:', e);
          }
        }
        
        // If we have something to try decrypting, attempt it
        if (encryptedBuffer) {
          const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyBuffer,
            { name: 'AES-CBC', length: 256 },
            false,
            ['decrypt']
          );
          
          const decryptedBuffer = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv },
            cryptoKey,
            encryptedBuffer
          );
          
          const decryptedText = new TextDecoder().decode(decryptedBuffer);
          
          return {
            result: decryptedText,
            steps: [`Decrypting with AES using key: ${key.slice(0, 3)}${'*'.repeat(key.length - 6)}${key.slice(-3)} and custom IV`]
          };
        }
      } catch (fallbackError) {
        console.warn('AES decryption with custom IV fallback failed:', fallbackError);
      }
    }    // If all attempts failed, try one last approach for formats produced by other algorithms
    try {
      // As a last resort, try to treat the input as UTF-8 encoded bytes
      let textBytes = new TextEncoder().encode(text);
      let iv: Uint8Array;
      
      if (customIv && customIv.length === 16) {
        iv = new TextEncoder().encode(customIv);
      } else if (textBytes.length >= 16) {
        // Use first 16 bytes as IV if no custom IV
        iv = textBytes.slice(0, 16);
        textBytes = textBytes.slice(16);
      } else {
        throw new Error("Input too short and no custom IV provided");
      }
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-CBC', length: 256 },
        false,
        ['decrypt']
      );
      
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv },
        cryptoKey,
        textBytes
      );
      
      const decryptedText = new TextDecoder().decode(decryptedBuffer);
      
      return {
        result: decryptedText,
        steps: [`Decrypting with AES using key: ${key.slice(0, 3)}${'*'.repeat(key.length - 6)}${key.slice(-3)} (last resort method)`]
      };
    } catch (lastResortError) {
      console.warn('Last resort AES decryption failed:', lastResortError);
    }
    
    // If all attempts failed, throw a helpful error
    throw new Error(
      'Invalid AES ciphertext format. Check that:\n' +
      '1. You are decrypting in the correct order (reverse of encryption)\n' +
      '2. The key and IV (if custom) are correct\n' +
      '3. The text is a valid AES-encrypted string'
    );
  } catch (error: any) {
    console.error('AES Decryption Error:', error);
    const errorMessage = error.message || 'AES decryption failed. Check your key and ciphertext format.';
    throw new Error(`${errorMessage} This could indicate that you're trying to decrypt in the wrong order. For multi-layer decryption, remember to decrypt in the reverse order of encryption.`);
  }
};

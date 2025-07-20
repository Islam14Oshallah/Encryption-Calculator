import { AlgorithmType, AlgorithmInfo } from './types';

export const getAlgorithmInfo = (algorithm: AlgorithmType): AlgorithmInfo => {
  switch (algorithm) {
    case 'aes':
      return {
        keyLabel: 'Secret Key',
        inputType: 'text',
        placeholder: 'Enter 16, 24, or 32 character key',
        helpText: 'AES requires a key that is 16, 24, or 32 characters long for 128, 192, or 256-bit encryption.'
      };
    case 'autokey':
      return {
        keyLabel: 'Keyword',
        inputType: 'text',
        placeholder: 'Enter keyword',
        helpText: 'Enter a single keyword (letters only) to use as the initial key.'
      };
    case 'shift':
      return {
        keyLabel: 'Shift Value',
        inputType: 'number',
        placeholder: 'Enter shift value (e.g., 3)',
        helpText: 'Enter a number to shift each character by (positive for right shift, negative for left shift).'
      };
    case 'railfence':
      return {
        keyLabel: 'Number of Rails',
        inputType: 'number',
        placeholder: 'Enter number of rails',
        helpText: 'Enter the number of rails (rows) to use in the rail fence pattern.'
      };
    case 'vigenere':
      return {
        keyLabel: 'Keyword',
        inputType: 'text',
        placeholder: 'Enter keyword',
        helpText: 'Enter a keyword (letters only) that will be repeated to match the length of the input text.'
      };
    case 'affine':
      return {
        keyLabel: 'Parameters (a,b)',
        inputType: 'text',
        placeholder: 'Enter as a,b (e.g., 5,8)',
        helpText: 'Enter two numbers separated by a comma. "a" must be coprime with 26 (common values: 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25).'
      };
    default:
      return {
        keyLabel: 'Key',
        inputType: 'text',
        placeholder: '',
        helpText: ''
      };
  }
};

export const isValidKey = (algorithm: AlgorithmType, key: string): boolean => {
  switch (algorithm) {
    case 'aes':
      // AES key must be 16, 24, or 32 characters
      return [16, 24, 32].includes(key.length);
    case 'shift':
      // Must be a valid number
      return !isNaN(Number(key));
    case 'railfence':
      // Must be a positive integer
      return !isNaN(Number(key)) && Number(key) > 1;
    case 'vigenere':
    case 'autokey':
      // Must contain only letters
      return /^[A-Za-z]+$/.test(key);
    case 'affine':
      // Must be two numbers separated by comma, first number must be coprime with 26
      const params = key.split(',').map(p => parseInt(p.trim()));
      if (params.length !== 2 || isNaN(params[0]) || isNaN(params[1])) return false;
      
      // Check if a is coprime with 26
      const validA = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
      return validA.includes(params[0]);
    default:
      return true;
  }
};
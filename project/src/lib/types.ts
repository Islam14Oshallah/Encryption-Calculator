export type AlgorithmType = 
  | 'none'
  | 'aes'
  | 'autokey'
  | 'shift'
  | 'railfence'
  | 'vigenere'
  | 'affine';

export interface EncryptionLayerType {
  id: number;
  algorithm: AlgorithmType;
  key: string;
  iv?: string;
  useRandomIv?: boolean;
  removing?: boolean; // Add this property for animation
}

export interface EncryptionResult {
  result: string;
  steps: string[];
}

export interface AlgorithmInfo {
  keyLabel: string;
  inputType: string;
  placeholder: string;
  helpText: string;
}
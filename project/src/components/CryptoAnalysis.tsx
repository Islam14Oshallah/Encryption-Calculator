import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface CryptoAnalysisProps {
  activeLayers: {
    algorithm: string;
    key: string;
  }[];
}

// Original data as fallback
const cryptanalysisData = {
  shift: {
    title: "Caesar/Shift Cipher Cryptanalysis",
    vulnerabilities: [
        "Brute Force Attack: With only 25 possible shifts, an attacker can try all possibilities in seconds using modern computers.",
          "Frequency Analysis: By analyzing letter frequencies in the ciphertext and comparing to known language patterns (e.g., 'E' is the most common letter in English).",
          "Known Plaintext: If any portion of the plaintext is known, the key can be immediately determined by calculating the shift."
    ],
        example: `Example: For the ciphertext "WKLV LV D VHFUHW", trying all 25 shifts will quickly reveal the plaintext "THIS IS A SECRET". Alternatively, noting that 'V' appears three times might suggest it represents a common English letter like 'S'.`,
        mitigation: "Caesar cipher should only be used for educational purposes or recreational puzzles, never for secure communications. Modern encryption like AES should be used instead."
  },
  vigenere: {
    title: "Vigenère Cipher Cryptanalysis",
    vulnerabilities: [
        "Kasiski Examination: Identifies repeated patterns in ciphertext to determine key length by finding the greatest common divisor of distances between repetitions.",
          "Index of Coincidence: Statistical technique to determine key length by analyzing character distribution properties.",
          "Frequency Analysis: Once key length is known, each position can be analyzed as a Caesar cipher.",
          "Key Length Vulnerabilities: Short keys are particularly vulnerable as they create recognizable patterns in the ciphertext."
    ],
      example: `Example: In the ciphertext "LXFOPVEFRNHR", if the key length is determined to be 3, every third letter is encrypted with the same shift. Analyzing the set {L,O,F,H} separately from {X,P,R,R} and {F,V,N} allows breaking each as a simple Caesar cipher.`,
      mitigation: "Use modern cryptographic algorithms. If Vigenère must be used (for historical purposes), employ keys that are: at least as long as the message, truly random, and never reused."
  },
  autokey: {
    title: "Autokey Cipher Cryptanalysis",
    vulnerabilities: [
      "Known-Plaintext Attack: If a portion of the plaintext is known, the key can be determined.",
      "Statistical Analysis: Similar to Vigenère but more complex due to the key variation.",
      "Ciphertext-Only Attack: Specialized techniques can recover portions of the key."
    ],
    example: "Example: If the first few characters of the plaintext are known, the key can be derived progressively.",
    mitigation: "Use modern encryption algorithms. Like other classical ciphers, Autokey is not secure for sensitive data."
  },
  railfence: {
    title: "Rail Fence Cipher Cryptanalysis",
    vulnerabilities: [
      "Brute Force: Testing various key lengths (number of rails).",
      "Pattern Recognition: Identifying patterns in the ciphertext that match rail fence structures.",
      "Statistical Analysis: Looking for patterns that match language characteristics."
    ],
    example: "Example: For a text of reasonable length, there are only a few possible rail counts (typically 2-10) to test.",
    mitigation: "Use multiple rounds of transposition with different keys, or combine with substitution ciphers."
  },
  affine: {
    title: "Affine Cipher Cryptanalysis",
    vulnerabilities: [
      "Known-Plaintext Attack: Two plaintext-ciphertext pairs are sufficient to determine the key.",
      "Frequency Analysis: Similar to simple substitution ciphers.",
      "Brute Force: Only 12 possible values for 'a' parameter (1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25) in modulo 26 system."
    ],
    example: "Example: For English text, frequency analysis of the letter 'E' can quickly narrow down possible keys.",
    mitigation: "Use modern encryption algorithms. Affine ciphers are easily broken with basic cryptanalysis techniques."
  },
  aes: {
    title: "AES Cryptanalysis",
        vulnerabilities: [
          "Side-Channel Attacks: Analyzing timing variations, power consumption, electromagnetic emissions, or acoustic signals to extract key information.",
          "Implementation Vulnerabilities: Flaws in software/hardware implementations rather than the algorithm itself, such as weak random number generators, key management issues, or buffer overflows.",
          "Padding Oracle Attacks: When using certain block cipher modes like CBC without proper authentication, allowing attackers to decrypt data without knowing the key.",
          "Related-Key Attacks: Theoretical weaknesses when related keys are used, though impractical against full AES rounds.",
          "Custom IV Reuse: Reusing the same initialization vector with the same key exposes patterns in encrypted data, especially in CBC and CTR modes."
        ],
        example: `Example: In a cache timing attack against AES, an attacker measures the time taken for encryption operations that use lookup tables. By collecting timing data across many encryptions, they can infer cache access patterns that reveal key bits. In 2020, researchers demonstrated a "Raccoon Attack" against TLS that could recover session keys when using specific Diffie-Hellman parameters.`,
        mitigation: "Use hardware-accelerated AES implementations when available, as they're resistant to many timing attacks. Implement authenticated encryption modes like AES-GCM, ensure IVs are randomly generated for each encryption, follow NIST guidelines, use secure key derivation functions (PBKDF2, Argon2) for password-based keys, and keep implementations up-to-date with security patches."
  },
};

// Function to simulate loading data (similar to ExpandedCryptoAnalysis)
const loadCryptanalysisData = async () => {
  try {
    // Simulate an async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Additional mappings for algorithm name variations
    const algorithmMappings = {
      'shift': 'caesar',
      'caesar': 'shift',
      'autokey': 'vigenere',
      'railfence': 'transposition',
      'affine': 'substitution',
    };
    
    // Return combined data
    return {
      ...cryptanalysisData,
      algorithmMappings
    };
  } catch (e) {
    console.error("Failed to load cryptanalysis data:", e);
    throw e;
  }
};

const CryptoAnalysis: React.FC<CryptoAnalysisProps> = ({ activeLayers }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await loadCryptanalysisData();
        setAnalysisData(data);
        setError(null);
      } catch (err) {
        console.error("Error loading cryptanalysis data:", err);
        setError("Failed to load cryptanalysis data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const getAnalysisForAlgorithm = (algorithm: string) => {
    // First check direct match
    if (analysisData && analysisData[algorithm]) {
      return analysisData[algorithm];
    }
    
    // Then check mappings
    if (analysisData && analysisData.algorithmMappings && analysisData.algorithmMappings[algorithm]) {
      const mappedAlgorithm = analysisData.algorithmMappings[algorithm];
      if (analysisData[mappedAlgorithm]) {
        return analysisData[mappedAlgorithm];
      }
    }
    
    // Default to shift/caesar if nothing found
    return analysisData ? (analysisData.shift || analysisData.caesar) : null;
  };

  // Always render the button even if no layers or data
  return (
    <>
      <div className="mt-8 mb-4 flex justify-center">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md transform hover:scale-105 active:scale-95"
          disabled={isLoading}
        >
          <AlertCircle className="w-5 h-5 mr-2" />
          {isLoading ? 'Loading Analysis...' : 'View Security Analysis'}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-3xl max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-500">Security Analysis</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-4 mb-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                <p>{error}</p>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
              </div>
            ) : activeLayers.length === 0 ? (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                <p>No encryption layers are currently active. Add layers to see their security analysis.</p>
              </div>
            ) : !analysisData ? (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                <p>Security analysis data is not available. Please try again later.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeLayers.map((layer, index) => {
                  const analysis = getAnalysisForAlgorithm(layer.algorithm);
                  
                  if (!analysis) return (
                    <div key={index} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <p>No security analysis available for {layer.algorithm}</p>
                    </div>
                  );
                  
                  return (
                    <div 
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-slate-700 hover-scale"
                      style={{animationDelay: `${index * 150}ms`}}
                    >
                      <h3 className="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">{analysis.title}</h3>
                      
                      <h4 className="font-medium mt-3 mb-1 dark:text-white">Key Vulnerabilities:</h4>
                      <ul className="list-disc pl-5 dark:text-gray-300">
                        {analysis.vulnerabilities.map((vuln: string, i: number) => (
                          <li key={i} className="mb-1">{vuln}</li>
                        ))}
                      </ul>
                      
                      <h4 className="font-medium mt-3 mb-1 dark:text-white">Example:</h4>
                      <div className="dark:text-gray-300 whitespace-pre-line">{analysis.example}</div>
                      
                      <h4 className="font-medium mt-3 mb-1 dark:text-white">Mitigation Strategies:</h4>
                      <div className="dark:text-gray-300 whitespace-pre-line">{analysis.mitigation}</div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 dark:text-white transform hover:scale-105 active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CryptoAnalysis;

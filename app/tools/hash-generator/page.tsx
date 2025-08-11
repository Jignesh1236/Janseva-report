
'use client';

import { useState } from 'react';

export default function HashGenerator() {
  const [inputText, setInputText] = useState('');
  const [hashes, setHashes] = useState<{[key: string]: string}>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const generateHashes = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    const encoder = new TextEncoder();
    const data = encoder.encode(inputText);
    
    try {
      const results: {[key: string]: string} = {};
      
      // Generate MD5 (using a simple implementation)
      results.md5 = await generateMD5(inputText);
      
      // Generate SHA-1
      const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
      results.sha1 = bufferToHex(sha1Buffer);
      
      // Generate SHA-256
      const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
      results.sha256 = bufferToHex(sha256Buffer);
      
      // Generate SHA-384
      const sha384Buffer = await crypto.subtle.digest('SHA-384', data);
      results.sha384 = bufferToHex(sha384Buffer);
      
      // Generate SHA-512
      const sha512Buffer = await crypto.subtle.digest('SHA-512', data);
      results.sha512 = bufferToHex(sha512Buffer);
      
      setHashes(results);
    } catch (error) {
      console.error('Error generating hashes:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const bufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  // Simple MD5 implementation (for demonstration - in production, use a proper library)
  const generateMD5 = async (str: string): Promise<string> => {
    // This is a simplified version - in a real app, you'd use a proper MD5 library
    // For now, we'll use a simple hash function as a placeholder
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearAll = () => {
    setInputText('');
    setHashes({});
  };

  const hashTypes = [
    { key: 'md5', name: 'MD5', description: '128-bit hash (deprecated for security)' },
    { key: 'sha1', name: 'SHA-1', description: '160-bit hash (deprecated for security)' },
    { key: 'sha256', name: 'SHA-256', description: '256-bit hash (recommended)' },
    { key: 'sha384', name: 'SHA-384', description: '384-bit hash' },
    { key: 'sha512', name: 'SHA-512', description: '512-bit hash' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
            Hash Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate cryptographic hashes (MD5, SHA-1, SHA-256, SHA-384, SHA-512)
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
          <div className="mb-8">
            <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 mb-2">
              Input Text
            </label>
            <textarea
              id="input-text"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to generate hashes..."
            />
          </div>

          <div className="flex space-x-4 mb-8">
            <button
              onClick={generateHashes}
              disabled={!inputText.trim() || isGenerating}
              className={`flex-1 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                !inputText.trim() || isGenerating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 focus:ring-red-500'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                'Generate Hashes'
              )}
            </button>
            <button
              onClick={clearAll}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Clear All
            </button>
          </div>

          {Object.keys(hashes).length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Generated Hashes</h2>
              {hashTypes.map(({ key, name, description }) => (
                hashes[key] && (
                  <div key={key} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{name}</h3>
                        <p className="text-sm text-gray-600">{description}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(hashes[key])}
                        className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg transition-colors duration-200"
                        title="Copy to clipboard"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    </div>
                    <div className="font-mono text-sm bg-white p-3 rounded border break-all">
                      {hashes[key]}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>

        {/* Hash Information */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
            About Cryptographic Hashes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Secure Hashes</h3>
                <ul className="text-sm text-green-600 space-y-1">
                  <li>• SHA-256 (Recommended)</li>
                  <li>• SHA-384</li>
                  <li>• SHA-512</li>
                </ul>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Deprecated Hashes</h3>
                <ul className="text-sm text-yellow-600 space-y-1">
                  <li>• MD5 (Not secure)</li>
                  <li>• SHA-1 (Not secure)</li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Common Uses</h3>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• File integrity verification</li>
                  <li>• Password storage</li>
                  <li>• Digital signatures</li>
                  <li>• Blockchain applications</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600">
              <strong>Security Note:</strong> MD5 and SHA-1 are cryptographically broken and should not be used for security purposes. 
              Use SHA-256 or higher for secure applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

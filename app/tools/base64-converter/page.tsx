
"use client";
import React, { useState } from 'react';
import { ArrowUpDown, Copy, Download, Upload } from 'lucide-react';

export default function Base64Converter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [fileName, setFileName] = useState('');

  const handleTextConversion = () => {
    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
      }
    } catch (error) {
      setOutput('Error: Invalid input for ' + mode + 'ing');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    
    if (mode === 'encode') {
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        bytes.forEach(byte => binary += String.fromCharCode(byte));
        const encoded = btoa(binary);
        setOutput(encoded);
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInput(text);
        try {
          const decoded = atob(text);
          setOutput('File decoded successfully. Use download to save.');
        } catch (error) {
          setOutput('Error: Invalid Base64 file content');
        }
      };
      reader.readAsText(file);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadResult = () => {
    if (mode === 'decode' && input) {
      try {
        const decoded = atob(input);
        const bytes = new Uint8Array(decoded.length);
        for (let i = 0; i < decoded.length; i++) {
          bytes[i] = decoded.charCodeAt(i);
        }
        const blob = new Blob([bytes]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || 'decoded-file';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        alert('Error downloading file');
      }
    } else {
      const blob = new Blob([output], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const switchMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput('');
    setOutput('');
    setFileName('');
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setFileName('');
  };

  React.useEffect(() => {
    if (inputType === 'text' && input) {
      handleTextConversion();
    }
  }, [input, mode, inputType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Base64 Encoder/Decoder</h1>
          <p className="text-lg text-gray-600">Encode and decode Base64 strings and files</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={switchMode}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowUpDown className="h-5 w-5 mr-2" />
              Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
            </button>
            
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setInputType('text')}
                className={`px-4 py-2 text-sm font-medium border rounded-l-md ${
                  inputType === 'text'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Text
              </button>
              <button
                onClick={() => setInputType('file')}
                className={`px-4 py-2 text-sm font-medium border-t border-b border-r rounded-r-md ${
                  inputType === 'file'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                File
              </button>
            </div>
            
            <button
              onClick={clearAll}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Input ({mode === 'encode' ? 'Plain Text' : 'Base64'})
                </h3>
                {inputType === 'file' && (
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-input"
                  />
                )}
              </div>
              
              {inputType === 'text' ? (
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Enter ${mode === 'encode' ? 'text to encode' : 'Base64 to decode'}...`}
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                />
              ) : (
                <div className="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <label
                      htmlFor="file-input"
                      className="cursor-pointer text-blue-600 hover:text-blue-500"
                    >
                      <span className="mt-2 block text-sm font-medium">
                        {fileName ? `Selected: ${fileName}` : 'Click to upload file'}
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Output Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Output ({mode === 'encode' ? 'Base64' : 'Plain Text'})
                </h3>
                <div className="flex space-x-2">
                  {output && (
                    <>
                      <button
                        onClick={() => copyToClipboard(output)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </button>
                      <button
                        onClick={downloadResult}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <textarea
                value={output}
                readOnly
                placeholder={`${mode === 'encode' ? 'Encoded' : 'Decoded'} result will appear here...`}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono text-sm"
              />
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2">How to use:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• <strong>Encode:</strong> Convert text or files to Base64 format</li>
              <li>• <strong>Decode:</strong> Convert Base64 back to original format</li>
              <li>• Switch between text input and file upload</li>
              <li>• Use copy button to copy results to clipboard</li>
              <li>• Download decoded files or save encoded text</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

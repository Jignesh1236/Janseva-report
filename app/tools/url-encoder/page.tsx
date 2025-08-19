'use client';

import { useState } from 'react';

export default function UrlEncoder() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');

  const language = 'en';
  const t = {
    about: 'About',
    services: 'Services',
    contact: 'Contact',
    visitCenter: 'Visit Center',
    onlineTools: 'Online Tools',
    ourServices: 'Our Services',
    helpingYou: 'Helping You',
    needAssistance: 'Need Assistance',
    jansevakendra: 'Janseva Kendra (Private)',
    offers: 'Offers',
  };

  const encodeUrl = () => {
    try {
      setError('');
      setOutputText(encodeURIComponent(inputText));
    } catch (err) {
      setError('Error encoding URL');
    }
  };

  const decodeUrl = () => {
    try {
      setError('');
      setOutputText(decodeURIComponent(inputText));
    } catch (err) {
      setError('Error decoding URL. Please check if the input is a valid encoded URL.');
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setError('');
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              URL Encoder/Decoder
            </h1>
            <p className="text-lg text-gray-600">
              Encode or decode URLs with ease
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <label
                htmlFor="input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Input URL
              </label>
              <textarea
                id="input"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter URL to encode or decode..."
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <button
                onClick={encodeUrl}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Encode URL
              </button>
              <button
                onClick={decodeUrl}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Decode URL
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Clear All
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="output"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Output URL
              </label>
              <textarea
                id="output"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={outputText}
                readOnly
                placeholder="Encoded or decoded URL will appear here..."
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(outputText);
                }}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About URL Encoding</h2>
            <div className="prose prose-sm text-gray-600">
              <p>
                URL encoding converts special characters into a format that can be transmitted over the Internet.
                For example:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Spaces are converted to %20</li>
                <li>Special characters like &, ?, = are converted to their percent-encoded equivalents</li>
                <li>Non-ASCII characters are encoded using UTF-8 and then percent-encoded</li>
              </ul>
              <p className="mt-2">
                This tool helps you encode URLs for safe transmission and decode them back to their original form.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
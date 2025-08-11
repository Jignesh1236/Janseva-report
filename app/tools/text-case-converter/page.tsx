'use client';

import { useState } from 'react';

export default function TextCaseConverter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

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

  const convertCase = (type: string) => {
    switch (type) {
      case 'uppercase':
        setOutputText(inputText.toUpperCase());
        break;
      case 'lowercase':
        setOutputText(inputText.toLowerCase());
        break;
      case 'titlecase':
        setOutputText(
          inputText
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        );
        break;
      case 'sentencecase':
        setOutputText(
          inputText
            .toLowerCase()
            .split('. ')
            .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1))
            .join('. ')
        );
        break;
      case 'alternating':
        setOutputText(
          inputText
            .split('')
            .map((char, index) =>
              index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
            )
            .join('')
        );
        break;
      default:
        setOutputText(inputText);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Text Case Converter
            </h1>
            <p className="text-lg text-gray-600">
              Convert your text to different cases with ease
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <label
                htmlFor="input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Input Text
              </label>
              <textarea
                id="input"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here..."
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
              <button
                onClick={() => convertCase('uppercase')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                UPPERCASE
              </button>
              <button
                onClick={() => convertCase('lowercase')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                lowercase
              </button>
              <button
                onClick={() => convertCase('titlecase')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Title Case
              </button>
              <button
                onClick={() => convertCase('sentencecase')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sentence case
              </button>
              <button
                onClick={() => convertCase('alternating')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                aLtErNaTiNg
              </button>
            </div>

            <div>
              <label
                htmlFor="output"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Output Text
              </label>
              <textarea
                id="output"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={outputText}
                readOnly
                placeholder="Converted text will appear here..."
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(outputText);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
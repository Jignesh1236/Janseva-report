
"use client";
import React, { useState } from 'react';
import { Copy, RefreshCw, FileText } from 'lucide-react';

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generatedText, setGeneratedText] = useState('');

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const generateText = () => {
    let result = '';
    
    for (let p = 0; p < paragraphs; p++) {
      let paragraph = '';
      let wordsToUse = [...loremWords];
      
      for (let w = 0; w < wordsPerParagraph; w++) {
        if (w === 0 && p === 0 && startWithLorem) {
          paragraph += 'Lorem';
        } else if (w === 1 && p === 0 && startWithLorem) {
          paragraph += ' ipsum';
        } else {
          if (wordsToUse.length === 0) {
            wordsToUse = [...loremWords];
          }
          const randomIndex = Math.floor(Math.random() * wordsToUse.length);
          const word = wordsToUse.splice(randomIndex, 1)[0];
          
          if (w === 0) {
            paragraph += word.charAt(0).toUpperCase() + word.slice(1);
          } else {
            paragraph += ' ' + word;
          }
        }
      }
      
      paragraph += '.';
      result += paragraph;
      
      if (p < paragraphs - 1) {
        result += '\n\n';
      }
    }
    
    setGeneratedText(result);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      alert('Text copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const wordCount = generatedText.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = generatedText.length;

  React.useEffect(() => {
    generateText();
  }, [paragraphs, wordsPerParagraph, startWithLorem]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Lorem Ipsum Generator</h1>
          <p className="text-lg text-gray-600">Generate placeholder text for your designs</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Paragraphs
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={paragraphs}
                onChange={(e) => setParagraphs(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Words per Paragraph
              </label>
              <input
                type="number"
                min="10"
                max="200"
                value={wordsPerParagraph}
                onChange={(e) => setWordsPerParagraph(parseInt(e.target.value) || 50)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Start with "Lorem ipsum"
                </span>
              </label>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center mb-8">
            <button
              onClick={generateText}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Generate New Text
            </button>
          </div>

          {/* Generated Text */}
          {generatedText && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{wordCount} words</span>
                  <span>{charCount} characters</span>
                  <span>{paragraphs} paragraphs</span>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Text
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border">
                <textarea
                  value={generatedText}
                  onChange={(e) => setGeneratedText(e.target.value)}
                  className="w-full h-96 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Generated text will appear here..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

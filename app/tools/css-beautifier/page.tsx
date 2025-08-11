
"use client";
import React, { useState } from 'react';

export default function CSSBeautifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [indentType, setIndentType] = useState('spaces');

  const beautifyCSS = () => {
    try {
      const formatted = formatCSS(input, indentSize, indentType);
      setOutput(formatted);
    } catch (error) {
      alert('Error formatting CSS. Please check your input.');
    }
  };

  const minifyCSS = () => {
    try {
      const minified = input
        .replace(/\/\*.*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
        .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
        .replace(/;\s*/g, ';') // Remove spaces after semicolon
        .replace(/,\s*/g, ',') // Remove spaces after comma
        .replace(/:\s*/g, ':') // Remove spaces after colon
        .trim();
      setOutput(minified);
    } catch (error) {
      alert('Error minifying CSS. Please check your input.');
    }
  };

  const formatCSS = (css: string, indentSize: number, indentType: string): string => {
    const indent = indentType === 'spaces' ? ' '.repeat(indentSize) : '\t'.repeat(indentSize);
    let formatted = '';
    let level = 0;
    let inComment = false;
    
    // Remove existing formatting
    css = css.replace(/\s+/g, ' ').trim();
    
    for (let i = 0; i < css.length; i++) {
      const char = css[i];
      const nextChar = css[i + 1];
      const prevChar = css[i - 1];
      
      // Handle comments
      if (char === '/' && nextChar === '*') {
        inComment = true;
        formatted += char;
        continue;
      }
      
      if (char === '*' && nextChar === '/' && inComment) {
        inComment = false;
        formatted += char;
        continue;
      }
      
      if (inComment) {
        formatted += char;
        continue;
      }
      
      switch (char) {
        case '{':
          formatted += ' {\n';
          level++;
          formatted += indent.repeat(level);
          break;
          
        case '}':
          if (formatted.endsWith(indent)) {
            formatted = formatted.slice(0, -indent.length);
          }
          level--;
          formatted += '\n' + indent.repeat(level) + '}\n';
          if (level > 0) {
            formatted += indent.repeat(level);
          }
          break;
          
        case ';':
          formatted += ';\n';
          if (level > 0) {
            formatted += indent.repeat(level);
          }
          break;
          
        case ',':
          if (level === 0) {
            formatted += ',\n';
          } else {
            formatted += ', ';
          }
          break;
          
        case ':':
          formatted += ': ';
          break;
          
        default:
          if (char !== ' ' || (prevChar !== ':' && prevChar !== ',' && prevChar !== '{')) {
            formatted += char;
          }
          break;
      }
    }
    
    // Clean up extra newlines and spaces
    return formatted
      .replace(/\n\s*\n/g, '\n')
      .replace(/^\s+|\s+$/g, '')
      .replace(/\n\s*}/g, '\n}');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert('CSS copied to clipboard!');
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  const sampleCSS = `body{margin:0;padding:0;font-family:Arial,sans-serif}
.header{background-color:#333;color:white;padding:1rem}
.header h1{margin:0;font-size:2rem}
.container{max-width:1200px;margin:0 auto;padding:2rem}
.button{background:#007bff;color:white;border:none;padding:0.5rem 1rem;border-radius:4px;cursor:pointer}
.button:hover{background:#0056b3}
@media (max-width:768px){.container{padding:1rem}}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CSS Beautifier</h1>
          <p className="text-lg text-gray-600">Format and beautify CSS code</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Input CSS</h2>
              <button
                onClick={() => setInput(sampleCSS)}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Load Sample
              </button>
            </div>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your CSS code here..."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Settings */}
            <div className="mt-4 flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Indent:</label>
                <select
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                </select>
                <select
                  value={indentType}
                  onChange={(e) => setIndentType(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="spaces">Spaces</option>
                  <option value="tabs">Tabs</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button
                onClick={beautifyCSS}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Beautify
              </button>
              <button
                onClick={minifyCSS}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Minify
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Output CSS</h2>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Copy
                </button>
              )}
            </div>
            
            <textarea
              value={output}
              readOnly
              placeholder="Formatted CSS will appear here..."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none bg-gray-50"
            />
            
            {output && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Input size: {input.length} characters</span>
                  <span>Output size: {output.length} characters</span>
                  <span>
                    {input.length > output.length ? 'Reduced' : 'Expanded'} by: {Math.abs(input.length - output.length)} characters
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Beautify CSS:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Proper indentation</li>
                <li>• Line breaks for readability</li>
                <li>• Consistent spacing</li>
                <li>• Organized property formatting</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Minify CSS:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Remove unnecessary spaces</li>
                <li>• Remove comments</li>
                <li>• Compress selectors</li>
                <li>• Optimize file size</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

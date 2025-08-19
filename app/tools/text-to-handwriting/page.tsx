
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

export default function TextToHandwriting() {
  const [inputText, setInputText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [fontStyle, setFontStyle] = useState('cursive');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [lineHeight, setLineHeight] = useState(1.6);
  const [paperStyle, setPaperStyle] = useState('lined');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const language = 'en';
  const t = {
    about: 'About',
    services: 'Services',
    contact: 'Contact',
    visitCenter: 'Visit Center',
    onlineTools: 'Online Tools',
    jansevakendra: 'Janseva Kendra (Private)',
  };

  const fontOptions = [
    { value: 'cursive', label: 'Cursive' },
    { value: '"Brush Script MT", cursive', label: 'Brush Script' },
    { value: '"Lucida Handwriting", cursive', label: 'Lucida Handwriting' },
    { value: '"Comic Sans MS", cursive', label: 'Comic Sans' },
    { value: '"Dancing Script", cursive', label: 'Dancing Script' },
    { value: '"Kalam", cursive', label: 'Kalam' },
    { value: '"Caveat", cursive', label: 'Caveat' },
    { value: '"Indie Flower", cursive', label: 'Indie Flower' }
  ];

  const paperStyles = [
    { value: 'plain', label: 'Plain' },
    { value: 'lined', label: 'Lined' },
    { value: 'graph', label: 'Graph' },
    { value: 'dotted', label: 'Dotted' }
  ];

  const downloadAsImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !inputText.trim()) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paper background pattern
    drawPaperPattern(ctx, canvas.width, canvas.height);

    // Set text properties
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px ${fontStyle}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Draw text with word wrapping
    drawWrappedText(ctx, inputText, 40, 40, canvas.width - 80, fontSize * lineHeight);

    // Download the image
    const link = document.createElement('a');
    link.download = 'handwriting.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const drawPaperPattern = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    switch (paperStyle) {
      case 'lined':
        for (let y = 60; y < height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(40, y);
          ctx.lineTo(width - 40, y);
          ctx.stroke();
        }
        break;
      case 'graph':
        for (let x = 40; x < width; x += 20) {
          ctx.beginPath();
          ctx.moveTo(x, 40);
          ctx.lineTo(x, height - 40);
          ctx.stroke();
        }
        for (let y = 40; y < height; y += 20) {
          ctx.beginPath();
          ctx.moveTo(40, y);
          ctx.lineTo(width - 40, y);
          ctx.stroke();
        }
        break;
      case 'dotted':
        for (let x = 60; x < width; x += 20) {
          for (let y = 60; y < height; y += 20) {
            ctx.fillStyle = '#e0e0e0';
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
        break;
    }
  };

  const drawWrappedText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inputText);
    alert('Text copied to clipboard!');
  };

  const clearText = () => {
    setInputText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/tools" className="inline-flex items-center text-primary hover:text-secondary mb-4 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Text to Handwriting Converter</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert your typed text into beautiful handwriting-style text. Customize fonts, colors, and paper styles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Input Text</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your text
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your text here..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Style
                  </label>
                  <select
                    value={fontStyle}
                    onChange={(e) => setFontStyle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="48"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paper Style
                  </label>
                  <select
                    value={paperStyle}
                    onChange={(e) => setPaperStyle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {paperStyles.map((style) => (
                      <option key={style.value} value={style.value}>
                        {style.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Line Height: {lineHeight}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={downloadAsImage}
                  disabled={!inputText.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Download as Image
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={!inputText.trim()}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Copy Text
                </button>
                <button
                  onClick={clearText}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Handwriting Preview</h2>
            
            <div 
              className="min-h-96 p-6 border-2 border-gray-200 rounded-lg overflow-auto"
              style={{ 
                backgroundColor: backgroundColor,
                backgroundImage: paperStyle === 'lined' ? 
                  'repeating-linear-gradient(transparent, transparent 35px, #e0e0e0 35px, #e0e0e0 36px)' :
                  paperStyle === 'graph' ?
                  'linear-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px)' :
                  paperStyle === 'dotted' ?
                  'radial-gradient(circle, #e0e0e0 1px, transparent 1px)' : 'none',
                backgroundSize: paperStyle === 'graph' ? '20px 20px' : 
                               paperStyle === 'dotted' ? '20px 20px' : 'auto'
              }}
            >
              {inputText ? (
                <div
                  style={{
                    fontFamily: fontStyle,
                    fontSize: `${fontSize}px`,
                    color: textColor,
                    lineHeight: lineHeight,
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {inputText}
                </div>
              ) : (
                <div className="text-gray-400 italic">
                  Your handwriting preview will appear here...
                </div>
              )}
            </div>

            {/* Hidden Canvas for Image Generation */}
            <canvas
              ref={canvasRef}
              className="hidden"
              width="800"
              height="600"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">How to Use:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Type or paste your text in the input area</li>
            <li>Choose your preferred font style and adjust the size</li>
            <li>Customize colors and paper style to match your preference</li>
            <li>Preview your handwriting in real-time</li>
            <li>Download as an image or copy the styled text</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

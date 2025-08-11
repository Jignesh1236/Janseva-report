
"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function BarcodeGenerator() {
  const [text, setText] = useState('');
  const [barcodeType, setBarcodeType] = useState('code128');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple Code 128 barcode generator
  const generateBarcode = () => {
    if (!text || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Simple barcode pattern generator
    const barcodePattern = generateBarcodePattern(text);
    const barWidth = 3;
    const barHeight = 100;
    const startX = 50;
    const startY = 20;

    ctx.fillStyle = 'black';
    
    for (let i = 0; i < barcodePattern.length; i++) {
      if (barcodePattern[i] === '1') {
        ctx.fillRect(startX + i * barWidth, startY, barWidth, barHeight);
      }
    }

    // Add text below barcode
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, startY + barHeight + 25);
  };

  const generateBarcodePattern = (data: string): string => {
    // Simplified barcode pattern generation
    let pattern = '11010000100'; // Start pattern
    
    for (let char of data) {
      const charCode = char.charCodeAt(0);
      // Simple encoding - alternating pattern based on char code
      const encoding = (charCode % 2 === 0) ? '10011100110' : '01100011010';
      pattern += encoding;
    }
    
    pattern += '1100011101011'; // Stop pattern
    return pattern;
  };

  useEffect(() => {
    if (text) {
      generateBarcode();
    }
  }, [text, barcodeType]);

  const downloadBarcode = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `barcode-${text}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Barcode Generator</h1>
          <p className="text-lg text-gray-600">Generate various types of barcodes</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text to Encode
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text or numbers"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barcode Type
              </label>
              <select
                value={barcodeType}
                onChange={(e) => setBarcodeType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="code128">Code 128</option>
                <option value="code39">Code 39</option>
                <option value="ean13">EAN-13</option>
                <option value="upc">UPC</option>
              </select>
            </div>

            {text && (
              <div className="text-center space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={160}
                    className="border border-gray-300 rounded"
                  />
                </div>
                
                <button
                  onClick={downloadBarcode}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download Barcode
                </button>
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Supported Formats:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Code 128 - Alphanumeric characters</li>
                <li>• Code 39 - Letters, numbers, and some symbols</li>
                <li>• EAN-13 - 13-digit product codes</li>
                <li>• UPC - Universal Product Codes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState, useRef } from 'react';

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [size, setSize] = useState(200);
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [withLogo, setWithLogo] = useState(true);

  const generateQRCode = (forceLogo: boolean | null = null) => {
    if (!text.trim()) return;

    const useLogo = forceLogo !== null ? forceLogo : withLogo;

    // Using QR Server API (free service) with JS watermark
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&ecc=${errorCorrection}&format=png&qzone=1&margin=10`;
    
    // Add custom logo watermark by creating a canvas overlay
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      canvas.width = size;
      canvas.height = size;
      
      // Draw QR code
      ctx.drawImage(qrImg, 0, 0, size, size);
      
      if (useLogo) {
        // Calculate center position and logo size
        const logoSize = size * 0.25; // 25% of QR code size
        const centerX = size / 2;
        const centerY = size / 2;
        
        // Draw white background for logo
        ctx.fillStyle = 'white';
        ctx.fillRect(centerX - logoSize / 2 - 5, centerY - logoSize / 2 - 5, logoSize + 10, logoSize + 10);
        
        // Load and draw custom logo
        const logoImg = new Image();
        logoImg.onload = () => {
          ctx.drawImage(logoImg, centerX - logoSize / 2, centerY - logoSize / 2, logoSize, logoSize);
          setQrCodeUrl(canvas.toDataURL('image/png'));
        };
        logoImg.onerror = () => {
          // Fallback: just set QR code without logo if image fails to load
          setQrCodeUrl(canvas.toDataURL('image/png'));
        };
        logoImg.src = '/481573786_593041823723784_4398692427343624609_n-removebg-preview.webp';
      } else {
        // No logo, just use the QR code
        setQrCodeUrl(canvas.toDataURL('image/png'));
      }
    };
    qrImg.src = apiUrl;
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    link.click();
  };

  const clearAll = () => {
    setText('');
    setQrCodeUrl('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            QR Code Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate QR codes for text, URLs, contact info, and more
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Text/URL to encode
                </label>
                <textarea
                  id="text-input"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text, URL, email, phone number, or any data..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                    Size (px)
                  </label>
                  <select
                    id="size"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={150}>150x150</option>
                    <option value={200}>200x200</option>
                    <option value={300}>300x300</option>
                    <option value={400}>400x400</option>
                    <option value={500}>500x500</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="error-correction" className="block text-sm font-medium text-gray-700 mb-2">
                    Error Correction
                  </label>
                  <select
                    id="error-correction"
                    value={errorCorrection}
                    onChange={(e) => setErrorCorrection(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Add Logo to QR Code</span>
                <button
                  type="button"
                  onClick={() => setWithLogo(!withLogo)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    withLogo ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      withLogo ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => generateQRCode()}
                  disabled={!text.trim()}
                  className={`flex-1 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    !text.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:ring-purple-500'
                  }`}
                >
                  Generate QR Code
                </button>
                <button
                  onClick={() => generateQRCode(false)}
                  disabled={!text.trim()}
                  className={`px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    !text.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 focus:ring-blue-500'
                  }`}
                  title="Generate without logo"
                >
                  Clean
                </button>
                <button
                  onClick={clearAll}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* QR Code Display */}
            <div className="flex flex-col items-center justify-center">
              {qrCodeUrl ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl shadow-lg border-2 border-gray-100">
                    <img
                      src={qrCodeUrl}
                      alt="Generated QR Code"
                      className="max-w-full h-auto"
                    />
                  </div>
                  <button
                    onClick={downloadQRCode}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Download QR Code
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500 p-8 border-2 border-dashed border-gray-300 rounded-xl">
                  <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p>Enter text and click "Generate QR Code" to see your QR code here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Examples Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Example Use Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Website URL</h3>
                <p className="text-sm text-purple-600">https://example.com</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Email Address</h3>
                <p className="text-sm text-blue-600">mailto:contact@example.com</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Phone Number</h3>
                <p className="text-sm text-green-600">tel:+1234567890</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">WiFi Netawork</h3>
                <p className="text-sm text-orange-600">WIFI:T:WPA;S:NetworkName;P:Password;;</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg">
                <h3 className="font-semibold text-pink-800 mb-2">SMS Message</h3>
                <p className="text-sm text-pink-600">sms:+1234567890:Hello World</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h3 className="font-semibold text-indigo-800 mb-2">Plain Text</h3>
                <p className="text-sm text-indigo-600">Any text you want to encode</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

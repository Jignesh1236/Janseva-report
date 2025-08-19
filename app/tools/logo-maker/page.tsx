
"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface LogoData {
  text: string;
  tagline: string;
  icon: string;
  shape: string;
}

interface LogoSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontSize: number;
  iconSize: number;
  layout: string;
}

export default function LogoMaker() {
  const [logoData, setLogoData] = useState<LogoData>({
    text: 'Your Company',
    tagline: 'Your Tagline',
    icon: '⭐',
    shape: 'circle'
  });

  const [settings, setSettings] = useState<LogoSettings>({
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    backgroundColor: '#ffffff',
    fontFamily: 'Arial',
    fontSize: 32,
    iconSize: 40,
    layout: 'horizontal'
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const icons = ['⭐', '🔥', '💡', '🚀', '💎', '🌟', '🎯', '⚡', '🔥', '🌍', '💼', '🏆', '🎨', '📱', '💻', '🔧'];
  const shapes = ['circle', 'square', 'hexagon', 'triangle', 'none'];
  const fonts = ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 'Impact'];
  const layouts = ['horizontal', 'vertical', 'stacked'];

  const handleDataChange = (field: keyof LogoData, value: string) => {
    setLogoData(prev => ({ ...prev, [field]: value }));
  };

  const handleSettingsChange = (field: keyof LogoSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const drawLogo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate positions based on layout
    let iconX, iconY, textX, textY, taglineX, taglineY;

    switch (settings.layout) {
      case 'horizontal':
        iconX = 100;
        iconY = 200;
        textX = 180;
        textY = 190;
        taglineX = 180;
        taglineY = 220;
        break;
      case 'vertical':
        iconX = 200;
        iconY = 120;
        textX = 200;
        textY = 220;
        taglineX = 200;
        taglineY = 250;
        break;
      case 'stacked':
        iconX = 200;
        iconY = 150;
        textX = 200;
        textY = 200;
        taglineX = 200;
        taglineY = 230;
        break;
      default:
        iconX = iconY = textX = textY = taglineX = taglineY = 200;
    }

    // Draw shape behind icon
    if (logoData.shape !== 'none') {
      ctx.fillStyle = settings.primaryColor;
      const shapeSize = settings.iconSize + 20;
      
      switch (logoData.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(iconX, iconY, shapeSize / 2, 0, 2 * Math.PI);
          ctx.fill();
          break;
        case 'square':
          ctx.fillRect(iconX - shapeSize / 2, iconY - shapeSize / 2, shapeSize, shapeSize);
          break;
        case 'hexagon':
          drawHexagon(ctx, iconX, iconY, shapeSize / 2);
          break;
        case 'triangle':
          drawTriangle(ctx, iconX, iconY, shapeSize / 2);
          break;
      }
    }

    // Draw icon
    ctx.fillStyle = logoData.shape !== 'none' ? '#ffffff' : settings.primaryColor;
    ctx.font = `${settings.iconSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(logoData.icon, iconX, iconY);

    // Draw main text
    ctx.fillStyle = settings.primaryColor;
    ctx.font = `bold ${settings.fontSize}px ${settings.fontFamily}`;
    ctx.textAlign = settings.layout === 'horizontal' ? 'left' : 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(logoData.text, textX, textY);

    // Draw tagline
    if (logoData.tagline) {
      ctx.fillStyle = settings.secondaryColor;
      ctx.font = `${settings.fontSize * 0.5}px ${settings.fontFamily}`;
      ctx.fillText(logoData.tagline, taglineX, taglineY);
    }
  };

  const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const px = x + radius * Math.cos(angle);
      const py = y + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    ctx.lineTo(x - radius * 0.866, y + radius * 0.5);
    ctx.lineTo(x + radius * 0.866, y + radius * 0.5);
    ctx.closePath();
    ctx.fill();
  };

  useEffect(() => {
    drawLogo();
  }, [logoData, settings]);

  const downloadLogo = (format: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `logo-${logoData.text.replace(/\s+/g, '-').toLowerCase()}.${format}`;
    
    if (format === 'svg') {
      // For SVG, we'll create a simple SVG version
      const svg = createSVGLogo();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      link.href = URL.createObjectURL(blob);
    } else {
      link.href = canvas.toDataURL(`image/${format}`);
    }
    
    link.click();
  };

  const createSVGLogo = () => {
    return `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="${settings.backgroundColor}"/>
        <text x="200" y="200" text-anchor="middle" fill="${settings.primaryColor}" 
              font-family="${settings.fontFamily}" font-size="${settings.fontSize}" font-weight="bold">
          ${logoData.text}
        </text>
        <text x="200" y="230" text-anchor="middle" fill="${settings.secondaryColor}" 
              font-family="${settings.fontFamily}" font-size="${settings.fontSize * 0.5}">
          ${logoData.tagline}
        </text>
      </svg>
    `;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/tools" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Logo Maker</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create professional logos with our simple design tool
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Text Content */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Text Content</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={logoData.text}
                    onChange={(e) => handleDataChange('text', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your Company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagline (Optional)</label>
                  <input
                    type="text"
                    value={logoData.tagline}
                    onChange={(e) => handleDataChange('tagline', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your Tagline"
                  />
                </div>
              </div>
            </div>

            {/* Icon Selection */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Icon</h2>
              <div className="grid grid-cols-8 gap-2">
                {icons.map((icon, index) => (
                  <button
                    key={index}
                    onClick={() => handleDataChange('icon', icon)}
                    className={`p-3 text-2xl border rounded-lg hover:bg-gray-50 transition-colors duration-200 ${
                      logoData.icon === icon ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Shape Selection */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Icon Shape</h2>
              <div className="grid grid-cols-5 gap-2">
                {shapes.map((shape) => (
                  <button
                    key={shape}
                    onClick={() => handleDataChange('shape', shape)}
                    className={`p-3 border rounded-lg capitalize hover:bg-gray-50 transition-colors duration-200 ${
                      logoData.shape === shape ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Layout</h2>
              <div className="grid grid-cols-3 gap-2">
                {layouts.map((layout) => (
                  <button
                    key={layout}
                    onClick={() => handleSettingsChange('layout', layout)}
                    className={`p-3 border rounded-lg capitalize hover:bg-gray-50 transition-colors duration-200 ${
                      settings.layout === layout ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                    }`}
                  >
                    {layout}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Colors</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary</label>
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => handleSettingsChange('primaryColor', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary</label>
                    <input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => handleSettingsChange('secondaryColor', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                    <input
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) => handleSettingsChange('backgroundColor', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Typography</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => handleSettingsChange('fontFamily', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {fonts.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Size: {settings.fontSize}px</label>
                  <input
                    type="range"
                    min="16"
                    max="48"
                    value={settings.fontSize}
                    onChange={(e) => handleSettingsChange('fontSize', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon Size: {settings.iconSize}px</label>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    value={settings.iconSize}
                    onChange={(e) => handleSettingsChange('iconSize', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview & Download */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview</h2>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  className="w-full max-w-md mx-auto border border-gray-200 rounded-lg shadow-sm bg-white"
                />
              </div>
            </div>

            {/* Download Options */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Download</h2>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => downloadLogo('png')}
                  className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
                >
                  PNG
                </button>
                <button
                  onClick={() => downloadLogo('jpeg')}
                  className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
                >
                  JPEG
                </button>
                <button
                  onClick={() => downloadLogo('svg')}
                  className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
                >
                  SVG
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Design Tips</h3>
              <ul className="text-sm text-purple-700 space-y-2">
                <li>• Keep it simple and memorable</li>
                <li>• Use 2-3 colors maximum</li>
                <li>• Ensure it works in different sizes</li>
                <li>• Choose readable fonts</li>
                <li>• Test on different backgrounds</li>
                <li>• Consider your brand personality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

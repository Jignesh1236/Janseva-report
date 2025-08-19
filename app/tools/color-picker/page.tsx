
'use client';

import { useState, useRef } from 'react';

export default function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [colorFormats, setColorFormats] = useState({
    hex: '#3B82F6',
    rgb: 'rgb(59, 130, 246)',
    hsl: 'hsl(217, 91%, 60%)',
    hsv: 'hsv(217, 76%, 96%)'
  });
  const [palette, setPalette] = useState<string[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<string[][]>([]);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    const v = max;

    let h = 0;
    if (d !== 0) {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    };
  };

  const updateColorFormats = (color: string) => {
    const rgb = hexToRgb(color);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      
      setColorFormats({
        hex: color,
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`
      });
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    updateColorFormats(color);
  };

  const generateComplementaryPalette = () => {
    const rgb = hexToRgb(selectedColor);
    if (!rgb) return;

    const newPalette = [selectedColor];
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Complementary color
    const compHue = (hsl.h + 180) % 360;
    newPalette.push(hslToHex(compHue, hsl.s, hsl.l));
    
    // Analogous colors
    newPalette.push(hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l));
    newPalette.push(hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l));
    
    // Triadic colors
    newPalette.push(hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l));
    newPalette.push(hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l));

    setPalette(newPalette);
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const addToPalette = (color: string) => {
    if (!palette.includes(color)) {
      setPalette([...palette, color]);
    }
  };

  const savePalette = () => {
    if (palette.length > 0) {
      setSavedPalettes([...savedPalettes, [...palette]]);
    }
  };

  const clearPalette = () => {
    setPalette([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-600">
            Color Picker & Palette Generator
          </h1>
          <p className="text-lg text-gray-600">
            Pick colors, generate palettes, and get color codes in multiple formats
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Color Picker Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Color Picker</h2>
            
            <div className="space-y-6">
              <div className="text-center">
                <div 
                  className="w-32 h-32 mx-auto rounded-full shadow-lg border-4 border-white"
                  style={{ backgroundColor: selectedColor }}
                ></div>
                <p className="mt-2 text-sm text-gray-600">Selected Color</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pick a Color
                </label>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-full h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Color Formats</h3>
                {Object.entries(colorFormats).map(([format, value]) => (
                  <div key={format} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase">{format}</span>
                      <p className="font-mono text-sm">{value}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(value)}
                      className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      title="Copy to clipboard"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={generateComplementaryPalette}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-cyan-700 transition-all duration-200"
                >
                  Generate Palette
                </button>
                <button
                  onClick={() => addToPalette(selectedColor)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  Add to Palette
                </button>
              </div>
            </div>
          </div>

          {/* Palette Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Color Palette</h2>
              <div className="flex space-x-2">
                <button
                  onClick={savePalette}
                  disabled={palette.length === 0}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
                <button
                  onClick={clearPalette}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Clear
                </button>
              </div>
            </div>

            {palette.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {palette.map((color, index) => (
                  <div key={index} className="group">
                    <div
                      className="w-full h-16 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200"
                      style={{ backgroundColor: color }}
                      onClick={() => copyToClipboard(color)}
                      title={`Click to copy ${color}`}
                    ></div>
                    <p className="text-xs text-center mt-1 font-mono text-gray-600">{color}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
                <p>No colors in palette</p>
                <p className="text-sm">Generate a palette or add colors manually</p>
              </div>
            )}

            {savedPalettes.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Palettes</h3>
                <div className="space-y-3">
                  {savedPalettes.map((savedPalette, paletteIndex) => (
                    <div key={paletteIndex} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex space-x-2">
                        {savedPalette.map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-8 h-8 rounded cursor-pointer"
                            style={{ backgroundColor: color }}
                            onClick={() => copyToClipboard(color)}
                            title={color}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Color Theory Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-600">
            Color Harmony Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold text-indigo-800 mb-2">Complementary</h3>
              <p className="text-sm text-indigo-600">Colors opposite each other on the color wheel. High contrast and vibrant.</p>
            </div>
            <div className="p-4 bg-cyan-50 rounded-lg">
              <h3 className="font-semibold text-cyan-800 mb-2">Analogous</h3>
              <p className="text-sm text-cyan-600">Colors next to each other on the color wheel. Harmonious and pleasing.</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Triadic</h3>
              <p className="text-sm text-purple-600">Three colors evenly spaced around the color wheel. Vibrant yet balanced.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

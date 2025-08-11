
"use client";
import React, { useState, useEffect } from 'react';

export default function GradientGenerator() {
  const [gradientType, setGradientType] = useState('linear');
  const [direction, setDirection] = useState('to right');
  const [colors, setColors] = useState(['#ff6b6b', '#4ecdc4']);
  const [gradientCSS, setGradientCSS] = useState('');

  const directions = [
    { value: 'to right', label: 'To Right' },
    { value: 'to left', label: 'To Left' },
    { value: 'to bottom', label: 'To Bottom' },
    { value: 'to top', label: 'To Top' },
    { value: 'to bottom right', label: 'To Bottom Right' },
    { value: 'to bottom left', label: 'To Bottom Left' },
    { value: 'to top right', label: 'To Top Right' },
    { value: 'to top left', label: 'To Top Left' },
    { value: '45deg', label: '45 degrees' },
    { value: '90deg', label: '90 degrees' },
    { value: '135deg', label: '135 degrees' },
    { value: '180deg', label: '180 degrees' }
  ];

  const presetGradients = [
    { name: 'Sunset', colors: ['#ff9a9e', '#fecfef'] },
    { name: 'Ocean', colors: ['#667eea', '#764ba2'] },
    { name: 'Forest', colors: ['#56ab2f', '#a8e6cf'] },
    { name: 'Fire', colors: ['#f12711', '#f5af19'] },
    { name: 'Purple', colors: ['#667eea', '#764ba2'] },
    { name: 'Pink', colors: ['#f093fb', '#f5576c'] },
    { name: 'Blue', colors: ['#4facfe', '#00f2fe'] },
    { name: 'Green', colors: ['#43e97b', '#38f9d7'] }
  ];

  useEffect(() => {
    generateCSS();
  }, [gradientType, direction, colors]);

  const generateCSS = () => {
    const colorString = colors.join(', ');
    let css = '';
    
    if (gradientType === 'linear') {
      css = `background: linear-gradient(${direction}, ${colorString})`;
    } else if (gradientType === 'radial') {
      css = `background: radial-gradient(circle, ${colorString})`;
    } else if (gradientType === 'conic') {
      css = `background: conic-gradient(from 0deg, ${colorString})`;
    }
    
    setGradientCSS(css);
  };

  const addColor = () => {
    if (colors.length < 6) {
      setColors([...colors, '#000000']);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const applyPreset = (preset: any) => {
    setColors(preset.colors);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gradientCSS);
    alert('CSS copied to clipboard!');
  };

  const randomizeGradient = () => {
    const randomColors = [];
    const numColors = Math.floor(Math.random() * 3) + 2; // 2-4 colors
    
    for (let i = 0; i < numColors; i++) {
      const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
      randomColors.push(randomColor);
    }
    
    setColors(randomColors);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CSS Gradient Generator</h1>
          <p className="text-lg text-gray-600">Create beautiful CSS gradients visually</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Gradient Settings</h2>
            
            <div className="space-y-6">
              {/* Gradient Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gradient Type
                </label>
                <select
                  value={gradientType}
                  onChange={(e) => setGradientType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                  <option value="conic">Conic</option>
                </select>
              </div>

              {/* Direction (for linear gradients) */}
              {gradientType === 'linear' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Direction
                  </label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {directions.map(dir => (
                      <option key={dir.value} value={dir.value}>{dir.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Colors */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Colors
                  </label>
                  <button
                    onClick={addColor}
                    disabled={colors.length >= 6}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add Color
                  </button>
                </div>
                
                <div className="space-y-2">
                  {colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => updateColor(index, e.target.value)}
                        className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => updateColor(index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {colors.length > 2 && (
                        <button
                          onClick={() => removeColor(index)}
                          className="px-2 py-1 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {presetGradients.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => applyPreset(preset)}
                      className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      style={{
                        background: `linear-gradient(to right, ${preset.colors.join(', ')})`
                      }}
                    >
                      <span className="text-white font-semibold drop-shadow">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={randomizeGradient}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  🎲 Random
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  📋 Copy CSS
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Preview</h2>
            
            <div className="space-y-6">
              {/* Gradient Preview */}
              <div
                className="w-full h-64 rounded-lg border border-gray-300"
                style={{ background: gradientCSS.replace('background: ', '') }}
              />

              {/* CSS Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSS Code
                </label>
                <textarea
                  value={gradientCSS}
                  readOnly
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none"
                />
              </div>

              {/* HTML Example */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HTML Example
                </label>
                <textarea
                  value={`<div style="${gradientCSS}; width: 100%; height: 200px;"></div>`}
                  readOnly
                  className="w-full h-16 p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

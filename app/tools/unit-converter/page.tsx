
"use client";
import React, { useState, useEffect } from 'react';

interface ConversionCategory {
  name: string;
  units: { [key: string]: number };
}

const conversionCategories: { [key: string]: ConversionCategory } = {
  length: {
    name: 'Length',
    units: {
      'Millimeter': 0.001,
      'Centimeter': 0.01,
      'Meter': 1,
      'Kilometer': 1000,
      'Inch': 0.0254,
      'Foot': 0.3048,
      'Yard': 0.9144,
      'Mile': 1609.34
    }
  },
  weight: {
    name: 'Weight',
    units: {
      'Milligram': 0.001,
      'Gram': 1,
      'Kilogram': 1000,
      'Ounce': 28.3495,
      'Pound': 453.592,
      'Stone': 6350.29,
      'Ton': 1000000
    }
  },
  temperature: {
    name: 'Temperature',
    units: {
      'Celsius': 1,
      'Fahrenheit': 1,
      'Kelvin': 1
    }
  },
  area: {
    name: 'Area',
    units: {
      'Square Millimeter': 0.000001,
      'Square Centimeter': 0.0001,
      'Square Meter': 1,
      'Square Kilometer': 1000000,
      'Square Inch': 0.00064516,
      'Square Foot': 0.092903,
      'Square Yard': 0.836127,
      'Acre': 4046.86,
      'Hectare': 10000
    }
  }
};

export default function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    const units = Object.keys(conversionCategories[category].units);
    setFromUnit(units[0]);
    setToUnit(units[1]);
  }, [category]);

  useEffect(() => {
    if (inputValue && fromUnit && toUnit) {
      convertValue();
    }
  }, [inputValue, fromUnit, toUnit, category]);

  const convertValue = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      setResult('');
      return;
    }

    const value = parseFloat(inputValue);
    
    if (category === 'temperature') {
      setResult(convertTemperature(value, fromUnit, toUnit).toString());
    } else {
      const categoryData = conversionCategories[category];
      const fromFactor = categoryData.units[fromUnit];
      const toFactor = categoryData.units[toUnit];
      
      const baseValue = value * fromFactor;
      const convertedValue = baseValue / toFactor;
      
      setResult(convertedValue.toString());
    }
  };

  const convertTemperature = (value: number, from: string, to: string): number => {
    if (from === to) return value;
    
    // Convert to Celsius first
    let celsius = value;
    if (from === 'Fahrenheit') {
      celsius = (value - 32) * 5/9;
    } else if (from === 'Kelvin') {
      celsius = value - 273.15;
    }
    
    // Convert from Celsius to target
    if (to === 'Fahrenheit') {
      return celsius * 9/5 + 32;
    } else if (to === 'Kelvin') {
      return celsius + 273.15;
    }
    
    return celsius;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Unit Converter</h1>
          <p className="text-lg text-gray-600">Convert between different units of measurement</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(conversionCategories).map(([key, cat]) => (
                <option key={key} value={key}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From Unit */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.keys(conversionCategories[category].units).map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value
                </label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter value"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* To Unit */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.keys(conversionCategories[category].units).map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Result
                </label>
                <input
                  type="text"
                  value={result}
                  readOnly
                  placeholder="Result will appear here"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex gap-2 justify-center">
            <button
              onClick={() => {
                const temp = fromUnit;
                setFromUnit(toUnit);
                setToUnit(temp);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ⇄ Swap Units
            </button>
            <button
              onClick={() => {setInputValue(''); setResult('');}}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

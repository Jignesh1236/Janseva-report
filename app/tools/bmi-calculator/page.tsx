
"use client";
import React, { useState } from 'react';
import Link from 'next/link';

interface BMIData {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  unit: 'metric' | 'imperial';
}

interface BMIResult {
  bmi: number;
  category: string;
  healthyWeightRange: string;
  recommendations: string[];
}

export default function BMICalculator() {
  const [data, setData] = useState<BMIData>({
    weight: 0,
    height: 0,
    age: 25,
    gender: 'male',
    unit: 'metric'
  });

  const [result, setResult] = useState<BMIResult | null>(null);

  const calculateBMI = () => {
    if (data.weight <= 0 || data.height <= 0) {
      alert('Please enter valid weight and height values');
      return;
    }

    let weightKg = data.weight;
    let heightM = data.height;

    // Convert to metric if needed
    if (data.unit === 'imperial') {
      weightKg = data.weight * 0.453592; // pounds to kg
      heightM = data.height * 0.0254; // inches to meters
    } else {
      heightM = data.height / 100; // cm to meters
    }

    const bmi = weightKg / (heightM * heightM);
    
    let category = '';
    let recommendations: string[] = [];

    if (bmi < 18.5) {
      category = 'Underweight';
      recommendations = [
        'Consider increasing caloric intake with nutritious foods',
        'Include protein-rich foods in your diet',
        'Consult with a healthcare provider for personalized advice',
        'Consider strength training exercises'
      ];
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal weight';
      recommendations = [
        'Maintain your current healthy lifestyle',
        'Continue regular physical activity',
        'Eat a balanced diet with fruits and vegetables',
        'Stay hydrated and get adequate sleep'
      ];
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      recommendations = [
        'Consider a balanced diet with portion control',
        'Increase physical activity to 150 minutes per week',
        'Focus on whole foods and reduce processed foods',
        'Consider consulting with a nutritionist'
      ];
    } else {
      category = 'Obese';
      recommendations = [
        'Consult with a healthcare provider for a weight management plan',
        'Focus on gradual, sustainable weight loss',
        'Combine cardiovascular and strength training exercises',
        'Consider working with a registered dietitian'
      ];
    }

    // Calculate healthy weight range
    const minHealthyWeight = 18.5 * (heightM * heightM);
    const maxHealthyWeight = 24.9 * (heightM * heightM);

    let healthyWeightRange = '';
    if (data.unit === 'imperial') {
      const minLbs = minHealthyWeight * 2.20462;
      const maxLbs = maxHealthyWeight * 2.20462;
      healthyWeightRange = `${minLbs.toFixed(1)} - ${maxLbs.toFixed(1)} lbs`;
    } else {
      healthyWeightRange = `${minHealthyWeight.toFixed(1)} - ${maxHealthyWeight.toFixed(1)} kg`;
    }

    setResult({
      bmi: parseFloat(bmi.toFixed(1)),
      category,
      healthyWeightRange,
      recommendations
    });
  };

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return 'text-blue-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const resetCalculator = () => {
    setData({
      weight: 0,
      height: 0,
      age: 25,
      gender: 'male',
      unit: 'metric'
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/tools" className="inline-flex items-center text-green-600 hover:text-green-800 mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">BMI Calculator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate your Body Mass Index and get personalized health recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Input Form */}
          <div className="space-y-6">
            {/* Unit Selection */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Unit System</h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => setData(prev => ({ ...prev, unit: 'metric' }))}
                  className={`flex-1 p-3 rounded-lg border-2 transition-colors duration-200 ${
                    data.unit === 'metric'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Metric (kg, cm)
                </button>
                <button
                  onClick={() => setData(prev => ({ ...prev, unit: 'imperial' }))}
                  className={`flex-1 p-3 rounded-lg border-2 transition-colors duration-200 ${
                    data.unit === 'imperial'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Imperial (lbs, in)
                </button>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight ({data.unit === 'metric' ? 'kg' : 'lbs'})
                  </label>
                  <input
                    type="number"
                    value={data.weight || ''}
                    onChange={(e) => setData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={data.unit === 'metric' ? 'Enter weight in kg' : 'Enter weight in lbs'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height ({data.unit === 'metric' ? 'cm' : 'inches'})
                  </label>
                  <input
                    type="number"
                    value={data.height || ''}
                    onChange={(e) => setData(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={data.unit === 'metric' ? 'Enter height in cm' : 'Enter height in inches'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={data.age}
                    onChange={(e) => setData(prev => ({ ...prev, age: parseInt(e.target.value) || 25 }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={data.gender}
                    onChange={(e) => setData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex space-x-4">
                <button
                  onClick={calculateBMI}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                >
                  Calculate BMI
                </button>
                <button
                  onClick={resetCalculator}
                  className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-6">
            {result && (
              <>
                {/* BMI Result */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Your BMI Result</h2>
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${getBMIColor(result.bmi)}`}>
                      {result.bmi}
                    </div>
                    <div className={`text-xl font-semibold mb-4 ${getBMIColor(result.bmi)}`}>
                      {result.category}
                    </div>
                    <div className="text-gray-600">
                      Healthy weight range: {result.healthyWeightRange}
                    </div>
                  </div>
                </div>

                {/* BMI Scale */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">BMI Scale</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 rounded bg-blue-50">
                      <span>Underweight</span>
                      <span className="font-medium">Below 18.5</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-green-50">
                      <span>Normal weight</span>
                      <span className="font-medium">18.5 - 24.9</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-yellow-50">
                      <span>Overweight</span>
                      <span className="font-medium">25.0 - 29.9</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-red-50">
                      <span>Obese</span>
                      <span className="font-medium">30.0 and above</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Information */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">About BMI</h3>
              <div className="text-sm text-blue-700 space-y-2">
                <p>• BMI is a measure of body fat based on height and weight</p>
                <p>• It's a screening tool, not a diagnostic tool</p>
                <p>• Results may vary for athletes and elderly individuals</p>
                <p>• Consult healthcare providers for personalized advice</p>
                <p>• BMI doesn't account for muscle mass, bone density, or body composition</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

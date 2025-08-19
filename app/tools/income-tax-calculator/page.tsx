
"use client";
import React, { useState, useEffect } from 'react';

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState('');
  const [age, setAge] = useState('below60');
  const [taxRegime, setTaxRegime] = useState('new'); // new or old
  const [result, setResult] = useState<any>(null);

  const calculateTax = () => {
    const annualIncome = parseFloat(income);
    if (!annualIncome || annualIncome <= 0) {
      setResult(null);
      return;
    }

    let tax = 0;
    let exemptionLimit = 0;
    let taxSlabs = [];

    if (taxRegime === 'new') {
      // New Tax Regime (FY 2023-24)
      exemptionLimit = 300000;
      taxSlabs = [
        { min: 0, max: 300000, rate: 0, desc: 'No Tax' },
        { min: 300000, max: 600000, rate: 5, desc: '5%' },
        { min: 600000, max: 900000, rate: 10, desc: '10%' },
        { min: 900000, max: 1200000, rate: 15, desc: '15%' },
        { min: 1200000, max: 1500000, rate: 20, desc: '20%' },
        { min: 1500000, max: Infinity, rate: 30, desc: '30%' }
      ];
    } else {
      // Old Tax Regime
      if (age === 'below60') {
        exemptionLimit = 250000;
      } else if (age === '60to80') {
        exemptionLimit = 300000;
      } else {
        exemptionLimit = 500000;
      }

      taxSlabs = [
        { min: 0, max: exemptionLimit, rate: 0, desc: 'No Tax' },
        { min: exemptionLimit, max: 500000, rate: 5, desc: '5%' },
        { min: 500000, max: 1000000, rate: 20, desc: '20%' },
        { min: 1000000, max: Infinity, rate: 30, desc: '30%' }
      ];
    }

    // Calculate tax based on slabs
    for (const slab of taxSlabs) {
      if (annualIncome > slab.min) {
        const taxableInSlab = Math.min(annualIncome, slab.max) - slab.min;
        tax += (taxableInSlab * slab.rate) / 100;
      }
    }

    // Health and Education Cess (4%)
    const cess = tax * 0.04;
    const totalTax = tax + cess;

    const netIncome = annualIncome - totalTax;
    const effectiveRate = (totalTax / annualIncome) * 100;

    setResult({
      grossIncome: annualIncome,
      taxableIncome: Math.max(0, annualIncome - exemptionLimit),
      incomeTax: tax,
      cess: cess,
      totalTax: totalTax,
      netIncome: netIncome,
      effectiveRate: effectiveRate,
      exemptionLimit: exemptionLimit,
      taxSlabs: taxSlabs
    });
  };

  useEffect(() => {
    if (income) {
      calculateTax();
    }
  }, [income, age, taxRegime]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Income Tax Calculator</h1>
          <p className="text-lg text-gray-600">Calculate tax for different income slabs (FY 2023-24)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Income Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Regime
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="new"
                      checked={taxRegime === 'new'}
                      onChange={(e) => setTaxRegime(e.target.value)}
                      className="mr-2"
                    />
                    <span>New Regime</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="old"
                      checked={taxRegime === 'old'}
                      onChange={(e) => setTaxRegime(e.target.value)}
                      className="mr-2"
                    />
                    <span>Old Regime</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Income (₹)
                </label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="1000000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {taxRegime === 'old' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Category
                  </label>
                  <select
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="below60">Below 60 years</option>
                    <option value="60to80">60-80 years (Senior Citizen)</option>
                    <option value="above80">Above 80 years (Super Senior)</option>
                  </select>
                </div>
              )}

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">Note:</h3>
                <p className="text-sm text-yellow-700">
                  This calculator provides an estimate based on basic income tax slabs. 
                  Actual tax may vary based on deductions, exemptions, and other factors.
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Tax Calculation</h2>
            
            {result ? (
              <div className="space-y-6">
                {/* Main Result */}
                <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg p-6 text-center">
                  <div className="text-sm opacity-90">Total Tax Payable</div>
                  <div className="text-3xl font-bold">
                    ₹{result.totalTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                  </div>
                  <div className="text-sm opacity-90 mt-1">
                    Effective Rate: {result.effectiveRate.toFixed(2)}%
                  </div>
                </div>

                {/* Breakdown Cards */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm text-green-600">Gross Income</div>
                    <div className="text-xl font-bold text-green-700">
                      ₹{result.grossIncome.toLocaleString('en-IN')}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-blue-600">Taxable Income</div>
                    <div className="text-xl font-bold text-blue-700">
                      ₹{result.taxableIncome.toLocaleString('en-IN')}
                    </div>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-sm text-red-600">Income Tax</div>
                    <div className="text-xl font-bold text-red-700">
                      ₹{result.incomeTax.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="text-sm text-orange-600">Health & Education Cess (4%)</div>
                    <div className="text-xl font-bold text-orange-700">
                      ₹{result.cess.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="text-sm text-purple-600">Net Income (After Tax)</div>
                    <div className="text-xl font-bold text-purple-700">
                      ₹{result.netIncome.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                    </div>
                  </div>
                </div>

                {/* Tax Slabs */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">
                    Tax Slabs ({taxRegime === 'new' ? 'New Regime' : 'Old Regime'})
                  </h3>
                  <div className="space-y-2 text-sm">
                    {result.taxSlabs.map((slab: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span>
                          ₹{slab.min.toLocaleString('en-IN')} - 
                          {slab.max === Infinity ? ' Above' : ` ₹${slab.max.toLocaleString('en-IN')}`}
                        </span>
                        <span className="font-medium">{slab.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Enter income to calculate tax
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

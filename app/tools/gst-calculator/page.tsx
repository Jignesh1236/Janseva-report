
"use client";
import React, { useState, useEffect } from 'react';

export default function GSTCalculator() {
  const [amount, setAmount] = useState('');
  const [gstRate, setGstRate] = useState('18');
  const [calculationType, setCalculationType] = useState('exclusive'); // exclusive or inclusive
  const [result, setResult] = useState<any>(null);

  const gstRates = [
    { value: '0', label: '0% - Essential items' },
    { value: '5', label: '5% - Daily necessities' },
    { value: '12', label: '12% - Standard items' },
    { value: '18', label: '18% - Most goods' },
    { value: '28', label: '28% - Luxury items' }
  ];

  const calculateGST = () => {
    const baseAmount = parseFloat(amount);
    const rate = parseFloat(gstRate);

    if (!baseAmount || baseAmount <= 0) {
      setResult(null);
      return;
    }

    let gstAmount, totalAmount, netAmount;

    if (calculationType === 'exclusive') {
      // GST to be added to the amount
      netAmount = baseAmount;
      gstAmount = (baseAmount * rate) / 100;
      totalAmount = baseAmount + gstAmount;
    } else {
      // GST already included in the amount
      totalAmount = baseAmount;
      netAmount = (baseAmount * 100) / (100 + rate);
      gstAmount = totalAmount - netAmount;
    }

    setResult({
      netAmount: netAmount,
      gstAmount: gstAmount,
      totalAmount: totalAmount,
      gstRate: rate
    });
  };

  useEffect(() => {
    if (amount) {
      calculateGST();
    }
  }, [amount, gstRate, calculationType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">GST Calculator</h1>
          <p className="text-lg text-gray-600">Calculate GST with different tax rates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">GST Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calculation Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="exclusive"
                      checked={calculationType === 'exclusive'}
                      onChange={(e) => setCalculationType(e.target.value)}
                      className="mr-2"
                    />
                    <span>Exclusive (Add GST)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="inclusive"
                      checked={calculationType === 'inclusive'}
                      onChange={(e) => setCalculationType(e.target.value)}
                      className="mr-2"
                    />
                    <span>Inclusive (Remove GST)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {calculationType === 'exclusive' ? 'Amount (without GST)' : 'Amount (with GST)'} (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="10000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GST Rate
                </label>
                <select
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {gstRates.map((rate) => (
                    <option key={rate.value} value={rate.value}>
                      {rate.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">How it works:</h3>
                <p className="text-sm text-blue-700">
                  {calculationType === 'exclusive' 
                    ? 'Enter the base amount and GST will be calculated and added to it.'
                    : 'Enter the total amount and GST will be calculated and removed from it.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">GST Breakdown</h2>
            
            {result ? (
              <div className="space-y-6">
                {/* Main Result */}
                <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-6 text-center">
                  <div className="text-sm opacity-90">
                    {calculationType === 'exclusive' ? 'Total Amount (with GST)' : 'Net Amount (without GST)'}
                  </div>
                  <div className="text-3xl font-bold">
                    ₹{(calculationType === 'exclusive' ? result.totalAmount : result.netAmount).toLocaleString('en-IN', {maximumFractionDigits: 2})}
                  </div>
                </div>

                {/* Breakdown Cards */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-blue-600">Net Amount (without GST)</div>
                    <div className="text-2xl font-bold text-blue-700">
                      ₹{result.netAmount.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="text-sm text-orange-600">GST Amount ({result.gstRate}%)</div>
                    <div className="text-2xl font-bold text-orange-700">
                      ₹{result.gstAmount.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm text-green-600">Total Amount (with GST)</div>
                    <div className="text-2xl font-bold text-green-700">
                      ₹{result.totalAmount.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                    </div>
                  </div>
                </div>

                {/* Formula */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Calculation Formula</h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    {calculationType === 'exclusive' ? (
                      <>
                        <div>GST Amount = Net Amount × {result.gstRate}%</div>
                        <div>Total Amount = Net Amount + GST Amount</div>
                      </>
                    ) : (
                      <>
                        <div>Net Amount = Total Amount × 100 / (100 + {result.gstRate})</div>
                        <div>GST Amount = Total Amount - Net Amount</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Enter amount to calculate GST
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

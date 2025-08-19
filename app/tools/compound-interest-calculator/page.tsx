
"use client";
import React, { useState, useEffect } from 'react';

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [compoundFrequency, setCompoundFrequency] = useState('12'); // Monthly by default
  const [result, setResult] = useState<any>(null);

  const frequencies = [
    { value: '1', label: 'Annually' },
    { value: '2', label: 'Half-yearly' },
    { value: '4', label: 'Quarterly' },
    { value: '12', label: 'Monthly' },
    { value: '365', label: 'Daily' }
  ];

  const calculateCompoundInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interestRate);
    const t = parseFloat(timePeriod);
    const n = parseFloat(compoundFrequency);

    if (!p || !r || !t || p <= 0 || r <= 0 || t <= 0) {
      setResult(null);
      return;
    }

    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const amount = p * Math.pow((1 + r / (n * 100)), n * t);
    const compoundInterest = amount - p;
    
    // Simple Interest for comparison: SI = P * R * T / 100
    const simpleInterest = (p * r * t) / 100;
    const simpleAmount = p + simpleInterest;
    
    // Additional earnings due to compounding
    const additionalEarnings = compoundInterest - simpleInterest;

    setResult({
      principal: p,
      interestRate: r,
      timePeriod: t,
      frequency: n,
      maturityAmount: amount,
      compoundInterest: compoundInterest,
      simpleInterest: simpleInterest,
      simpleAmount: simpleAmount,
      additionalEarnings: additionalEarnings
    });
  };

  useEffect(() => {
    if (principal && interestRate && timePeriod) {
      calculateCompoundInterest();
    }
  }, [principal, interestRate, timePeriod, compoundFrequency]);

  // Generate year-wise growth data
  const getYearlyGrowth = () => {
    if (!result) return [];
    
    const data = [];
    const p = result.principal;
    const r = result.interestRate;
    const n = result.frequency;
    
    for (let year = 1; year <= result.timePeriod; year++) {
      const amount = p * Math.pow((1 + r / (n * 100)), n * year);
      const interest = amount - p;
      
      data.push({
        year,
        amount,
        interest,
        principal: p
      });
    }
    
    return data;
  };

  const yearlyData = getYearlyGrowth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Compound Interest Calculator</h1>
          <p className="text-lg text-gray-600">Calculate investment growth with compound interest</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Investment Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Principal Amount (₹)
                </label>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="100000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="10"
                  step="0.1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Period (Years)
                </label>
                <input
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  placeholder="5"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compounding Frequency
                </label>
                <select
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {frequencies.map((freq) => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Compound Interest Formula:</h3>
                <p className="text-sm text-green-700">
                  A = P(1 + r/n)^(nt)<br/>
                  Where P = Principal, r = Rate, n = Frequency, t = Time
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Investment Growth</h2>
            
            {result ? (
              <div className="space-y-6">
                {/* Main Result */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg p-6 text-center">
                  <div className="text-sm opacity-90">Maturity Amount</div>
                  <div className="text-3xl font-bold">
                    ₹{result.maturityAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                  </div>
                  <div className="text-sm opacity-90 mt-1">
                    After {result.timePeriod} years
                  </div>
                </div>

                {/* Comparison Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-sm text-blue-600">Principal Amount</div>
                    <div className="text-xl font-bold text-blue-700">
                      ₹{result.principal.toLocaleString('en-IN')}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-sm text-green-600">Compound Interest</div>
                    <div className="text-xl font-bold text-green-700">
                      ₹{result.compoundInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                    </div>
                  </div>
                </div>

                {/* Comparison with Simple Interest */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-3">Compound vs Simple Interest</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Simple Interest:</span>
                      <span>₹{result.simpleInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compound Interest:</span>
                      <span>₹{result.compoundInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-green-700 pt-2 border-t border-yellow-300">
                      <span>Additional Earnings:</span>
                      <span>₹{result.additionalEarnings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                  </div>
                </div>

                {/* Investment Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Investment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Principal Amount:</span>
                      <span>₹{result.principal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span>{result.interestRate}% per annum</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Period:</span>
                      <span>{result.timePeriod} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compounding:</span>
                      <span>{frequencies.find(f => f.value === compoundFrequency)?.label}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Final Amount:</span>
                      <span>₹{result.maturityAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                  </div>
                </div>

                {/* Year-wise Growth */}
                {yearlyData.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Year-wise Growth</h3>
                    <div className="max-h-48 overflow-y-auto">
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3 font-medium text-gray-700 pb-2 border-b">
                          <span>Year</span>
                          <span>Interest Earned</span>
                          <span>Total Amount</span>
                        </div>
                        {yearlyData.map((data, index) => (
                          <div key={index} className="grid grid-cols-3">
                            <span>{data.year}</span>
                            <span>₹{data.interest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                            <span className="font-medium">₹{data.amount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Enter investment details to calculate compound interest
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

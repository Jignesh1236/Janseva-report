
"use client";
import React, { useState, useEffect } from 'react';

export default function SIPCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [timePeriod, setTimePeriod] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateSIP = () => {
    const monthly = parseFloat(monthlyAmount);
    const annualReturn = parseFloat(expectedReturn);
    const years = parseFloat(timePeriod);

    if (!monthly || !annualReturn || !years || monthly <= 0 || years <= 0) {
      setResult(null);
      return;
    }

    // Monthly interest rate
    const monthlyRate = annualReturn / (12 * 100);
    
    // Total number of payments
    const totalPayments = years * 12;
    
    // SIP Future Value calculation using compound interest formula
    // FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    const futureValue = monthly * [((Math.pow(1 + monthlyRate, totalPayments) - 1) / monthlyRate) * (1 + monthlyRate)];
    
    const totalInvestment = monthly * totalPayments;
    const totalReturns = futureValue - totalInvestment;

    setResult({
      monthlyInvestment: monthly,
      totalInvestment: totalInvestment,
      totalReturns: totalReturns,
      maturityAmount: futureValue,
      years: years,
      expectedReturn: annualReturn
    });
  };

  useEffect(() => {
    if (monthlyAmount && expectedReturn && timePeriod) {
      calculateSIP();
    }
  }, [monthlyAmount, expectedReturn, timePeriod]);

  // Chart data for visualization
  const getChartData = () => {
    if (!result) return [];
    
    const data = [];
    const monthly = result.monthlyInvestment;
    const rate = result.expectedReturn / (12 * 100);
    
    for (let year = 1; year <= result.years; year++) {
      const months = year * 12;
      const investment = monthly * months;
      const futureValue = monthly * [((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate)];
      const returns = futureValue - investment;
      
      data.push({
        year,
        investment,
        returns,
        total: futureValue
      });
    }
    
    return data;
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SIP Calculator</h1>
          <p className="text-lg text-gray-600">Calculate mutual fund SIP returns and investment growth</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">SIP Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Investment Amount (₹)
                </label>
                <input
                  type="number"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(e.target.value)}
                  placeholder="5000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  placeholder="12"
                  step="0.1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="mt-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Conservative: 8-10%</span>
                    <span>Moderate: 10-12%</span>
                    <span>Aggressive: 12-15%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Period (Years)
                </label>
                <input
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  placeholder="10"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">What is SIP?</h3>
                <p className="text-sm text-blue-700">
                  Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly 
                  in mutual funds, leveraging the power of compounding and rupee cost averaging.
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Investment Returns</h2>
            
            {result ? (
              <div className="space-y-6">
                {/* Main Result */}
                <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-6 text-center">
                  <div className="text-sm opacity-90">Maturity Amount</div>
                  <div className="text-3xl font-bold">
                    ₹{result.maturityAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                  </div>
                  <div className="text-sm opacity-90 mt-1">
                    After {result.years} years
                  </div>
                </div>

                {/* Breakdown Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-sm text-blue-600">Total Investment</div>
                    <div className="text-xl font-bold text-blue-700">
                      ₹{result.totalInvestment.toLocaleString('en-IN')}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-sm text-green-600">Total Returns</div>
                    <div className="text-xl font-bold text-green-700">
                      ₹{result.totalReturns.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                    </div>
                  </div>
                </div>

                {/* Investment Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Investment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monthly SIP:</span>
                      <span>₹{result.monthlyInvestment.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment Period:</span>
                      <span>{result.years} years ({result.years * 12} months)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Return:</span>
                      <span>{result.expectedReturn}% p.a.</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Investment:</span>
                      <span>₹{result.totalInvestment.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Returns:</span>
                      <span>₹{result.totalReturns.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Maturity Amount:</span>
                      <span>₹{result.maturityAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                  </div>
                </div>

                {/* Year-wise Growth */}
                {chartData.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Year-wise Growth</h3>
                    <div className="max-h-48 overflow-y-auto">
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-4 font-medium text-gray-700 pb-2 border-b">
                          <span>Year</span>
                          <span>Invested</span>
                          <span>Returns</span>
                          <span>Total</span>
                        </div>
                        {chartData.map((data, index) => (
                          <div key={index} className="grid grid-cols-4">
                            <span>{data.year}</span>
                            <span>₹{(data.investment/100000).toFixed(1)}L</span>
                            <span>₹{(data.returns/100000).toFixed(1)}L</span>
                            <span className="font-medium">₹{(data.total/100000).toFixed(1)}L</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Enter SIP details to calculate returns
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

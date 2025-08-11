
"use client";
import React, { useState, useEffect } from 'react';

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTenure, setLoanTenure] = useState('');
  const [tenureType, setTenureType] = useState('years');
  const [result, setResult] = useState<any>(null);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const tenure = parseFloat(loanTenure);

    if (!principal || !rate || !tenure || principal <= 0 || rate <= 0 || tenure <= 0) {
      alert('Please enter valid values for all fields');
      return;
    }

    // Convert annual rate to monthly rate
    const monthlyRate = rate / (12 * 100);
    
    // Convert tenure to months
    const months = tenureType === 'years' ? tenure * 12 : tenure;

    // EMI calculation formula
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);

    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    setResult({
      emi: emi,
      totalAmount: totalAmount,
      totalInterest: totalInterest,
      principal: principal,
      months: months
    });
  };

  useEffect(() => {
    if (loanAmount && interestRate && loanTenure) {
      calculateEMI();
    }
  }, [loanAmount, interestRate, loanTenure, tenureType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">EMI Calculator</h1>
          <p className="text-lg text-gray-600">Calculate loan EMI and interest</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Loan Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="1000000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate (% per annum)
                </label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="8.5"
                  step="0.1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Tenure
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value)}
                    placeholder="20"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={tenureType}
                    onChange={(e) => setTenureType(e.target.value)}
                    className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>

              <button
                onClick={calculateEMI}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Calculate EMI
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">EMI Details</h2>
            
            {result ? (
              <div className="space-y-6">
                {/* EMI Amount */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 text-center">
                  <div className="text-sm opacity-90">Monthly EMI</div>
                  <div className="text-3xl font-bold">₹{result.emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-sm text-green-600">Principal Amount</div>
                    <div className="text-xl font-bold text-green-700">
                      ₹{result.principal.toLocaleString('en-IN')}
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <div className="text-sm text-orange-600">Total Interest</div>
                    <div className="text-xl font-bold text-orange-700">
                      ₹{result.totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center sm:col-span-2">
                    <div className="text-sm text-purple-600">Total Amount Payable</div>
                    <div className="text-2xl font-bold text-purple-700">
                      ₹{result.totalAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Loan Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Loan Amount:</span>
                      <span>₹{result.principal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Interest:</span>
                      <span>₹{result.totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Payable:</span>
                      <span>₹{result.totalAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loan Tenure:</span>
                      <span>{result.months} months</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Monthly EMI:</span>
                      <span>₹{result.emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Enter loan details to calculate EMI
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

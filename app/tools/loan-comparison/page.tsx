
"use client";
import React, { useState } from 'react';

interface Loan {
  id: string;
  bankName: string;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  processingFee: number;
  prepaymentCharges: number;
}

export default function LoanComparison() {
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: '1',
      bankName: 'Bank A',
      loanAmount: 1000000,
      interestRate: 8.5,
      tenure: 20,
      processingFee: 10000,
      prepaymentCharges: 2
    },
    {
      id: '2',
      bankName: 'Bank B',
      loanAmount: 1000000,
      interestRate: 9.0,
      tenure: 20,
      processingFee: 15000,
      prepaymentCharges: 3
    }
  ]);

  const addLoan = () => {
    const newLoan: Loan = {
      id: Date.now().toString(),
      bankName: `Bank ${String.fromCharCode(65 + loans.length)}`,
      loanAmount: 1000000,
      interestRate: 8.5,
      tenure: 20,
      processingFee: 10000,
      prepaymentCharges: 2
    };
    setLoans([...loans, newLoan]);
  };

  const removeLoan = (id: string) => {
    setLoans(loans.filter(loan => loan.id !== id));
  };

  const updateLoan = (id: string, field: keyof Loan, value: string | number) => {
    setLoans(loans.map(loan => 
      loan.id === id ? { ...loan, [field]: value } : loan
    ));
  };

  const calculateEMI = (principal: number, rate: number, tenure: number) => {
    const monthlyRate = rate / (12 * 100);
    const months = tenure * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    return emi;
  };

  const calculateLoanDetails = (loan: Loan) => {
    const emi = calculateEMI(loan.loanAmount, loan.interestRate, loan.tenure);
    const totalAmount = emi * loan.tenure * 12;
    const totalInterest = totalAmount - loan.loanAmount;
    const totalCost = totalAmount + loan.processingFee;

    return {
      emi,
      totalAmount,
      totalInterest,
      totalCost,
      processingFee: loan.processingFee,
      prepaymentCharges: loan.prepaymentCharges
    };
  };

  const getBestLoan = () => {
    if (loans.length === 0) return null;
    
    return loans.reduce((best, current) => {
      const bestDetails = calculateLoanDetails(best);
      const currentDetails = calculateLoanDetails(current);
      
      return currentDetails.totalCost < bestDetails.totalCost ? current : best;
    });
  };

  const bestLoan = getBestLoan();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Loan Comparison Tool</h1>
          <p className="text-lg text-gray-600">Compare different loan offers and find the best deal</p>
        </div>

        {/* Add Loan Button */}
        <div className="mb-6 text-center">
          <button
            onClick={addLoan}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            + Add Another Loan
          </button>
        </div>

        {/* Loan Input Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loans.map((loan) => (
            <div key={loan.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  value={loan.bankName}
                  onChange={(e) => updateLoan(loan.id, 'bankName', e.target.value)}
                  className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                />
                {loans.length > 1 && (
                  <button
                    onClick={() => removeLoan(loan.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loan Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={loan.loanAmount}
                    onChange={(e) => updateLoan(loan.id, 'loanAmount', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interest Rate (% p.a.)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={loan.interestRate}
                    onChange={(e) => updateLoan(loan.id, 'interestRate', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tenure (Years)
                  </label>
                  <input
                    type="number"
                    value={loan.tenure}
                    onChange={(e) => updateLoan(loan.id, 'tenure', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Processing Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={loan.processingFee}
                    onChange={(e) => updateLoan(loan.id, 'processingFee', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prepayment Charges (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={loan.prepaymentCharges}
                    onChange={(e) => updateLoan(loan.id, 'prepaymentCharges', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <h2 className="text-2xl font-bold">Loan Comparison Results</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Bank Name</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">Loan Amount</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">Interest Rate</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">Monthly EMI</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">Total Interest</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">Processing Fee</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">Total Cost</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">Best Deal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loans.map((loan) => {
                  const details = calculateLoanDetails(loan);
                  const isBest = bestLoan?.id === loan.id;
                  
                  return (
                    <tr key={loan.id} className={isBest ? 'bg-green-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {loan.bankName}
                        {isBest && <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">BEST</span>}
                      </td>
                      <td className="px-6 py-4 text-right">₹{loan.loanAmount.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-right">{loan.interestRate}%</td>
                      <td className="px-6 py-4 text-right font-semibold">
                        ₹{details.emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                      </td>
                      <td className="px-6 py-4 text-right">
                        ₹{details.totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                      </td>
                      <td className="px-6 py-4 text-right">₹{loan.processingFee.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-right font-bold text-lg">
                        ₹{details.totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isBest && <span className="text-green-500 text-2xl">★</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Best Deal Summary */}
        {bestLoan && (
          <div className="mt-8 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">🏆 Best Loan Deal</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm opacity-90">Bank</div>
                <div className="text-2xl font-bold">{bestLoan.bankName}</div>
              </div>
              <div>
                <div className="text-sm opacity-90">Monthly EMI</div>
                <div className="text-2xl font-bold">
                  ₹{calculateLoanDetails(bestLoan).emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                </div>
              </div>
              <div>
                <div className="text-sm opacity-90">Total Cost</div>
                <div className="text-2xl font-bold">
                  ₹{calculateLoanDetails(bestLoan).totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">💡 Loan Comparison Tips</h3>
          <ul className="text-sm text-yellow-700 space-y-2">
            <li>• Compare the total cost of the loan, not just the interest rate</li>
            <li>• Consider processing fees and other charges</li>
            <li>• Check prepayment penalties if you plan to close the loan early</li>
            <li>• Look for offers on loan insurance and other add-on products</li>
            <li>• Compare the flexibility in EMI payment dates and options</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

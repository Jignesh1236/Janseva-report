
"use client";
import React, { useState, useRef } from 'react';
import Link from 'next/link';

interface BillData {
  billNumber: string;
  date: string;
  customerName: string;
  customerAddress: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
}

interface CompanyData {
  name: string;
  address: string;
  phone: string;
  email: string;
  gst: string;
}

export default function BillBookGenerator() {
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: 'Your Company Name',
    address: 'Your Address',
    phone: '+91 9876543210',
    email: 'info@company.com',
    gst: 'GST123456789'
  });

  const [billData, setBillData] = useState<BillData>({
    billNumber: 'BILL-001',
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    customerAddress: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: ''
  });

  const [taxRate, setTaxRate] = useState(18);
  const billRef = useRef<HTMLDivElement>(null);

  const addItem = () => {
    setBillData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setBillData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setBillData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      if (field === 'quantity' || field === 'rate') {
        newItems[index].amount = newItems[index].quantity * newItems[index].rate;
      }
      
      return { ...prev, items: newItems };
    });
  };

  const calculateTotals = () => {
    const subtotal = billData.items.reduce((sum, item) => sum + item.amount, 0);
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax;
    
    setBillData(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }));
  };

  React.useEffect(() => {
    calculateTotals();
  }, [billData.items, taxRate]);

  const generatePDF = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const resetForm = () => {
    setBillData({
      billNumber: `BILL-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      customerName: '',
      customerAddress: '',
      items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      subtotal: 0,
      tax: 0,
      total: 0,
      notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 print:hidden">
          <Link href="/tools" className="inline-flex items-center text-green-600 hover:text-green-800 mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bill Book Generator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create professional bills and invoices with customizable templates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Form */}
          <div className="lg:col-span-1 space-y-6 print:hidden">
            {/* Company Information */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Company Information</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={companyData.name}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Address"
                  value={companyData.address}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={companyData.phone}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={companyData.email}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="GST Number"
                  value={companyData.gst}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, gst: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Bill Details */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Bill Details</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Bill Number"
                  value={billData.billNumber}
                  onChange={(e) => setBillData(prev => ({ ...prev, billNumber: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={billData.date}
                  onChange={(e) => setBillData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={billData.customerName}
                  onChange={(e) => setBillData(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Customer Address"
                  value={billData.customerAddress}
                  onChange={(e) => setBillData(prev => ({ ...prev, customerAddress: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            {/* Items */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Items</h2>
              <div className="space-y-4">
                {billData.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Item Description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Rate"
                          value={item.rate}
                          onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Amount"
                          value={item.amount.toFixed(2)}
                          readOnly
                          className="p-2 border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                      {billData.items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove Item
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  onClick={addItem}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors duration-200"
                >
                  + Add Item
                </button>
              </div>
            </div>

            {/* Tax & Total */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tax & Total</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <textarea
                  placeholder="Additional Notes"
                  value={billData.notes}
                  onChange={(e) => setBillData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={generatePDF}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                >
                  Generate PDF
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                >
                  Reset Form
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Bill Preview */}
          <div ref={billRef} className="lg:col-span-2 bg-white shadow-xl rounded-xl overflow-hidden print:shadow-none print:rounded-none">
            <div className="p-8 print:p-6">
              {/* Header */}
              <div className="border-b-2 border-gray-200 pb-6 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{companyData.name}</h1>
                    <div className="mt-2 text-gray-600">
                      <p>{companyData.address}</p>
                      <p>Phone: {companyData.phone}</p>
                      <p>Email: {companyData.email}</p>
                      <p>GST: {companyData.gst}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-green-600">BILL</h2>
                    <p className="text-gray-600">#{billData.billNumber}</p>
                    <p className="text-gray-600">{new Date(billData.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Bill To:</h3>
                <div className="text-gray-600">
                  <p className="font-medium">{billData.customerName}</p>
                  <p>{billData.customerAddress}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 text-left">Description</th>
                      <th className="border border-gray-300 p-3 text-center">Qty</th>
                      <th className="border border-gray-300 p-3 text-right">Rate</th>
                      <th className="border border-gray-300 p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-3">{item.description}</td>
                        <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                        <td className="border border-gray-300 p-3 text-right">₹{item.rate.toFixed(2)}</td>
                        <td className="border border-gray-300 p-3 text-right">₹{item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-6">
                <div className="w-64">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Subtotal:</span>
                    <span>₹{billData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Tax ({taxRate}%):</span>
                    <span>₹{billData.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold text-lg border-t-2 border-gray-300">
                    <span>Total:</span>
                    <span>₹{billData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {billData.notes && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Notes:</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{billData.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-gray-200 pt-4 mt-8 text-center text-gray-500 text-sm">
                <p>Thank you for your business!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

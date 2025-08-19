
"use client";
import React, { useState, useRef } from 'react';
import Link from 'next/link';

interface QuotationData {
  quotationNumber: string;
  date: string;
  validUntil: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  terms: string;
  notes: string;
}

interface CompanyData {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  gst: string;
}

export default function QuotationGenerator() {
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: 'Your Company Name',
    address: 'Your Address',
    phone: '+91 9876543210',
    email: 'info@company.com',
    website: 'www.company.com',
    gst: 'GST123456789'
  });

  const [quotationData, setQuotationData] = useState<QuotationData>({
    quotationNumber: 'QT-001',
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    terms: 'Payment due within 30 days\nPrices are valid for 30 days\nAll prices are exclusive of taxes',
    notes: ''
  });

  const [taxRate, setTaxRate] = useState(18);
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const quotationRef = useRef<HTMLDivElement>(null);

  const addItem = () => {
    setQuotationData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setQuotationData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setQuotationData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      if (field === 'quantity' || field === 'rate') {
        newItems[index].amount = newItems[index].quantity * newItems[index].rate;
      }
      
      return { ...prev, items: newItems };
    });
  };

  const calculateTotals = () => {
    const subtotal = quotationData.items.reduce((sum, item) => sum + item.amount, 0);
    
    let discount = 0;
    if (discountType === 'percentage') {
      discount = (subtotal * discountValue) / 100;
    } else {
      discount = discountValue;
    }
    
    const discountedAmount = subtotal - discount;
    const tax = (discountedAmount * taxRate) / 100;
    const total = discountedAmount + tax;
    
    setQuotationData(prev => ({
      ...prev,
      subtotal,
      discount,
      tax,
      total
    }));
  };

  React.useEffect(() => {
    calculateTotals();
  }, [quotationData.items, taxRate, discountValue, discountType]);

  const generatePDF = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const resetForm = () => {
    setQuotationData({
      quotationNumber: `QT-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      terms: 'Payment due within 30 days\nPrices are valid for 30 days\nAll prices are exclusive of taxes',
      notes: ''
    });
    setDiscountValue(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 print:hidden">
          <Link href="/tools" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Quotation Generator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create professional quotations with detailed pricing and terms
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Address"
                  value={companyData.address}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={companyData.phone}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={companyData.email}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="url"
                  placeholder="Website"
                  value={companyData.website}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quotation Details */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quotation Details</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Quotation Number"
                  value={quotationData.quotationNumber}
                  onChange={(e) => setQuotationData(prev => ({ ...prev, quotationNumber: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={quotationData.date}
                      onChange={(e) => setQuotationData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
                    <input
                      type="date"
                      value={quotationData.validUntil}
                      onChange={(e) => setQuotationData(prev => ({ ...prev, validUntil: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Details</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={quotationData.customerName}
                  onChange={(e) => setQuotationData(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Customer Email"
                  value={quotationData.customerEmail}
                  onChange={(e) => setQuotationData(prev => ({ ...prev, customerEmail: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Customer Phone"
                  value={quotationData.customerPhone}
                  onChange={(e) => setQuotationData(prev => ({ ...prev, customerPhone: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Customer Address"
                  value={quotationData.customerAddress}
                  onChange={(e) => setQuotationData(prev => ({ ...prev, customerAddress: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            {/* Items */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Items/Services</h2>
              <div className="space-y-4">
                {quotationData.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <textarea
                        placeholder="Item/Service Description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={2}
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Rate"
                          value={item.rate}
                          onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Amount"
                          value={item.amount.toFixed(2)}
                          readOnly
                          className="p-2 border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                      {quotationData.items.length > 1 && (
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
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors duration-200"
                >
                  + Add Item
                </button>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Pricing</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                  <div className="flex space-x-2">
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'amount')}
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="percentage">%</option>
                      <option value="amount">₹</option>
                    </select>
                    <input
                      type="number"
                      placeholder="0"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Terms & Notes */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Terms & Notes</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                  <textarea
                    placeholder="Terms and conditions"
                    value={quotationData.terms}
                    onChange={(e) => setQuotationData(prev => ({ ...prev, terms: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    placeholder="Additional notes"
                    value={quotationData.notes}
                    onChange={(e) => setQuotationData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={generatePDF}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
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

          {/* Right Panel - Quotation Preview */}
          <div ref={quotationRef} className="lg:col-span-2 bg-white shadow-xl rounded-xl overflow-hidden print:shadow-none print:rounded-none">
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
                      <p>Website: {companyData.website}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-indigo-600">QUOTATION</h2>
                    <p className="text-gray-600">#{quotationData.quotationNumber}</p>
                    <p className="text-gray-600">Date: {new Date(quotationData.date).toLocaleDateString()}</p>
                    <p className="text-gray-600">Valid Until: {new Date(quotationData.validUntil).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Quote To:</h3>
                <div className="text-gray-600">
                  <p className="font-medium">{quotationData.customerName}</p>
                  <p>{quotationData.customerEmail}</p>
                  <p>{quotationData.customerPhone}</p>
                  <p>{quotationData.customerAddress}</p>
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
                    {quotationData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-3 whitespace-pre-wrap">{item.description}</td>
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
                    <span>₹{quotationData.subtotal.toFixed(2)}</span>
                  </div>
                  {quotationData.discount > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Discount:</span>
                      <span>-₹{quotationData.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Tax ({taxRate}%):</span>
                    <span>₹{quotationData.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold text-lg border-t-2 border-gray-300">
                    <span>Total:</span>
                    <span>₹{quotationData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              {quotationData.terms && (
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Terms & Conditions:</h4>
                  <p className="text-gray-600 whitespace-pre-wrap text-sm">{quotationData.terms}</p>
                </div>
              )}

              {/* Notes */}
              {quotationData.notes && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Notes:</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{quotationData.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-gray-200 pt-4 mt-8 text-center text-gray-500 text-sm">
                <p>Thank you for considering our services. We look forward to working with you!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

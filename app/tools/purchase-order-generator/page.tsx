
"use client";
import React, { useState, useRef } from 'react';
import Link from 'next/link';

interface PurchaseOrderData {
  poNumber: string;
  date: string;
  expectedDelivery: string;
  supplierName: string;
  supplierEmail: string;
  supplierPhone: string;
  supplierAddress: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  terms: string;
  notes: string;
  status: string;
}

interface CompanyData {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  contactPerson: string;
}

export default function PurchaseOrderGenerator() {
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: 'Your Company Name',
    address: 'Your Address',
    phone: '+91 9876543210',
    email: 'info@company.com',
    website: 'www.company.com',
    contactPerson: 'John Doe'
  });

  const [poData, setPOData] = useState<PurchaseOrderData>({
    poNumber: 'PO-001',
    date: new Date().toISOString().split('T')[0],
    expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    supplierName: '',
    supplierEmail: '',
    supplierPhone: '',
    supplierAddress: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
    subtotal: 0,
    tax: 0,
    total: 0,
    terms: 'Payment due within 30 days of delivery\nGoods to be delivered to company address\nAll items must meet quality specifications',
    notes: '',
    status: 'Pending'
  });

  const [taxRate, setTaxRate] = useState(18);
  const poRef = useRef<HTMLDivElement>(null);

  const statusOptions = ['Pending', 'Approved', 'Sent', 'Delivered', 'Cancelled'];

  const addItem = () => {
    setPOData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setPOData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setPOData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      if (field === 'quantity' || field === 'unitPrice') {
        newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;
      }
      
      return { ...prev, items: newItems };
    });
  };

  const calculateTotals = () => {
    const subtotal = poData.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax;
    
    setPOData(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }));
  };

  React.useEffect(() => {
    calculateTotals();
  }, [poData.items, taxRate]);

  const generatePDF = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const resetForm = () => {
    setPOData({
      poNumber: `PO-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      supplierName: '',
      supplierEmail: '',
      supplierPhone: '',
      supplierAddress: '',
      items: [{ description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
      subtotal: 0,
      tax: 0,
      total: 0,
      terms: 'Payment due within 30 days of delivery\nGoods to be delivered to company address\nAll items must meet quality specifications',
      notes: '',
      status: 'Pending'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-blue-100 text-blue-800';
      case 'Sent': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 print:hidden">
          <Link href="/tools" className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Purchase Order Generator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create professional purchase orders for your suppliers and vendors
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Address"
                  value={companyData.address}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={companyData.phone}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={companyData.email}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Contact Person"
                  value={companyData.contactPerson}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, contactPerson: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* PO Details */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Purchase Order Details</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="PO Number"
                  value={poData.poNumber}
                  onChange={(e) => setPOData(prev => ({ ...prev, poNumber: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={poData.date}
                      onChange={(e) => setPOData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery</label>
                    <input
                      type="date"
                      value={poData.expectedDelivery}
                      onChange={(e) => setPOData(prev => ({ ...prev, expectedDelivery: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={poData.status}
                    onChange={(e) => setPOData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Supplier Details */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Supplier Details</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Supplier Name"
                  value={poData.supplierName}
                  onChange={(e) => setPOData(prev => ({ ...prev, supplierName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Supplier Email"
                  value={poData.supplierEmail}
                  onChange={(e) => setPOData(prev => ({ ...prev, supplierEmail: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Supplier Phone"
                  value={poData.supplierPhone}
                  onChange={(e) => setPOData(prev => ({ ...prev, supplierPhone: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Supplier Address"
                  value={poData.supplierAddress}
                  onChange={(e) => setPOData(prev => ({ ...prev, supplierAddress: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            {/* Items */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Items to Purchase</h2>
              <div className="space-y-4">
                {poData.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <textarea
                        placeholder="Item Description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        rows={2}
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Unit Price"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Total"
                          value={item.totalPrice.toFixed(2)}
                          readOnly
                          className="p-2 border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                      {poData.items.length > 1 && (
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
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors duration-200"
                >
                  + Add Item
                </button>
              </div>
            </div>

            {/* Tax & Terms */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tax & Terms</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                  <textarea
                    placeholder="Terms and conditions"
                    value={poData.terms}
                    onChange={(e) => setPOData(prev => ({ ...prev, terms: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    placeholder="Additional notes"
                    value={poData.notes}
                    onChange={(e) => setPOData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium"
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

          {/* Right Panel - PO Preview */}
          <div ref={poRef} className="lg:col-span-2 bg-white shadow-xl rounded-xl overflow-hidden print:shadow-none print:rounded-none">
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
                      <p>Contact: {companyData.contactPerson}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-orange-600">PURCHASE ORDER</h2>
                    <p className="text-gray-600">#{poData.poNumber}</p>
                    <p className="text-gray-600">Date: {new Date(poData.date).toLocaleDateString()}</p>
                    <p className="text-gray-600">Expected Delivery: {new Date(poData.expectedDelivery).toLocaleDateString()}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(poData.status)}`}>
                      {poData.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supplier Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Supplier:</h3>
                <div className="text-gray-600">
                  <p className="font-medium">{poData.supplierName}</p>
                  <p>{poData.supplierEmail}</p>
                  <p>{poData.supplierPhone}</p>
                  <p>{poData.supplierAddress}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 text-left">Description</th>
                      <th className="border border-gray-300 p-3 text-center">Qty</th>
                      <th className="border border-gray-300 p-3 text-right">Unit Price</th>
                      <th className="border border-gray-300 p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {poData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-3 whitespace-pre-wrap">{item.description}</td>
                        <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                        <td className="border border-gray-300 p-3 text-right">₹{item.unitPrice.toFixed(2)}</td>
                        <td className="border border-gray-300 p-3 text-right">₹{item.totalPrice.toFixed(2)}</td>
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
                    <span>₹{poData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Tax ({taxRate}%):</span>
                    <span>₹{poData.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold text-lg border-t-2 border-gray-300">
                    <span>Total:</span>
                    <span>₹{poData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              {poData.terms && (
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Terms & Conditions:</h4>
                  <p className="text-gray-600 whitespace-pre-wrap text-sm">{poData.terms}</p>
                </div>
              )}

              {/* Notes */}
              {poData.notes && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Additional Notes:</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{poData.notes}</p>
                </div>
              )}

              {/* Signature Section */}
              <div className="border-t border-gray-200 pt-8 mt-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-600 mb-2">Authorized By:</p>
                    <div className="border-b border-gray-300 h-12 mb-2"></div>
                    <p className="text-sm text-gray-500">Signature & Date</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2">Supplier Acknowledgment:</p>
                    <div className="border-b border-gray-300 h-12 mb-2"></div>
                    <p className="text-sm text-gray-500">Signature & Date</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

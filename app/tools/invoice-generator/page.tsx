
"use client";
import React, { useState } from 'react';
import { Download, Plus, Trash2, Calculator } from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  fromName: string;
  fromAddress: string;
  fromEmail: string;
  fromPhone: string;
  toName: string;
  toAddress: string;
  toEmail: string;
  toPhone: string;
  items: InvoiceItem[];
  notes: string;
  taxRate: number;
}

export default function InvoiceGenerator() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fromName: '',
    fromAddress: '',
    fromEmail: '',
    fromPhone: '',
    toName: '',
    toAddress: '',
    toEmail: '',
    toPhone: '',
    items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }],
    notes: '',
    taxRate: 0
  });

  const updateInvoiceData = (field: keyof InvoiceData, value: any) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    updateInvoiceData('items', [...invoiceData.items, newItem]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = invoiceData.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });
    updateInvoiceData('items', updatedItems);
  };

  const removeItem = (id: string) => {
    if (invoiceData.items.length > 1) {
      updateInvoiceData('items', invoiceData.items.filter(item => item.id !== id));
    }
  };

  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (invoiceData.taxRate / 100);
  const total = subtotal + taxAmount;

  const generatePDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(24);
      doc.text('INVOICE', 20, 30);
      
      // Invoice details
      doc.setFontSize(12);
      doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 20, 50);
      doc.text(`Date: ${invoiceData.date}`, 20, 60);
      doc.text(`Due Date: ${invoiceData.dueDate}`, 20, 70);
      
      // From section
      doc.setFontSize(14);
      doc.text('From:', 20, 90);
      doc.setFontSize(10);
      doc.text(invoiceData.fromName, 20, 100);
      doc.text(invoiceData.fromAddress, 20, 110);
      doc.text(invoiceData.fromEmail, 20, 120);
      doc.text(invoiceData.fromPhone, 20, 130);
      
      // To section
      doc.setFontSize(14);
      doc.text('To:', 120, 90);
      doc.setFontSize(10);
      doc.text(invoiceData.toName, 120, 100);
      doc.text(invoiceData.toAddress, 120, 110);
      doc.text(invoiceData.toEmail, 120, 120);
      doc.text(invoiceData.toPhone, 120, 130);
      
      // Items table
      let yPos = 160;
      doc.setFontSize(12);
      doc.text('Description', 20, yPos);
      doc.text('Qty', 120, yPos);
      doc.text('Rate', 140, yPos);
      doc.text('Amount', 170, yPos);
      
      yPos += 10;
      doc.line(20, yPos, 190, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      invoiceData.items.forEach(item => {
        doc.text(item.description, 20, yPos);
        doc.text(item.quantity.toString(), 120, yPos);
        doc.text(`$${item.rate.toFixed(2)}`, 140, yPos);
        doc.text(`$${item.amount.toFixed(2)}`, 170, yPos);
        yPos += 10;
      });
      
      yPos += 10;
      doc.line(20, yPos, 190, yPos);
      yPos += 10;
      
      // Totals
      doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, yPos);
      yPos += 10;
      doc.text(`Tax (${invoiceData.taxRate}%): $${taxAmount.toFixed(2)}`, 140, yPos);
      yPos += 10;
      doc.setFontSize(12);
      doc.text(`Total: $${total.toFixed(2)}`, 140, yPos);
      
      // Notes
      if (invoiceData.notes) {
        yPos += 20;
        doc.setFontSize(10);
        doc.text('Notes:', 20, yPos);
        yPos += 10;
        doc.text(invoiceData.notes, 20, yPos);
      }
      
      doc.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Invoice Generator</h1>
          <p className="text-lg text-gray-600">Create professional invoices instantly</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number
              </label>
              <input
                type="text"
                value={invoiceData.invoiceNumber}
                onChange={(e) => updateInvoiceData('invoiceNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={invoiceData.date}
                onChange={(e) => updateInvoiceData('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => updateInvoiceData('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* From/To Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">From</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name/Company"
                  value={invoiceData.fromName}
                  onChange={(e) => updateInvoiceData('fromName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Your Address"
                  rows={3}
                  value={invoiceData.fromAddress}
                  onChange={(e) => updateInvoiceData('fromAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={invoiceData.fromEmail}
                  onChange={(e) => updateInvoiceData('fromEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Your Phone"
                  value={invoiceData.fromPhone}
                  onChange={(e) => updateInvoiceData('fromPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">To</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Client Name/Company"
                  value={invoiceData.toName}
                  onChange={(e) => updateInvoiceData('toName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Client Address"
                  rows={3}
                  value={invoiceData.toAddress}
                  onChange={(e) => updateInvoiceData('toAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="client@email.com"
                  value={invoiceData.toEmail}
                  onChange={(e) => updateInvoiceData('toEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Client Phone"
                  value={invoiceData.toPhone}
                  onChange={(e) => updateInvoiceData('toPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Items</h3>
              <button
                onClick={addItem}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoiceData.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${item.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={invoiceData.items.length === 1}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals and Tax */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                rows={4}
                placeholder="Additional notes or payment terms"
                value={invoiceData.notes}
                onChange={(e) => updateInvoiceData('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={invoiceData.taxRate}
                      onChange={(e) => updateInvoiceData('taxRate', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Tax ({invoiceData.taxRate}%):</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={generatePDF}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Download className="h-5 w-5 mr-2" />
              Generate Invoice PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

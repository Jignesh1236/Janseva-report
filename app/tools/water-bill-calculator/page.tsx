
"use client";
import React, { useState } from 'react';

export default function WaterBillCalculator() {
  const [connectionType, setConnectionType] = useState('domestic');
  const [usage, setUsage] = useState('');
  const [waterSource, setWaterSource] = useState('municipal');
  const [result, setResult] = useState<any>(null);

  const waterRates = {
    municipal: {
      domestic: [
        { min: 0, max: 20, rate: 5 },
        { min: 21, max: 50, rate: 8 },
        { min: 51, max: 100, rate: 12 },
        { min: 101, max: Infinity, rate: 18 }
      ],
      commercial: [
        { min: 0, max: 50, rate: 15 },
        { min: 51, max: 100, rate: 20 },
        { min: 101, max: Infinity, rate: 25 }
      ]
    },
    borewell: {
      domestic: [{ min: 0, max: Infinity, rate: 3 }],
      commercial: [{ min: 0, max: Infinity, rate: 5 }]
    }
  };

  const calculateBill = () => {
    const totalUsage = parseFloat(usage);
    
    if (!totalUsage || totalUsage <= 0) {
      alert('Please enter valid water usage');
      return;
    }

    const rates = waterRates[waterSource as keyof typeof waterRates][connectionType as keyof typeof waterRates.municipal];
    let totalCost = 0;
    let breakdown = [];
    let remainingUsage = totalUsage;

    for (const slab of rates) {
      if (remainingUsage <= 0) break;
      
      const slabUsage = Math.min(remainingUsage, slab.max === Infinity ? remainingUsage : slab.max - slab.min + 1);
      const slabCost = slabUsage * slab.rate;
      
      breakdown.push({
        range: slab.max === Infinity ? `${slab.min}+ KL` : `${slab.min}-${slab.max} KL`,
        usage: slabUsage,
        rate: slab.rate,
        cost: slabCost
      });
      
      totalCost += slabCost;
      remainingUsage -= slabUsage;
    }

    // Additional charges
    const sewerageCharge = totalCost * 0.25; // 25% of water charges
    const fixedCharge = connectionType === 'domestic' ? 50 : 150;
    const serviceTax = (totalCost + sewerageCharge + fixedCharge) * 0.18;
    const finalAmount = totalCost + sewerageCharge + fixedCharge + serviceTax;

    setResult({
      totalUsage,
      breakdown,
      waterCharges: totalCost,
      sewerageCharge,
      fixedCharge,
      serviceTax,
      finalAmount
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Water Bill Calculator</h1>
          <p className="text-lg text-gray-600">Calculate water charges based on usage</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water Source
                </label>
                <select
                  value={waterSource}
                  onChange={(e) => setWaterSource(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="municipal">Municipal Water</option>
                  <option value="borewell">Borewell/Private</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection Type
                </label>
                <select
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="domestic">Domestic</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water Usage (in KiloLitres)
                </label>
                <input
                  type="number"
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                  placeholder="Enter water usage in KL"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">1 KL = 1000 Litres</p>
              </div>

              <button
                onClick={calculateBill}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Calculate Bill
              </button>
            </div>

            {/* Result Section */}
            <div className="space-y-6">
              {result && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Bill Breakdown</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Usage:</span>
                      <span>{result.totalUsage} KL</span>
                    </div>

                    <div className="border-t pt-3">
                      <h4 className="font-semibold mb-2">Slab-wise Charges:</h4>
                      {result.breakdown.map((slab: any, index: number) => (
                        <div key={index} className="text-sm space-y-1 mb-2">
                          <div className="flex justify-between">
                            <span>{slab.range}</span>
                            <span>{slab.usage} KL × ₹{slab.rate} = ₹{slab.cost.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between">
                        <span>Water Charges:</span>
                        <span>₹{result.waterCharges.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sewerage Charge (25%):</span>
                        <span>₹{result.sewerageCharge.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fixed Charge:</span>
                        <span>₹{result.fixedCharge.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service Tax (18%):</span>
                        <span>₹{result.serviceTax.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Total Amount:</span>
                        <span className="text-blue-600">₹{result.finalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rate Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Current Water Rates</h3>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-blue-600">{waterSource === 'municipal' ? 'Municipal' : 'Private'} - {connectionType === 'domestic' ? 'Domestic' : 'Commercial'}</p>
                  {waterRates[waterSource as keyof typeof waterRates][connectionType as keyof typeof waterRates.municipal].map((rate, index) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {rate.max === Infinity ? `${rate.min}+ KL` : `${rate.min}-${rate.max} KL`}
                      </span>
                      <span>₹{rate.rate}/KL</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

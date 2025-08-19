
"use client";
import React, { useState } from 'react';

export default function ElectricityBillCalculator() {
  const [units, setUnits] = useState('');
  const [tariffType, setTariffType] = useState('domestic');
  const [previousReading, setPreviousReading] = useState('');
  const [currentReading, setCurrentReading] = useState('');
  const [result, setResult] = useState<any>(null);

  const tariffRates = {
    domestic: [
      { min: 0, max: 50, rate: 2.50 },
      { min: 51, max: 100, rate: 3.00 },
      { min: 101, max: 200, rate: 4.50 },
      { min: 201, max: 300, rate: 6.00 },
      { min: 301, max: Infinity, rate: 7.50 }
    ],
    commercial: [
      { min: 0, max: 100, rate: 5.00 },
      { min: 101, max: 300, rate: 7.00 },
      { min: 301, max: Infinity, rate: 9.00 }
    ],
    industrial: [
      { min: 0, max: 500, rate: 6.50 },
      { min: 501, max: Infinity, rate: 8.50 }
    ]
  };

  const calculateBill = () => {
    let totalUnits = 0;
    
    if (units) {
      totalUnits = parseFloat(units);
    } else if (previousReading && currentReading) {
      totalUnits = parseFloat(currentReading) - parseFloat(previousReading);
    }

    if (totalUnits <= 0) {
      alert('Please enter valid readings or units');
      return;
    }

    const rates = tariffRates[tariffType as keyof typeof tariffRates];
    let totalCost = 0;
    let breakdown = [];

    for (const slab of rates) {
      if (totalUnits <= 0) break;
      
      const slabUnits = Math.min(totalUnits, slab.max - slab.min + 1);
      const slabCost = slabUnits * slab.rate;
      
      breakdown.push({
        range: slab.max === Infinity ? `${slab.min}+ units` : `${slab.min}-${slab.max} units`,
        units: slabUnits,
        rate: slab.rate,
        cost: slabCost
      });
      
      totalCost += slabCost;
      totalUnits -= slabUnits;
    }

    // Additional charges
    const fixedCharge = tariffType === 'domestic' ? 50 : tariffType === 'commercial' ? 100 : 200;
    const electricityDuty = totalCost * 0.15;
    const finalAmount = totalCost + fixedCharge + electricityDuty;

    setResult({
      totalUnits: parseFloat(units) || (parseFloat(currentReading) - parseFloat(previousReading)),
      breakdown,
      energyCharges: totalCost,
      fixedCharge,
      electricityDuty,
      finalAmount
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Electricity Bill Calculator</h1>
          <p className="text-lg text-gray-600">Calculate your electricity charges based on usage</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection Type
                </label>
                <select
                  value={tariffType}
                  onChange={(e) => setTariffType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="domestic">Domestic</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Method 1: Direct Units</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Units Consumed
                  </label>
                  <input
                    type="number"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    placeholder="Enter units consumed"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Method 2: Meter Readings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Reading
                    </label>
                    <input
                      type="number"
                      value={previousReading}
                      onChange={(e) => setPreviousReading(e.target.value)}
                      placeholder="Enter previous reading"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Reading
                    </label>
                    <input
                      type="number"
                      value={currentReading}
                      onChange={(e) => setCurrentReading(e.target.value)}
                      placeholder="Enter current reading"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={calculateBill}
                className="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
              >
                Calculate Bill
              </button>
            </div>

            {/* Result Section */}
            <div className="space-y-6">
              {result && (
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Bill Breakdown</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Units:</span>
                      <span>{result.totalUnits} kWh</span>
                    </div>

                    <div className="border-t pt-3">
                      <h4 className="font-semibold mb-2">Slab-wise Charges:</h4>
                      {result.breakdown.map((slab: any, index: number) => (
                        <div key={index} className="text-sm space-y-1 mb-2">
                          <div className="flex justify-between">
                            <span>{slab.range}</span>
                            <span>{slab.units} units × ₹{slab.rate} = ₹{slab.cost.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between">
                        <span>Energy Charges:</span>
                        <span>₹{result.energyCharges.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fixed Charge:</span>
                        <span>₹{result.fixedCharge.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Electricity Duty (15%):</span>
                        <span>₹{result.electricityDuty.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Total Amount:</span>
                        <span className="text-yellow-600">₹{result.finalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tariff Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Current Tariff Rates</h3>
                <div className="space-y-2 text-sm">
                  {tariffRates[tariffType as keyof typeof tariffRates].map((rate, index) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {rate.max === Infinity ? `${rate.min}+ units` : `${rate.min}-${rate.max} units`}
                      </span>
                      <span>₹{rate.rate}/unit</span>
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

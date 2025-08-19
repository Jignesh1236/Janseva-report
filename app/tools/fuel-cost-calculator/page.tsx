
"use client";
import React, { useState } from 'react';

export default function FuelCostCalculator() {
  const [tripData, setTripData] = useState({
    distance: '',
    mileage: '',
    fuelPrice: '102.50',
    passengers: '1',
    toll: '',
    parking: ''
  });
  
  const [vehicleType, setVehicleType] = useState('car');
  const [result, setResult] = useState<any>(null);

  const vehicleMileage = {
    car: { avg: 15, range: '12-18' },
    bike: { avg: 45, range: '35-55' },
    suv: { avg: 12, range: '10-14' },
    truck: { avg: 8, range: '6-10' },
    bus: { avg: 6, range: '4-8' }
  };

  const currentFuelPrices = {
    petrol: 102.50,
    diesel: 89.30,
    cng: 82.50
  };

  const calculateCost = () => {
    const distance = parseFloat(tripData.distance);
    const mileage = parseFloat(tripData.mileage) || vehicleMileage[vehicleType as keyof typeof vehicleMileage].avg;
    const fuelPrice = parseFloat(tripData.fuelPrice);
    const passengers = parseInt(tripData.passengers) || 1;
    const toll = parseFloat(tripData.toll) || 0;
    const parking = parseFloat(tripData.parking) || 0;

    if (!distance || distance <= 0) {
      alert('Please enter valid distance');
      return;
    }

    const fuelNeeded = distance / mileage;
    const fuelCost = fuelNeeded * fuelPrice;
    const totalCost = fuelCost + toll + parking;
    const costPerPerson = totalCost / passengers;

    // Return trip calculation
    const returnTripFuel = fuelCost * 2;
    const returnTripTotal = (fuelCost + toll + parking) * 2;
    const returnCostPerPerson = returnTripTotal / passengers;

    setResult({
      distance,
      mileage,
      fuelPrice,
      passengers,
      fuelNeeded,
      fuelCost,
      toll,
      parking,
      totalCost,
      costPerPerson,
      returnTripFuel,
      returnTripTotal,
      returnCostPerPerson
    });
  };

  const resetForm = () => {
    setTripData({
      distance: '',
      mileage: '',
      fuelPrice: '102.50',
      passengers: '1',
      toll: '',
      parking: ''
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fuel Cost Calculator</h1>
          <p className="text-lg text-gray-600">Calculate fuel expenses for your trips</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => {
                    setVehicleType(e.target.value);
                    setTripData(prev => ({
                      ...prev,
                      mileage: vehicleMileage[e.target.value as keyof typeof vehicleMileage].avg.toString()
                    }));
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="car">Car</option>
                  <option value="bike">Bike/Motorcycle</option>
                  <option value="suv">SUV</option>
                  <option value="truck">Truck</option>
                  <option value="bus">Bus</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Average mileage: {vehicleMileage[vehicleType as keyof typeof vehicleMileage].range} km/l
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Distance (km)
                </label>
                <input
                  type="number"
                  value={tripData.distance}
                  onChange={(e) => setTripData(prev => ({ ...prev, distance: e.target.value }))}
                  placeholder="Enter distance in kilometers"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Mileage (km/l)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tripData.mileage}
                  onChange={(e) => setTripData(prev => ({ ...prev, mileage: e.target.value }))}
                  placeholder={`Default: ${vehicleMileage[vehicleType as keyof typeof vehicleMileage].avg} km/l`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Price (₹/liter)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={tripData.fuelPrice}
                  onChange={(e) => setTripData(prev => ({ ...prev, fuelPrice: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => setTripData(prev => ({ ...prev, fuelPrice: currentFuelPrices.petrol.toString() }))}
                    className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded"
                  >
                    Petrol: ₹{currentFuelPrices.petrol}
                  </button>
                  <button
                    onClick={() => setTripData(prev => ({ ...prev, fuelPrice: currentFuelPrices.diesel.toString() }))}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    Diesel: ₹{currentFuelPrices.diesel}
                  </button>
                  <button
                    onClick={() => setTripData(prev => ({ ...prev, fuelPrice: currentFuelPrices.cng.toString() }))}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                  >
                    CNG: ₹{currentFuelPrices.cng}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Passengers
                </label>
                <input
                  type="number"
                  min="1"
                  value={tripData.passengers}
                  onChange={(e) => setTripData(prev => ({ ...prev, passengers: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Toll Charges (₹)
                  </label>
                  <input
                    type="number"
                    value={tripData.toll}
                    onChange={(e) => setTripData(prev => ({ ...prev, toll: e.target.value }))}
                    placeholder="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parking Charges (₹)
                  </label>
                  <input
                    type="number"
                    value={tripData.parking}
                    onChange={(e) => setTripData(prev => ({ ...prev, parking: e.target.value }))}
                    placeholder="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={calculateCost}
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                >
                  Calculate Cost
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <>
                {/* One Way Trip */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">One Way Trip</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Distance:</span>
                      <span className="font-semibold">{result.distance} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fuel Required:</span>
                      <span className="font-semibold">{result.fuelNeeded.toFixed(2)} liters</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fuel Cost:</span>
                      <span className="font-semibold">₹{result.fuelCost.toFixed(2)}</span>
                    </div>
                    {result.toll > 0 && (
                      <div className="flex justify-between">
                        <span>Toll Charges:</span>
                        <span className="font-semibold">₹{result.toll.toFixed(2)}</span>
                      </div>
                    )}
                    {result.parking > 0 && (
                      <div className="flex justify-between">
                        <span>Parking Charges:</span>
                        <span className="font-semibold">₹{result.parking.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-4 flex justify-between text-lg font-bold">
                      <span>Total Cost:</span>
                      <span className="text-orange-600">₹{result.totalCost.toFixed(2)}</span>
                    </div>
                    {result.passengers > 1 && (
                      <div className="flex justify-between text-lg font-bold">
                        <span>Cost Per Person:</span>
                        <span className="text-green-600">₹{result.costPerPerson.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Return Trip */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Trip</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Distance:</span>
                      <span className="font-semibold">{(result.distance * 2)} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Fuel Cost:</span>
                      <span className="font-semibold">₹{result.returnTripFuel.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between text-lg font-bold">
                      <span>Total Trip Cost:</span>
                      <span className="text-orange-600">₹{result.returnTripTotal.toFixed(2)}</span>
                    </div>
                    {result.passengers > 1 && (
                      <div className="flex justify-between text-lg font-bold">
                        <span>Cost Per Person:</span>
                        <span className="text-green-600">₹{result.returnCostPerPerson.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Fuel Saving Tips</h2>
                  
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Maintain steady speed and avoid aggressive driving
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Regular vehicle maintenance and timely servicing
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Check tire pressure regularly
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Remove unnecessary weight from vehicle
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Plan routes to avoid traffic congestion
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Use air conditioning wisely
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

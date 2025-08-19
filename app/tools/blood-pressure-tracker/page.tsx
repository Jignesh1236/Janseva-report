
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface BPReading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  date: string;
  time: string;
  notes: string;
  category: string;
}

export default function BloodPressureTracker() {
  const [readings, setReadings] = useState<BPReading[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReading, setNewReading] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    notes: ''
  });

  useEffect(() => {
    // Load readings from localStorage
    const savedReadings = localStorage.getItem('bpReadings');
    if (savedReadings) {
      setReadings(JSON.parse(savedReadings));
    }
  }, []);

  useEffect(() => {
    // Save readings to localStorage
    localStorage.setItem('bpReadings', JSON.stringify(readings));
  }, [readings]);

  const getBPCategory = (systolic: number, diastolic: number): string => {
    if (systolic < 90 || diastolic < 60) return 'Low';
    if (systolic < 120 && diastolic < 80) return 'Normal';
    if (systolic < 130 && diastolic < 80) return 'Elevated';
    if (systolic < 140 || diastolic < 90) return 'High Stage 1';
    if (systolic < 180 || diastolic < 120) return 'High Stage 2';
    return 'Hypertensive Crisis';
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Low': return 'text-blue-600 bg-blue-50';
      case 'Normal': return 'text-green-600 bg-green-50';
      case 'Elevated': return 'text-yellow-600 bg-yellow-50';
      case 'High Stage 1': return 'text-orange-600 bg-orange-50';
      case 'High Stage 2': return 'text-red-600 bg-red-50';
      case 'Hypertensive Crisis': return 'text-red-800 bg-red-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const addReading = () => {
    const { systolic, diastolic, pulse, date, time, notes } = newReading;

    if (!systolic || !diastolic || !pulse) {
      alert('Please enter systolic, diastolic, and pulse values');
      return;
    }

    const systolicNum = parseInt(systolic);
    const diastolicNum = parseInt(diastolic);
    const pulseNum = parseInt(pulse);

    if (systolicNum < 50 || systolicNum > 250 || diastolicNum < 30 || diastolicNum > 150) {
      alert('Please enter valid blood pressure values');
      return;
    }

    const category = getBPCategory(systolicNum, diastolicNum);

    const reading: BPReading = {
      id: Date.now().toString(),
      systolic: systolicNum,
      diastolic: diastolicNum,
      pulse: pulseNum,
      date,
      time,
      notes,
      category
    };

    setReadings(prev => [reading, ...prev]);
    setNewReading({
      systolic: '',
      diastolic: '',
      pulse: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      notes: ''
    });
    setShowAddForm(false);
  };

  const deleteReading = (id: string) => {
    if (confirm('Are you sure you want to delete this reading?')) {
      setReadings(prev => prev.filter(r => r.id !== id));
    }
  };

  const getAverages = () => {
    if (readings.length === 0) return { systolic: 0, diastolic: 0, pulse: 0 };
    
    const recent = readings.slice(0, 7); // Last 7 readings
    const avgSystolic = Math.round(recent.reduce((sum, r) => sum + r.systolic, 0) / recent.length);
    const avgDiastolic = Math.round(recent.reduce((sum, r) => sum + r.diastolic, 0) / recent.length);
    const avgPulse = Math.round(recent.reduce((sum, r) => sum + r.pulse, 0) / recent.length);
    
    return { systolic: avgSystolic, diastolic: avgDiastolic, pulse: avgPulse };
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Time', 'Systolic', 'Diastolic', 'Pulse', 'Category', 'Notes'],
      ...readings.map(r => [r.date, r.time, r.systolic, r.diastolic, r.pulse, r.category, r.notes])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `blood-pressure-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const averages = getAverages();
  const latestReading = readings[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/tools" className="inline-flex items-center text-red-600 hover:text-red-800 mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blood Pressure Tracker</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor and track your blood pressure readings to maintain good cardiovascular health
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Quick Stats */}
          <div className="space-y-6">
            {/* Latest Reading */}
            {latestReading && (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Latest Reading</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {latestReading.systolic}/{latestReading.diastolic}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">mmHg</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(latestReading.category)}`}>
                    {latestReading.category}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Pulse: {latestReading.pulse} bpm
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(latestReading.date).toLocaleDateString()} at {latestReading.time}
                  </div>
                </div>
              </div>
            )}

            {/* Averages */}
            {readings.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">7-Day Average</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Blood Pressure:</span>
                    <span className="font-medium">{averages.systolic}/{averages.diastolic} mmHg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pulse:</span>
                    <span className="font-medium">{averages.pulse} bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Readings:</span>
                    <span className="font-medium">{readings.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="space-y-3">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                >
                  + Add Reading
                </button>
                {readings.length > 0 && (
                  <button
                    onClick={exportData}
                    className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                  >
                    Export Data
                  </button>
                )}
              </div>
            </div>

            {/* BP Guidelines */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">BP Categories</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Normal:</span>
                  <span className="text-green-600">&lt; 120/80</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Elevated:</span>
                  <span className="text-yellow-600">120-129/&lt;80</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>High Stage 1:</span>
                  <span className="text-orange-600">130-139/80-89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>High Stage 2:</span>
                  <span className="text-red-600">≥140/≥90</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Crisis:</span>
                  <span className="text-red-800">≥180/≥120</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Panel - Add Form & Readings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Reading Form */}
            {showAddForm && (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Reading</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Systolic (mmHg)</label>
                    <input
                      type="number"
                      placeholder="120"
                      value={newReading.systolic}
                      onChange={(e) => setNewReading(prev => ({ ...prev, systolic: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diastolic (mmHg)</label>
                    <input
                      type="number"
                      placeholder="80"
                      value={newReading.diastolic}
                      onChange={(e) => setNewReading(prev => ({ ...prev, diastolic: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pulse (bpm)</label>
                    <input
                      type="number"
                      placeholder="72"
                      value={newReading.pulse}
                      onChange={(e) => setNewReading(prev => ({ ...prev, pulse: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={newReading.date}
                      onChange={(e) => setNewReading(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={newReading.time}
                      onChange={(e) => setNewReading(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea
                    placeholder="Add any notes about this reading..."
                    value={newReading.notes}
                    onChange={(e) => setNewReading(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={addReading}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Add Reading
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Readings History */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Reading History ({readings.length})
              </h3>
              {readings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <p>No readings recorded yet</p>
                  <p className="text-sm">Add your first blood pressure reading to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {readings.map(reading => (
                    <div key={reading.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="text-lg font-bold text-gray-800">
                              {reading.systolic}/{reading.diastolic}
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(reading.category)}`}>
                              {reading.category}
                            </div>
                            <div className="text-sm text-gray-500">
                              ♥ {reading.pulse} bpm
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {new Date(reading.date).toLocaleDateString()} at {reading.time}
                          </div>
                          {reading.notes && (
                            <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                              {reading.notes}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteReading(reading.id)}
                          className="text-red-600 hover:text-red-800 text-sm ml-4"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-red-50 p-6 rounded-xl border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-3">Measurement Tips</h3>
              <ul className="text-sm text-red-700 space-y-2">
                <li>• Sit quietly for 5 minutes before measuring</li>
                <li>• Keep feet flat on floor, back supported</li>
                <li>• Arm should be at heart level</li>
                <li>• Don't talk during measurement</li>
                <li>• Take readings at the same time daily</li>
                <li>• Avoid caffeine 30 minutes before</li>
                <li>• Use properly sized cuff</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

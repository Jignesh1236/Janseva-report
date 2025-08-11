
"use client";
import React, { useState, useEffect } from 'react';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [humanDate, setHumanDate] = useState('');
  const [currentTimestamp, setCurrentTimestamp] = useState(0);

  useEffect(() => {
    const updateCurrentTimestamp = () => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    };
    
    updateCurrentTimestamp();
    const interval = setInterval(updateCurrentTimestamp, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertToHuman = () => {
    try {
      const ts = parseInt(timestamp);
      if (isNaN(ts)) {
        alert('Please enter a valid timestamp');
        return;
      }
      
      // Handle both seconds and milliseconds
      const date = new Date(ts.toString().length === 10 ? ts * 1000 : ts);
      setHumanDate(date.toString());
    } catch (error) {
      alert('Invalid timestamp');
    }
  };

  const convertToTimestamp = () => {
    try {
      const date = new Date(humanDate);
      if (isNaN(date.getTime())) {
        alert('Please enter a valid date');
        return;
      }
      setTimestamp(Math.floor(date.getTime() / 1000).toString());
    } catch (error) {
      alert('Invalid date format');
    }
  };

  const getCurrentTimestamp = () => {
    setTimestamp(currentTimestamp.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Timestamp Converter</h1>
          <p className="text-lg text-gray-600">Convert between timestamps and readable dates</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Current Timestamp */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Current Unix Timestamp</h3>
            <div className="text-2xl font-mono text-blue-600">{currentTimestamp}</div>
            <div className="text-sm text-gray-600 mt-1">{new Date().toString()}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Timestamp to Human */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Timestamp to Human Date</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unix Timestamp
                </label>
                <input
                  type="text"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  placeholder="1640995200"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={convertToHuman}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Convert to Date
                </button>
                <button
                  onClick={getCurrentTimestamp}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Use Current
                </button>
              </div>
              {humanDate && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <strong>Result:</strong> {humanDate}
                </div>
              )}
            </div>

            {/* Human to Timestamp */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Human Date to Timestamp</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date String
                </label>
                <input
                  type="text"
                  value={humanDate}
                  onChange={(e) => setHumanDate(e.target.value)}
                  placeholder="2022-01-01 00:00:00"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={convertToTimestamp}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Convert to Timestamp
              </button>
              {timestamp && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <strong>Result:</strong> {timestamp}
                </div>
              )}
            </div>
          </div>

          {/* Format Examples */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Supported Date Formats:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 2022-01-01</li>
              <li>• 2022-01-01 12:30:00</li>
              <li>• January 1, 2022</li>
              <li>• 01/01/2022</li>
              <li>• 2022-01-01T12:30:00Z</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";
import React, { useState } from 'react';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateAge = () => {
    if (!birthDate) {
      alert('Please select your birth date');
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Next birthday
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      daysToNextBirthday,
      nextBirthday: nextBirthday.toDateString()
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Age Calculator</h1>
          <p className="text-lg text-gray-600">Calculate your exact age and important dates</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Birth Date
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={calculateAge}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Calculate Age
            </button>
          </div>

          {result && (
            <div className="mt-8 space-y-6">
              {/* Main Age Display */}
              <div className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-2">Your Age</h2>
                <div className="text-4xl font-bold">
                  {result.years} Years, {result.months} Months, {result.days} Days
                </div>
              </div>

              {/* Detailed Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{result.totalDays.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Days</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{result.totalHours.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Hours</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{result.totalMinutes.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Minutes</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{result.totalSeconds.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Seconds</div>
                </div>
              </div>

              {/* Next Birthday */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <div className="text-lg font-semibold text-gray-800 mb-2">Next Birthday</div>
                <div className="text-xl text-yellow-600 font-bold">{result.nextBirthday}</div>
                <div className="text-sm text-gray-600 mt-2">
                  {result.daysToNextBirthday} days to go! 🎂
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


"use client";
import React, { useState } from 'react';

export default function DataUsageCalculator() {
  const [dailyUsage, setDailyUsage] = useState({
    messaging: '',
    socialMedia: '',
    videoStreaming: '',
    videoCall: '',
    musicStreaming: '',
    webBrowsing: '',
    gaming: '',
    emailNews: ''
  });
  
  const [result, setResult] = useState<any>(null);

  const dataConsumption = {
    messaging: { rate: 0.1, unit: 'MB/hour', description: 'WhatsApp, Telegram' },
    socialMedia: { rate: 150, unit: 'MB/hour', description: 'Facebook, Instagram, Twitter' },
    videoStreaming: { rate: 1000, unit: 'MB/hour', description: 'YouTube, Netflix (HD)' },
    videoCall: { rate: 500, unit: 'MB/hour', description: 'Video calls, Zoom' },
    musicStreaming: { rate: 100, unit: 'MB/hour', description: 'Spotify, YouTube Music' },
    webBrowsing: { rate: 50, unit: 'MB/hour', description: 'General browsing' },
    gaming: { rate: 80, unit: 'MB/hour', description: 'Online gaming' },
    emailNews: { rate: 10, unit: 'MB/hour', description: 'Email, news reading' }
  };

  const calculateUsage = () => {
    let totalDailyMB = 0;
    let breakdown: any = {};

    for (const [activity, hours] of Object.entries(dailyUsage)) {
      const hoursNum = parseFloat(hours) || 0;
      const activityData = dataConsumption[activity as keyof typeof dataConsumption];
      const dailyMB = hoursNum * activityData.rate;
      
      breakdown[activity] = {
        hours: hoursNum,
        dailyMB,
        description: activityData.description,
        rate: activityData.rate
      };
      
      totalDailyMB += dailyMB;
    }

    const dailyGB = totalDailyMB / 1000;
    const weeklyGB = dailyGB * 7;
    const monthlyGB = dailyGB * 30;

    // Plan recommendations
    const planRecommendations = [];
    if (monthlyGB <= 2) {
      planRecommendations.push({ data: '2 GB', price: '₹199-299', suitable: 'Light users' });
    }
    if (monthlyGB <= 25) {
      planRecommendations.push({ data: '25 GB', price: '₹299-399', suitable: 'Regular users' });
    }
    if (monthlyGB <= 75) {
      planRecommendations.push({ data: '75 GB', price: '₹399-599', suitable: 'Heavy users' });
    }
    if (monthlyGB > 75) {
      planRecommendations.push({ data: 'Unlimited', price: '₹599+', suitable: 'Very heavy users' });
    }

    setResult({
      breakdown,
      dailyMB: totalDailyMB,
      dailyGB,
      weeklyGB,
      monthlyGB,
      planRecommendations
    });
  };

  const resetForm = () => {
    setDailyUsage({
      messaging: '',
      socialMedia: '',
      videoStreaming: '',
      videoCall: '',
      musicStreaming: '',
      webBrowsing: '',
      gaming: '',
      emailNews: ''
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Usage Calculator</h1>
          <p className="text-lg text-gray-600">Calculate your internet data consumption and get plan recommendations</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Usage (Hours)</h2>
            
            <div className="space-y-6">
              {Object.entries(dataConsumption).map(([key, data]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {data.description}
                    <span className="text-gray-500 ml-2">({data.rate} {data.unit})</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={dailyUsage[key as keyof typeof dailyUsage]}
                    onChange={(e) => setDailyUsage(prev => ({
                      ...prev,
                      [key]: e.target.value
                    }))}
                    placeholder="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              ))}
              
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={calculateUsage}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                >
                  Calculate Usage
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
                {/* Usage Summary */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Usage Summary</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-indigo-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        {result.dailyGB.toFixed(2)} GB
                      </div>
                      <div className="text-sm text-gray-600">Daily</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {result.weeklyGB.toFixed(2)} GB
                      </div>
                      <div className="text-sm text-gray-600">Weekly</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center col-span-2">
                      <div className="text-3xl font-bold text-blue-600">
                        {result.monthlyGB.toFixed(2)} GB
                      </div>
                      <div className="text-sm text-gray-600">Monthly Estimate</div>
                    </div>
                  </div>

                  {/* Activity Breakdown */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Activity Breakdown</h3>
                    {Object.entries(result.breakdown)
                      .filter(([, data]: [string, any]) => data.hours > 0)
                      .map(([activity, data]: [string, any]) => (
                        <div key={activity} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <div>
                            <span className="font-medium">{data.description}</span>
                            <span className="text-sm text-gray-500 ml-2">({data.hours}h)</span>
                          </div>
                          <span className="font-semibold text-indigo-600">
                            {data.dailyMB >= 1000 ? `${(data.dailyMB/1000).toFixed(2)} GB` : `${data.dailyMB.toFixed(0)} MB`}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Plan Recommendations */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Plans</h2>
                  
                  <div className="space-y-4">
                    {result.planRecommendations.map((plan: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-semibold text-lg">{plan.data}</span>
                            <span className="text-gray-500 ml-2">- {plan.suitable}</span>
                          </div>
                          <span className="font-bold text-indigo-600">{plan.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">💡 Tips to Reduce Data Usage:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Use WiFi whenever possible</li>
                      <li>• Reduce video streaming quality</li>
                      <li>• Download content on WiFi for offline use</li>
                      <li>• Use data compression features in browsers</li>
                      <li>• Monitor background app refresh</li>
                    </ul>
                  </div>
                </div>
              </>
            )}

            {/* Usage Guidelines */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Usage Guidelines</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                  <span>Light User (0-2 GB/month)</span>
                  <span className="font-semibold text-green-600">Basic plans</span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span>Moderate User (2-25 GB/month)</span>
                  <span className="font-semibold text-blue-600">Standard plans</span>
                </div>
                <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                  <span>Heavy User (25-75 GB/month)</span>
                  <span className="font-semibold text-purple-600">Premium plans</span>
                </div>
                <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                  <span>Very Heavy User (75+ GB/month)</span>
                  <span className="font-semibold text-red-600">Unlimited plans</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

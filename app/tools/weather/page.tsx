
"use client";
import React, { useState } from 'react';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export default function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock weather data for demo
  const mockWeatherData: { [key: string]: WeatherData } = {
    'london': {
      location: 'London, UK',
      temperature: 15,
      description: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      icon: '⛅'
    },
    'new york': {
      location: 'New York, USA',
      temperature: 22,
      description: 'Sunny',
      humidity: 45,
      windSpeed: 8,
      icon: '☀️'
    },
    'mumbai': {
      location: 'Mumbai, India',
      temperature: 28,
      description: 'Humid',
      humidity: 80,
      windSpeed: 15,
      icon: '🌫️'
    },
    'delhi': {
      location: 'Delhi, India',
      temperature: 25,
      description: 'Clear Sky',
      humidity: 55,
      windSpeed: 10,
      icon: '🌤️'
    }
  };

  const searchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      const cityKey = city.toLowerCase().trim();
      const mockData = mockWeatherData[cityKey];
      
      if (mockData) {
        setWeather(mockData);
      } else {
        // Generate random weather data for unknown cities
        const temperatures = [18, 22, 25, 28, 12, 35, 8];
        const descriptions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Clear', 'Foggy'];
        const icons = ['☀️', '☁️', '🌧️', '⛅', '🌤️', '🌫️'];
        
        const randomIndex = Math.floor(Math.random() * descriptions.length);
        
        setWeather({
          location: city.charAt(0).toUpperCase() + city.slice(1),
          temperature: temperatures[Math.floor(Math.random() * temperatures.length)],
          description: descriptions[randomIndex],
          humidity: Math.floor(Math.random() * 50) + 30,
          windSpeed: Math.floor(Math.random() * 20) + 5,
          icon: icons[randomIndex]
        });
      }
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchWeather();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Weather App</h1>
          <p className="text-lg text-blue-100">Check weather conditions and forecasts</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Search Section */}
          <div className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter city name..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={searchWeather}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-red-600 text-sm">{error}</p>
            )}
          </div>

          {/* Weather Display */}
          {weather && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{weather.icon}</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{weather.location}</h2>
                <div className="text-4xl font-bold text-blue-600 mb-2">{weather.temperature}°C</div>
                <p className="text-lg text-gray-600">{weather.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">💧</div>
                  <div className="text-sm text-gray-600">Humidity</div>
                  <div className="text-xl font-semibold">{weather.humidity}%</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">💨</div>
                  <div className="text-sm text-gray-600">Wind Speed</div>
                  <div className="text-xl font-semibold">{weather.windSpeed} km/h</div>
                </div>
              </div>
            </div>
          )}

          {/* Popular Cities */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Popular Cities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.keys(mockWeatherData).map(cityKey => (
                <button
                  key={cityKey}
                  onClick={() => {
                    setCity(cityKey);
                    setWeather(mockWeatherData[cityKey]);
                  }}
                  className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors capitalize"
                >
                  {mockWeatherData[cityKey].location.split(',')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This is a demo weather app. For accurate weather data, integrate with a real weather API service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

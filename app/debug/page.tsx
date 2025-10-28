
"use client";

import React, { useState, useEffect } from 'react';

interface TestResults {
  auth?: {
    status?: number;
    ok?: boolean;
    result?: any;
    error?: string;
    timestamp?: string;
  };
  reports?: {
    status?: number;
    ok?: boolean;
    count?: number | string;
    result?: any;
    error?: string;
    timestamp?: string;
  };
  usernames?: {
    status?: number;
    ok?: boolean;
    count?: number;
    result?: any;
    error?: string;
    timestamp?: string;
  };
  system?: {
    timestamp?: string;
    result?: any;
    error?: string;
  };
}

const DebugPage = () => {
  const [testResults, setTestResults] = useState<TestResults>({});
  const [loading, setLoading] = useState(false);
  const [activeTest, setActiveTest] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [refreshInterval]);

  const toggleAutoRefresh = () => {
    if (autoRefresh) {
      if (refreshInterval) clearInterval(refreshInterval);
      setRefreshInterval(null);
      setAutoRefresh(false);
    } else {
      const interval = setInterval(() => {
        testAllAPIs();
      }, 5000);
      setRefreshInterval(interval);
      setAutoRefresh(true);
    }
  };

  const testAuthAPI = async () => {
    try {
      setLoading(true);
      setActiveTest('auth');
      
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: 'admin123',
          page: 'admin'
        }),
      });

      const result = await response.json();
      
      setTestResults((prev: TestResults) => ({
        ...prev,
        auth: {
          status: response.status,
          ok: response.ok,
          result,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } catch (error) {
      setTestResults((prev: TestResults) => ({
        ...prev,
        auth: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setLoading(false);
      setActiveTest('');
    }
  };

  const testReportsAPI = async () => {
    try {
      setLoading(true);
      setActiveTest('reports');
      
      const response = await fetch('/api/reports');
      const result = await response.json();
      
      setTestResults((prev: TestResults) => ({
        ...prev,
        reports: {
          status: response.status,
          ok: response.ok,
          count: Array.isArray(result) ? result.length : 'Not an array',
          result: Array.isArray(result) ? result.slice(0, 3) : result,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } catch (error) {
      setTestResults((prev: TestResults) => ({
        ...prev,
        reports: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setLoading(false);
      setActiveTest('');
    }
  };

  const testUsernamesAPI = async () => {
    try {
      setLoading(true);
      setActiveTest('usernames');
      
      const response = await fetch('/api/reports/usernames');
      const result = await response.json();
      
      setTestResults((prev: TestResults) => ({
        ...prev,
        usernames: {
          status: response.status,
          ok: response.ok,
          count: Array.isArray(result) ? result.length : 0,
          result,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } catch (error) {
      setTestResults((prev: TestResults) => ({
        ...prev,
        usernames: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setLoading(false);
      setActiveTest('');
    }
  };

  const testSystemCheck = async () => {
    try {
      setLoading(true);
      setActiveTest('system');
      
      const response = await fetch('/api/admin/verify-system');
      const result = await response.json();
      
      setTestResults((prev: TestResults) => ({
        ...prev,
        system: {
          result,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } catch (error) {
      setTestResults((prev: TestResults) => ({
        ...prev,
        system: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setLoading(false);
      setActiveTest('');
    }
  };

  const testAllAPIs = async () => {
    await testAuthAPI();
    await testReportsAPI();
    await testUsernamesAPI();
    await testSystemCheck();
  };

  const clearResults = () => {
    setTestResults({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                🔧 Debug Dashboard
              </h1>
              <p className="text-blue-200">System diagnostics and API testing</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={toggleAutoRefresh}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  autoRefresh 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {autoRefresh ? '⏸ Stop Auto-Refresh' : '▶ Auto-Refresh (5s)'}
              </button>
            </div>
          </div>
        </div>

        {/* Environment Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🌍</span>
              <h3 className="text-lg font-semibold text-white">Environment</h3>
            </div>
            <p className="text-blue-200">{process.env.NODE_ENV || 'development'}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔗</span>
              <h3 className="text-lg font-semibold text-white">Supabase URL</h3>
            </div>
            <p className="text-blue-200">
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Connected' : '❌ Not Set'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">⏰</span>
              <h3 className="text-lg font-semibold text-white">Server Time</h3>
            </div>
            <p className="text-blue-200">{new Date().toLocaleString()}</p>
          </div>
        </div>
        
        {/* Test Controls */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🧪</span> API Testing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <button
              onClick={testAuthAPI}
              disabled={loading && activeTest === 'auth'}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {loading && activeTest === 'auth' ? '⏳ Testing...' : '🔐 Test Auth API'}
            </button>
            
            <button
              onClick={testReportsAPI}
              disabled={loading && activeTest === 'reports'}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {loading && activeTest === 'reports' ? '⏳ Testing...' : '📊 Test Reports API'}
            </button>

            <button
              onClick={testUsernamesAPI}
              disabled={loading && activeTest === 'usernames'}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {loading && activeTest === 'usernames' ? '⏳ Testing...' : '👤 Test Usernames API'}
            </button>

            <button
              onClick={testSystemCheck}
              disabled={loading && activeTest === 'system'}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {loading && activeTest === 'system' ? '⏳ Testing...' : '⚙️ System Check'}
            </button>

            <button
              onClick={testAllAPIs}
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {loading ? '⏳ Testing All...' : '🚀 Test All APIs'}
            </button>

            <button
              onClick={clearResults}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🗑️ Clear Results
            </button>
          </div>
        </div>
        
        {/* Results Display */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📋</span> Test Results
          </h2>
          
          {Object.keys(testResults).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-blue-200 text-lg">🎯 Click any test button to see results</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testResults.auth && (
                <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-400/30">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      🔐 Authentication Test
                    </h3>
                    <span className="text-sm text-blue-300">
                      {testResults.auth.timestamp}
                    </span>
                  </div>
                  {testResults.auth.error ? (
                    <p className="text-red-300">❌ Error: {testResults.auth.error}</p>
                  ) : (
                    <div>
                      <p className="text-green-300 mb-2">
                        ✅ Status: {testResults.auth.status} ({testResults.auth.ok ? 'Success' : 'Failed'})
                      </p>
                      <pre className="bg-black/30 p-4 rounded-lg overflow-auto text-sm text-blue-100">
                        {JSON.stringify(testResults.auth.result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {testResults.reports && (
                <div className="bg-green-900/30 rounded-xl p-6 border border-green-400/30">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      📊 Reports Test
                    </h3>
                    <span className="text-sm text-green-300">
                      {testResults.reports.timestamp}
                    </span>
                  </div>
                  {testResults.reports.error ? (
                    <p className="text-red-300">❌ Error: {testResults.reports.error}</p>
                  ) : (
                    <div>
                      <p className="text-green-300 mb-2">
                        ✅ Status: {testResults.reports.status} | Total Reports: {testResults.reports.count}
                      </p>
                      <pre className="bg-black/30 p-4 rounded-lg overflow-auto text-sm text-green-100">
                        {JSON.stringify(testResults.reports.result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {testResults.usernames && (
                <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-400/30">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      👤 Usernames Test
                    </h3>
                    <span className="text-sm text-purple-300">
                      {testResults.usernames.timestamp}
                    </span>
                  </div>
                  {testResults.usernames.error ? (
                    <p className="text-red-300">❌ Error: {testResults.usernames.error}</p>
                  ) : (
                    <div>
                      <p className="text-purple-300 mb-2">
                        ✅ Status: {testResults.usernames.status} | Total Usernames: {testResults.usernames.count}
                      </p>
                      <pre className="bg-black/30 p-4 rounded-lg overflow-auto text-sm text-purple-100">
                        {JSON.stringify(testResults.usernames.result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {testResults.system && (
                <div className="bg-orange-900/30 rounded-xl p-6 border border-orange-400/30">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      ⚙️ System Check
                    </h3>
                    <span className="text-sm text-orange-300">
                      {testResults.system.timestamp}
                    </span>
                  </div>
                  {testResults.system.error ? (
                    <p className="text-red-300">❌ Error: {testResults.system.error}</p>
                  ) : (
                    <pre className="bg-black/30 p-4 rounded-lg overflow-auto text-sm text-orange-100">
                      {JSON.stringify(testResults.system.result, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mt-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">🔗 Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/report" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg text-center transition-all duration-300 transform hover:-translate-y-1">
              📝 Submit Report
            </a>
            <a href="/reports/view" className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg text-center transition-all duration-300 transform hover:-translate-y-1">
              👁️ View Reports
            </a>
            <a href="/report/admin" className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg text-center transition-all duration-300 transform hover:-translate-y-1">
              🔐 Admin Panel
            </a>
            <a href="/debug-auth" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg text-center transition-all duration-300 transform hover:-translate-y-1">
              🧪 Auth Debug
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;

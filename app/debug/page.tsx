
"use client";

import React, { useState, useEffect } from 'react';

interface TestResults {
  auth?: {
    status?: number;
    ok?: boolean;
    result?: any;
    error?: string;
  };
  reports?: {
    status?: number;
    ok?: boolean;
    count?: number | string;
    result?: any;
    error?: string;
  };
}

const DebugPage = () => {
  const [testResults, setTestResults] = useState<TestResults>({});
  const [loading, setLoading] = useState(false);

  const testAuthAPI = async () => {
    try {
      setLoading(true);
      
      // Test with admin credentials
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: 'admin123', // Default test password
          page: 'admin'
        }),
      });

      const result = await response.json();
      
      setTestResults((prev: TestResults) => ({
        ...prev,
        auth: {
          status: response.status,
          ok: response.ok,
          result
        }
      }));
    } catch (error) {
      setTestResults((prev: TestResults) => ({
        ...prev,
        auth: {
          error: error instanceof Error ? error.message : 'An unknown error occurred'
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testReportsAPI = async () => {
    try {
      const response = await fetch('/api/reports');
      const result = await response.json();
      
      setTestResults((prev: TestResults) => ({
        ...prev,
        reports: {
          status: response.status,
          ok: response.ok,
          count: Array.isArray(result) ? result.length : 'Not an array',
          result: Array.isArray(result) ? result.slice(0, 2) : result
        }
      }));
    } catch (error) {
      setTestResults((prev: TestResults) => ({
        ...prev,
        reports: {
          error: error instanceof Error ? error.message : 'An unknown error occurred'
        }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">API Tests</h2>
            
            <div className="space-y-4">
              <button
                onClick={testAuthAPI}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
              >
                Test Auth API
              </button>
              
              <button
                onClick={testReportsAPI}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ml-2"
              >
                Test Reports API
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
            <div className="text-sm space-y-2">
              <p>Node Environment: {process.env.NODE_ENV}</p>
              <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not Set'}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;

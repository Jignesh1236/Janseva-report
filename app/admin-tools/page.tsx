'use client';

import { useState } from 'react';

export default function AdminTools() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const resetPasswords = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/admin/reset-passwords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ Passwords reset to default values successfully!');
      } else {
        setMessage('❌ Failed to reset passwords: ' + result.message);
      }
    } catch (error) {
      setMessage('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const verifySystem = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/admin/verify-system', {
        method: 'GET',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ System verification completed successfully!');
      } else {
        setMessage('❌ System verification failed: ' + result.message);
      }
    } catch (error) {
      setMessage('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Admin System Tools
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Password Management</h2>
          <p className="text-gray-600 mb-4">
            Reset all passwords to default values (admin123 for admin, report123 for report access)
          </p>
          <button
            onClick={resetPasswords}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md disabled:opacity-50 mr-4"
          >
            {loading ? 'Processing...' : 'Reset Default Passwords'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">System Verification</h2>
          <p className="text-gray-600 mb-4">
            Verify that authentication system is working properly
          </p>
          <button
            onClick={verifySystem}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Verify System Health'}
          </button>
        </div>

        {message && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">System Message</h3>
            <p className="whitespace-pre-wrap font-mono text-sm">{message}</p>
          </div>
        )}

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Default Credentials</h3>
          <ul className="text-yellow-700">
            <li><strong>Admin Access:</strong> admin123</li>
            <li><strong>Report Access:</strong> report123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
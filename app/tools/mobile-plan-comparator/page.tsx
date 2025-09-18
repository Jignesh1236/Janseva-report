
"use client";
import React, { useState } from 'react';

export default function MobilePlanComparator() {
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOperator, setFilterOperator] = useState('all');

  const mobilePlans = [
    // Jio Plans
    { id: '1', operator: 'Jio', price: 199, validity: 28, data: '2', calls: 'Unlimited', sms: '100', description: 'Basic Plan' },
    { id: '2', operator: 'Jio', price: 299, validity: 28, data: '25', calls: 'Unlimited', sms: '100', description: 'Popular Plan' },
    { id: '3', operator: 'Jio', price: 399, validity: 28, data: '75', calls: 'Unlimited', sms: '100', description: 'Premium Plan' },
    { id: '4', operator: 'Jio', price: 666, validity: 84, data: '2', calls: 'Unlimited', sms: '1000', description: 'Long Validity' },
    { id: '5', operator: 'Jio', price: 999, validity: 84, data: '84', calls: 'Unlimited', sms: '1000', description: 'Data Rich' },
    
    // Airtel Plans
    { id: '6', operator: 'Airtel', price: 179, validity: 28, data: '2', calls: 'Unlimited', sms: '300', description: 'Smart Plan' },
    { id: '7', operator: 'Airtel', price: 265, validity: 28, data: '12', calls: 'Unlimited', sms: '100', description: 'Data Plan' },
    { id: '8', operator: 'Airtel', price: 359, validity: 28, data: '25', calls: 'Unlimited', sms: '100', description: 'Popular Choice' },
    { id: '9', operator: 'Airtel', price: 549, validity: 56, data: '4', calls: 'Unlimited', sms: '1000', description: 'Extended Validity' },
    { id: '10', operator: 'Airtel', price: 839, validity: 84, data: '6', calls: 'Unlimited', sms: '1000', description: 'Long Term' },
    
    // Vi Plans
    { id: '11', operator: 'Vi', price: 199, validity: 28, data: '2', calls: 'Unlimited', sms: '100', description: 'Basic Starter' },
    { id: '12', operator: 'Vi', price: 299, validity: 28, data: '25', calls: 'Unlimited', sms: '100', description: 'Data Boost' },
    { id: '13', operator: 'Vi', price: 449, validity: 56, data: '4', calls: 'Unlimited', sms: '1000', description: 'Double Validity' },
    { id: '14', operator: 'Vi', price: 699, validity: 56, data: '12', calls: 'Unlimited', sms: '1000', description: 'Entertainment Pack' },
    { id: '15', operator: 'Vi', price: 999, validity: 70, data: '70', calls: 'Unlimited', sms: '100', description: 'Maximum Data' },

    // BSNL Plans
    { id: '16', operator: 'BSNL', price: 108, validity: 28, data: '2', calls: '250 min/day', sms: '100', description: 'Economy Plan' },
    { id: '17', operator: 'BSNL', price: 187, validity: 28, data: '2', calls: 'Unlimited', sms: '100', description: 'Unlimited Calls' },
    { id: '18', operator: 'BSNL', price: 247, validity: 45, data: '3', calls: 'Unlimited', sms: '100', description: 'Extended Plan' },
    { id: '19', operator: 'BSNL', price: 397, validity: 80, data: '6', calls: 'Unlimited', sms: '100', description: 'Long Duration' },
    { id: '20', operator: 'BSNL', price: 797, validity: 160, data: '12', calls: 'Unlimited', sms: '100', description: 'Longest Validity' }
  ];

  const filteredPlans = mobilePlans.filter(plan => {
    const matchesSearch = plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.price.toString().includes(searchTerm);
    const matchesOperator = filterOperator === 'all' || plan.operator === filterOperator;
    return matchesSearch && matchesOperator;
  });

  const togglePlanSelection = (planId: string) => {
    setSelectedPlans(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId);
      } else if (prev.length < 4) {
        return [...prev, planId];
      }
      return prev;
    });
  };

  const selectedPlanDetails = selectedPlans.map(id => 
    mobilePlans.find(plan => plan.id === id)
  ).filter(Boolean);

  const getOperatorColor = (operator: string) => {
    const colors = {
      'Jio': 'bg-blue-500',
      'Airtel': 'bg-red-500',
      'Vi': 'bg-purple-500',
      'BSNL': 'bg-green-500'
    };
    return colors[operator as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mobile Plan Comparator</h1>
          <p className="text-lg text-gray-600">Compare different mobile plans and find the best deal</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={filterOperator}
                onChange={(e) => setFilterOperator(e.target.value)}
                className="w-full md:w-auto p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Operators</option>
                <option value="Jio">Jio</option>
                <option value="Airtel">Airtel</option>
                <option value="Vi">Vi</option>
                <option value="BSNL">BSNL</option>
              </select>
            </div>
          </div>
          
          {selectedPlans.length > 0 && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700">
                Selected {selectedPlans.length} plan(s) for comparison. Maximum 4 plans can be compared.
              </p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plans List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Plans</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {filteredPlans.map(plan => (
                  <div 
                    key={plan.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPlans.includes(plan.id) 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => togglePlanSelection(plan.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getOperatorColor(plan.operator)}`}></div>
                        <span className="font-semibold text-gray-900">{plan.operator}</span>
                      </div>
                      <span className="text-2xl font-bold text-purple-600">₹{plan.price}</span>
                    </div>
                    
                    <h3 className="font-medium text-gray-800 mb-2">{plan.description}</h3>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Validity:</span>
                        <span>{plan.validity} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data:</span>
                        <span>{plan.data} GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Calls:</span>
                        <span>{plan.calls}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SMS:</span>
                        <span>{plan.sms}</span>
                      </div>
                    </div>
                    
                    {selectedPlans.includes(plan.id) && (
                      <div className="mt-3 text-center">
                        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                          Selected for Comparison
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comparison Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Plan Comparison</h2>
              
              {selectedPlanDetails.length === 0 ? (
                <div className="text-center text-gray-500">
                  <p>Select plans to compare</p>
                  <p className="text-sm mt-2">Click on plans to add them for comparison</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedPlanDetails.map(plan => plan && (
                    <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getOperatorColor(plan.operator)}`}></div>
                          <span className="font-semibold">{plan.operator}</span>
                        </div>
                        <button
                          onClick={() => togglePlanSelection(plan.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span className="font-bold text-purple-600">₹{plan.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Validity:</span>
                          <span>{plan.validity} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Data:</span>
                          <span>{plan.data} GB</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price/Day:</span>
                          <span>₹{(plan.price / plan.validity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {selectedPlanDetails.length > 1 && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">Best Value Analysis</h3>
                      <div className="text-sm space-y-1">
                        {(() => {
                          const cheapest = selectedPlanDetails.reduce((min: any, plan: any) => 
                            plan && (!min || plan.price < min.price) ? plan : min, null as any);
                          const bestDaily = selectedPlanDetails.reduce((min: any, plan: any) => 
                            plan && (!min || (plan.price / plan.validity) < (min.price / min.validity)) ? plan : min, null as any);
                          const mostData = selectedPlanDetails.reduce((max: any, plan: any) => 
                            plan && (!max || parseFloat(plan.data) > parseFloat(max.data)) ? plan : max, null as any);
                          
                          return (
                            <>
                              {cheapest && <p className="text-green-600">💰 Cheapest: {cheapest.operator} (₹{cheapest.price})</p>}
                              {bestDaily && <p className="text-blue-600">📅 Best Daily Value: {bestDaily.operator} (₹{(bestDaily.price / bestDaily.validity).toFixed(2)}/day)</p>}
                              {mostData && <p className="text-purple-600">📱 Most Data: {mostData.operator} ({mostData.data} GB)</p>}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

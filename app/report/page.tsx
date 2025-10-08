"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Calculator } from "lucide-react";
import Link from "next/link";

const defaultServices = [
  "7/12 8-A",
  "1951 THI 7/12",
  "STAMP COMISSION",
  "PAN CARD",
  "AADHAR CARD",
  "LIGHT BILL",
  "AAYUSHMAN CARD",
  "PVC ORDER",
  "I KHEDUT ARJI",
  "E CHALLAN",
  "PM KISHAN & KYC",
  "INDEX",
  "VARSAI",
  "ELECTION CARD",
  "PARIVAHAN",
  "PF",
  "ONLINE FROME",
  "MGVCL ARJI",
  "LAMINATION & PRINT",
  "VADHARO",
];

const particulars = [
  "KAJAL-SBI-(STAMP)",
  "KAJAL-SBI-(ANYROR)",
  "JANSEVA KENDRA (PRIVATE) PAYMENT (STAMP)",
];

const stampParticulars = ["CSC ID (PRATIK)", "CSC ID (KAJAL)"];

const balanceParticulars = [
  "CSC WALLET BALANCE (PRATIK)",
  "CSC WALLET BALANCE (KAJAL)",
  "ANYROR BALANCE",
  "JANSEVA KENDRA (PRIVATE) ",
];

const mgvclParticulars = ["CSC ID (PRATIK)", "CSC ID (KAJAL)"];

const expencesParticulars = [
  "STAMP",
  "JANSEVA KENDRA (PRIVATE) MA BHARAVEL",
  "PVC ORDER",
  "ONLINE TRANSFER",
  "ANYROR MA BHARAVEL",
  "BANK EXPENCE",
  "OTHER EXPENSES",
];

const onlinePaymentParticulars = [
  "PHONEPE",
  "GOOGLE PAY",
  "PAYTM",
  "BANK TRANSFER",
  "UPI PAYMENT",
  "CREDIT CARD",
  "DEBIT CARD",
  "NET BANKING",
];

const NewReportPage: React.FC = () => {
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({});
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [canSubmitToday, setCanSubmitToday] = useState(true);
  const [todayReportExists, setTodayReportExists] = useState(false);
  const [adminPermissionRequested, setAdminPermissionRequested] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [username, setUsername] = useState("");
  const [cash, setCash] = useState<number>(0);
  const [services, setServices] = useState<string[]>(defaultServices);
  const [customServiceName, setCustomServiceName] = useState("");
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    checkTodayReport();
    fetchUsernameSuggestions();
  }, []);

  const handlePasswordSubmit = async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: passwordInput,
          page: 'report'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsAuthenticated(true);
        setPasswordError(false);
      } else {
        setPasswordError(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setPasswordError(true);
    }
  };

  const checkTodayReport = async () => {
    const today = new Date().toISOString().split('T')[0];

    try {
      const response = await fetch(`/api/reports/filtered?date=${today}`);
      if (response.ok) {
        const reports = await response.json();
        if (reports.length > 0) {
          setTodayReportExists(true);
          setCanSubmitToday(false);
        }
      }
    } catch (error) {
      console.error('Error checking today\'s report:', error);
    }
  };

  const fetchUsernameSuggestions = async () => {
    try {
      const response = await fetch('/api/reports');
      if (response.ok) {
        const reports = await response.json();
        const uniqueUsernames = Array.from(new Set(reports.map((report: any) => report.username).filter(Boolean)));
        setUsernameSuggestions(uniqueUsernames);
      }
    } catch (error) {
      console.error('Error fetching username suggestions:', error);
    }
  };

  const requestAdminPermission = async () => {
    setAdminPermissionRequested(true);
    // In a real application, you would send a notification to admin
    alert('Admin permission request sent! Please wait for approval to submit another report today.');
  };

  const handleAmountChange = (key: string, value: string) => {
    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      [key]: parseFloat(value) || 0,
    }));
  };

  const handleRemarkChange = (key: string, value: string) => {
    setRemarks((prevRemarks) => ({
      ...prevRemarks,
      [key]: value,
    }));
  };

  const calculateTotal = (items: string[], prefix: string) => {
    return items.reduce((sum, _, index) => {
      const key = `${prefix}-${index}`;
      return sum + (amounts[key] || 0);
    }, 0);
  };

  const addCustomService = () => {
    if (customServiceName.trim()) {
      setServices([...services, customServiceName.trim().toUpperCase()]);
      setCustomServiceName("");
      setShowAddServiceModal(false);
    }
  };

  const removeCustomService = (index: number) => {
    if (index >= defaultServices.length) { // Only allow removing custom services
      const newServices = services.filter((_, i) => i !== index);
      setServices(newServices);

      // Remove associated amount data
      const key = `income-${index}`;
      const newAmounts = { ...amounts };
      delete newAmounts[key];
      setAmounts(newAmounts);

      // Adjust keys for services after the removed one
      const adjustedAmounts: { [key: string]: number } = {};
      Object.keys(newAmounts).forEach(oldKey => {
        if (oldKey.startsWith('income-')) {
          const oldIndex = parseInt(oldKey.split('-')[1]);
          if (oldIndex > index) {
            adjustedAmounts[`income-${oldIndex - 1}`] = newAmounts[oldKey];
          } else {
            adjustedAmounts[oldKey] = newAmounts[oldKey];
          }
        } else {
          adjustedAmounts[oldKey] = newAmounts[oldKey];
        }
      });
      setAmounts(adjustedAmounts);
    }
  };

  const incomeTotal = calculateTotal(services, "income");
  const depositTotal = calculateTotal(particulars, "deposit");
  const stampTotal = calculateTotal(stampParticulars, "stamp");
  const balanceTotal = calculateTotal(balanceParticulars, "balance");
  const mgvclTotal = calculateTotal(mgvclParticulars, "mgvcl");
  const expencesTotal = calculateTotal(expencesParticulars, "expences");
  const onlinePaymentTotal = calculateTotal(onlinePaymentParticulars, "onlinePayment");
    const cashTotal = cash;

  const handleSubmit = async () => {
    if (!canSubmitToday && !adminPermissionRequested) {
      alert('You have already submitted a report today. Please request admin permission to submit another report.');
      return;
    }

    if (!username.trim()) {
      alert('Please enter your username before submitting the report.');
      return;
    }

    setLoading(true);
    const reportData = {
      username: username.trim(),
      income: services.map((service, index) => ({
        name: service,
        amount: amounts[`income-${index}`] || 0,
      })),
      deposit: particulars.map((particular, index) => ({
        name: particular,
        amount: amounts[`deposit-${index}`] || 0,
      })),
      stamp: stampParticulars.map((particular, index) => ({
        name: particular,
        amount: amounts[`stamp-${index}`] || 0,
        remark: remarks[`stamp-${index}`] || "",
      })),
      balance: balanceParticulars.map((particular, index) => ({
        name: particular,
        amount: amounts[`balance-${index}`] || 0,
        remark: remarks[`balance-${index}`] || "",
      })),
      mgvcl: mgvclParticulars.map((particular, index) => ({
        name: particular,
        amount: amounts[`mgvcl-${index}`] || 0,
        remark: remarks[`mgvcl-${index}`] || "",
      })),
      expences: expencesParticulars.map((particular, index) => ({
        name: particular,
        amount: amounts[`expences-${index}`] || 0,
        remark: remarks[`expences-${index}`] || "",
      })),
      onlinePayment: onlinePaymentParticulars.map((particular, index) => ({
        name: particular,
        amount: amounts[`onlinePayment-${index}`] || 0,
        remark: remarks[`onlinePayment-${index}`] || "",
      })),
            cash: parseFloat(cash.toString()) || 0,
      totals: {
        income: incomeTotal,
        deposit: depositTotal,
        stamp: stampTotal,
        balance: balanceTotal,
        mgvcl: mgvclTotal,
        expences: expencesTotal,
        onlinePayment: onlinePaymentTotal,
        cash: cashTotal,
      },
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        alert("Report submitted successfully!");
        router.push("/reports/view");
      } else {
        alert("Failed to submit report.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("An error occurred while submitting the report.");
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (title: string, items: string[], prefix: string, showRemarks: boolean = false, bgColor: string = "bg-blue-50", allowCustom: boolean = false) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      <div className={`${bgColor} px-6 py-4 border-b`}>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          {allowCustom && (
            <button
              onClick={() => setShowAddServiceModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <span>+</span>
              <span>Add Custom Service</span>
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {title.includes("INCOME") ? "SERVICE NAME" : title.includes("PAYMENT") ? "PAYMENT METHOD" : "PARTICULARE"}
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
              {showRemarks && (
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REMARK</th>
              )}
              {allowCustom && (
                <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-sm text-gray-900">{index + 1}</td>
                <td className="py-4 px-6 text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    {item}
                    {allowCustom && index >= defaultServices.length && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Custom</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="₹ 0.00"
                    value={amounts[`${prefix}-${index}`] || ""}
                    onChange={(e) => handleAmountChange(`${prefix}-${index}`, e.target.value)}
                  />
                </td>
                {showRemarks && (
                  <td className="py-4 px-6">
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter remark"
                      value={remarks[`${prefix}-${index}`] || ""}
                      onChange={(e) => handleRemarkChange(`${prefix}-${index}`, e.target.value)}
                    />
                  </td>
                )}
                {allowCustom && (
                  <td className="py-4 px-6 text-center">
                    {index >= defaultServices.length && (
                      <button
                        onClick={() => removeCustomService(index)}
                        className="text-red-600 hover:text-red-800 font-medium py-1 px-3 rounded-lg hover:bg-red-50 transition-colors duration-200"
                        title="Remove Custom Service"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td
                className="py-4 px-6 text-sm font-bold text-gray-900 text-right"
                colSpan={showRemarks ? (allowCustom ? 4 : 3) : (allowCustom ? 3 : 2)}
              >
                Total Amount:
              </td>
              <td className="py-4 px-6 text-lg font-bold text-blue-600">
                ₹{calculateTotal(items, prefix).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

  // Password protection - show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Access Protected</h1>
            <p className="text-gray-600">Please enter the password to access the report page</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter password"
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">Incorrect password. Please try again.</p>
              )}
            </div>

            <button
              onClick={handlePasswordSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Access Report
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-800">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Create New Report</h1>
                <p className="text-gray-600">Fill in the financial details for your report</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-gray-500" />
                <div className="text-sm text-gray-500">
                Total: ₹{(incomeTotal + depositTotal + stampTotal + balanceTotal + mgvclTotal + onlinePaymentTotal + cashTotal - expencesTotal).toFixed(2)}
              </div>
              </div>
              <Link
                href="/reports/view"
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                View Reports
              </Link>
              <Link
                href="/report/admin"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Daily Report Restriction Warning */}
        {todayReportExists && !adminPermissionRequested && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Daily Report Already Submitted</h3>
                <p className="text-yellow-700">You have already submitted a report today. You can request admin permission to submit another report.</p>
              </div>
              <button
                onClick={requestAdminPermission}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Request Admin Permission
              </button>
            </div>
          </div>
        )}

        {adminPermissionRequested && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Admin Permission Requested</h3>
                <p className="text-sm text-blue-700">Your request has been sent to the admin. You can now submit another report.</p>
              </div>
            </div>
          </div>
        )}

        {renderTable("INCOME", services, "income", false, "bg-green-50", true)}
        {renderTable("DEPOSIT AMOUNT (APEL RAKAM)", particulars, "deposit", false, "bg-blue-50")}
        {renderTable("STAMP PRINTING REPORT", stampParticulars, "stamp", true, "bg-purple-50")}
        {renderTable("BALANCE (BACHAT RAKAM)", balanceParticulars, "balance", true, "bg-yellow-50")}
        {renderTable("MGVCL REPORT", mgvclParticulars, "mgvcl", true, "bg-indigo-50")}
        {renderTable("EXPENSES", expencesParticulars, "expences", true, "bg-red-50")}
        {renderTable("ONLINE PAYMENT", onlinePaymentParticulars, "onlinePayment", true, "bg-teal-50")}

        {/* Cash Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cash
            </label>
            <input
              type="number"
              value={cash}
              onChange={(e) => setCash(parseFloat(e.target.value))}
              placeholder="Enter cash amount"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Username Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="max-w-md mx-auto relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username (Required for submission)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {showSuggestions && usernameSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {usernameSuggestions
                  .filter(suggestion => suggestion.toLowerCase().includes(username.toLowerCase()))
                  .map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setUsername(suggestion);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 transition-colors"
                    >
                      {suggestion}
                    </div>
                  ))}
              </div>
            )}
            {!username.trim() && (
              <p className="text-red-500 text-sm mt-1">Username is required to submit the report</p>
            )}
          </div>
        </div>

        {/* Submit Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">INCOME (Services Only)</p>
              <p className="text-2xl font-bold text-green-700">₹{incomeTotal.toFixed(2)}</p>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg">
              <p className="text-sm text-teal-600 font-medium">G PAY</p>
              <p className="text-2xl font-bold text-teal-700">₹{onlinePaymentTotal.toFixed(2)}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-600 font-medium">CASH</p>
              <p className="text-2xl font-bold text-orange-700">₹{cashTotal.toFixed(2)}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">EXPENSES</p>
              <p className="text-2xl font-bold text-red-700">₹{expencesTotal.toFixed(2)}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">NET INCOME</p>
              <p className="text-2xl font-bold text-blue-700">₹{(incomeTotal - expencesTotal).toFixed(2)}</p>
            </div>
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={loading || (!canSubmitToday && !adminPermissionRequested) || !username.trim()}
          >
            <Save className="h-5 w-5" />
            <span>
              {loading ? "Submitting..." : 
               (!canSubmitToday && !adminPermissionRequested) ? "Daily Report Already Submitted" : 
               !username.trim() ? "Enter Username to Submit" :
               "Submit Report"}
            </span>
          </button>
        </div>

        {/* Add Custom Service Modal */}
        {showAddServiceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Add Custom Service</h3>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={customServiceName}
                    onChange={(e) => setCustomServiceName(e.target.value)}
                    placeholder="Enter custom service name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addCustomService()}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowAddServiceModal(false);
                      setCustomServiceName("");
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addCustomService}
                    disabled={!customServiceName.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg font-medium"
                  >
                    Add Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewReportPage;

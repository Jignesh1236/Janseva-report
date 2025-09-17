"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  Calendar,
  Search,
  BarChart3,
  DollarSign,
  TrendingUp,
  FileText,
  Users,
  RefreshCw,
  ExternalLink,
  Printer,
  Settings,
  Bell,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Clock,
  PieChart,
  Activity,
  Loader2,
  Lock,
  X
} from "lucide-react";

interface Report {
  id: string;
  username: string;
  income: any[];
  deposit: any[];
  stamp: any[];
  balance: any[];
  mgvcl: any[];
  expences: any[];
  onlinePayment: any[];
  cash?: number;
  totals: any;
  timestamp: string;
  lastModified?: string;
  auditLog?: Array<{
    timestamp: string;
    action: string;
    user: string;
    changes: string;
  }>;
}

// EditReportForm Component
const EditReportForm: React.FC<{
  report: Report;
  onSave: (updatedReport: Report) => void;
  onCancel: () => void;
}> = ({ report, onSave, onCancel }) => {
  const [editedReport, setEditedReport] = useState<Report>(JSON.parse(JSON.stringify(report)));
  const [activeSection, setActiveSection] = useState<string>('income');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const sections = [
    { id: 'reportDate', name: 'Report Date', icon: Calendar },
    { id: 'income', name: 'Income', icon: DollarSign },
    { id: 'deposit', name: 'Deposit', icon: BarChart3 },
    { id: 'stamp', name: 'Stamp', icon: FileText },
    { id: 'balance', name: 'Balance', icon: PieChart },
    { id: 'mgvcl', name: 'MGVCL', icon: Activity },
    { id: 'expences', name: 'Expenses', icon: TrendingUp },
    { id: 'onlinePayment', name: 'Online Payment', icon: DollarSign },
    { id: 'cash', name: 'Cash Amount', icon: DollarSign },
  ];

  const updateSectionItem = (section: string, index: number, field: string, value: any) => {
    const updatedReport = { ...editedReport };
    if (updatedReport[section as keyof Report]) {
      (updatedReport[section as keyof Report] as any)[index] = {
        ...(updatedReport[section as keyof Report] as any)[index],
        [field]: field === 'amount' ? parseFloat(value) || 0 : value,
      };

      // Recalculate totals
      const sectionTotal = (updatedReport[section as keyof Report] as any[]).reduce(
        (sum: number, item: any) => sum + (item.amount || 0),
        0
      );
      updatedReport.totals = {
        ...updatedReport.totals,
        [section]: sectionTotal,
      };

      setEditedReport(updatedReport);
    }
  };

  const updateCashAmount = (value: number) => {
    const updatedReport = { ...editedReport };
    updatedReport.cash = value;
    setEditedReport(updatedReport);
  };

  const updateReportDate = (dateString: string) => {
    console.log("updateReportDate called with:", dateString);
    const updatedReport = { ...editedReport };
    
    if (dateString && dateString.trim() !== '') {
      try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          updatedReport.timestamp = date.toISOString();
          setEditedReport(updatedReport);
          console.log("Date successfully updated to:", updatedReport.timestamp);
        } else {
          console.log("Invalid date provided:", dateString);
          alert("Invalid date format. Please select a valid date and time.");
        }
      } catch (error) {
        console.error("Error parsing date:", error);
        alert("Error updating date. Please try again.");
      }
    } else {
      console.log("Empty date input, setting to current time");
      updatedReport.timestamp = new Date().toISOString();
      setEditedReport(updatedReport);
    }
  };

  const addSectionItem = (section: string) => {
    const updatedReport = { ...editedReport };
    const newItem = { name: '', amount: 0, remark: '' };
    (updatedReport[section as keyof Report] as any[]).push(newItem);
    setEditedReport(updatedReport);
  };

  const removeSectionItem = (section: string, index: number) => {
    const updatedReport = { ...editedReport };
    (updatedReport[section as keyof Report] as any[]).splice(index, 1);

    // Recalculate totals
    const sectionTotal = (updatedReport[section as keyof Report] as any[]).reduce(
      (sum: number, item: any) => sum + (item.amount || 0),
      0
    );
    updatedReport.totals = {
      ...updatedReport.totals,
      [section]: sectionTotal,
    };

    setEditedReport(updatedReport);
  };

  const validateReport = () => {
    const errors: string[] = [];

    sections.forEach(section => {
      // Special handling for cash field
      if (section.id === 'cash') {
        const cashAmount = editedReport.cash || 0;
        if (cashAmount < 0) {
          errors.push(`${section.name}: Amount cannot be negative`);
        }
        return; // Skip array validation for cash
      }

      const sectionData = editedReport[section.id as keyof Report] as any[];
      if (sectionData && Array.isArray(sectionData)) {
        sectionData.forEach((item, index) => {
          if (!item.name || item.name.trim() === '') {
            errors.push(`${section.name} item ${index + 1}: Name is required`);
          }
          if (item.amount < 0) {
            errors.push(`${section.name} item ${index + 1}: Amount cannot be negative`);
          }
        });
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    console.log("HandleSave called, validating report...");
    if (validateReport()) {
      console.log("Validation passed, preparing to save...");
      // Add audit trail
      const auditLog = {
        timestamp: new Date().toISOString(),
        action: 'edit',
        user: 'admin', // In a real app, this would come from authentication
        changes: 'Report modified via admin panel',
      };

      const finalReport = {
        ...editedReport,
        lastModified: new Date().toISOString(),
        auditLog: [...(report.auditLog || []), auditLog],
      };

      console.log("Calling onSave with:", finalReport);
      onSave(finalReport);
    } else {
      console.log("Validation failed, not saving.");
    }
  };

  const renderSectionEditor = () => {
    // Special handling for report date field
    if (activeSection === 'reportDate') {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-lg text-gray-800">
              Edit Report Date & Time
            </h4>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Date & Time
            </label>
            <input
              type="datetime-local"
              value={(() => {
                try {
                  if (editedReport.timestamp) {
                    const date = new Date(editedReport.timestamp);
                    if (!isNaN(date.getTime())) {
                      // Format for datetime-local input (YYYY-MM-DDTHH:MM)
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      const hours = String(date.getHours()).padStart(2, '0');
                      const minutes = String(date.getMinutes()).padStart(2, '0');
                      return `${year}-${month}-${day}T${hours}:${minutes}`;
                    }
                  }
                  // Default to current date and time
                  const now = new Date();
                  const year = now.getFullYear();
                  const month = String(now.getMonth() + 1).padStart(2, '0');
                  const day = String(now.getDate()).padStart(2, '0');
                  const hours = String(now.getHours()).padStart(2, '0');
                  const minutes = String(now.getMinutes()).padStart(2, '0');
                  return `${year}-${month}-${day}T${hours}:${minutes}`;
                } catch (e) {
                  const now = new Date();
                  const year = now.getFullYear();
                  const month = String(now.getMonth() + 1).padStart(2, '0');
                  const day = String(now.getDate()).padStart(2, '0');
                  const hours = String(now.getHours()).padStart(2, '0');
                  const minutes = String(now.getMinutes()).padStart(2, '0');
                  return `${year}-${month}-${day}T${hours}:${minutes}`;
                }
              })()}
              onChange={(e) => {
                const inputValue = e.target.value;
                console.log("DateTime input changed:", inputValue);
                if (inputValue) {
                  // Convert datetime-local input to proper date object
                  const dateObj = new Date(inputValue);
                  if (!isNaN(dateObj.getTime())) {
                    updateReportDate(dateObj.toISOString());
                  }
                } else {
                  console.log("Empty date input, setting to current time");
                  updateReportDate(new Date().toISOString());
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              Current: {(() => {
                try {
                  if (editedReport.timestamp) {
                    const date = new Date(editedReport.timestamp);
                    if (!isNaN(date.getTime())) {
                      return date.toLocaleString('en-IN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      });
                    }
                  }
                  return 'No valid date set';
                } catch (e) {
                  return 'Invalid date format';
                }
              })()}
            </p>
          </div>
        </div>
      );
    }

    // Special handling for cash field
    if (activeSection === 'cash') {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-lg text-gray-800">
              Edit Cash Amount
            </h4>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cash Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              value={editedReport.cash || 0}
              onChange={(e) => updateCashAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter cash amount"
            />
          </div>
        </div>
      );
    }

    const sectionData = editedReport[activeSection as keyof Report] as any[];

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-lg text-gray-800">
            Edit {sections.find(s => s.id === activeSection)?.name}
          </h4>
          <button
            onClick={() => addSectionItem(activeSection)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add Item</span>
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Amount</th>
                {activeSection !== 'income' && <th className="px-4 py-2 text-left">Remark</th>}
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sectionData?.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={item.name || ''}
                      onChange={(e) => updateSectionItem(activeSection, index, 'name', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={item.amount || 0}
                      onChange={(e) => updateSectionItem(activeSection, index, 'amount', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  {activeSection !== 'income' && (
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={item.remark || ''}
                        onChange={(e) => updateSectionItem(activeSection, index, 'remark', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => removeSectionItem(activeSection, index)}
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                      title="Remove Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="font-semibold">
            Section Total: ₹{(editedReport.totals?.[activeSection] || 0).toFixed(2)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h4 className="font-semibold text-red-800">Validation Errors</h4>
          </div>
          <ul className="list-disc list-inside text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Section Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{section.name}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {section.id === 'cash' || section.id === 'reportDate' ? '1' : (editedReport[section.id as keyof Report] as any[])?.length || 0}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Section Editor */}
      {renderSectionEditor()}

      {/* Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-3">Updated Report Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-blue-600">Total Income (Services Only)</p>
            <p className="font-bold text-blue-800">₹{(editedReport.totals?.income || 0).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-red-600">Total Expenses</p>
            <p className="font-bold text-red-800">₹{(editedReport.totals?.expences || 0).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-green-600">NET INCOME</p>
            <p className="font-bold text-green-800">
              ₹{((editedReport.totals?.income || 0) - (editedReport.totals?.expences || 0)).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-purple-600">Online Payment</p>
            <p className="font-bold text-purple-800">₹{(editedReport.totals?.onlinePayment || 0).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={validationErrors.length > 0}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center space-x-2"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

const AdminPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "income" | "expenses">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedPeriod, setSelectedPeriod] = useState<
    "today" | "week" | "month" | "year"
  >("month");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minIncome, setMinIncome] = useState("");
  const [maxIncome, setMaxIncome] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordManagerLoading, setPasswordManagerLoading] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReports();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterAndSortReports();
  }, [reports, searchTerm, dateFilter, usernameFilter, sortBy, sortOrder, minIncome, maxIncome, startDate, endDate, reportType]);

  const handlePasswordSubmit = async () => {
    if (!passwordInput.trim()) return;

    setPasswordManagerLoading(true);
    setPasswordError(false);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: passwordInput,
          page: 'admin'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsAuthenticated(true);
        setAuthToken(passwordInput); // Store the password as auth token
        setPasswordInput('');
      } else {
        setPasswordError(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setPasswordError(true);
    } finally {
      setPasswordManagerLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports", {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'x-page': 'admin',
          'x-username': 'admin'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        if (response.status === 401 || response.status === 403) {
          setIsAuthenticated(false);
          setError("Authentication failed. Please log in again.");
        } else {
          setError("Failed to fetch reports");
        }
      }
    } catch (err) {
      setError("Error fetching reports");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortReports = () => {
    let filtered = reports;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          new Date(report.timestamp).toLocaleDateString().includes(searchTerm) ||
          (report.username || '').toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Username filter
    if (usernameFilter) {
      filtered = filtered.filter(
        (report) =>
          (report.username || '').toLowerCase().includes(usernameFilter.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter((report) => {
        const reportDate = new Date(report.timestamp)
          .toISOString()
          .split("T")[0];
        return reportDate === dateFilter;
      });
    }

    // Income range filter
    if (minIncome || maxIncome) {
      filtered = filtered.filter((report) => {
        const income = report.totals?.income || 0;
        const min = parseFloat(minIncome) || 0;
        const max = parseFloat(maxIncome) || Infinity;
        return income >= min && income <= max;
      });
    }

    // Date range filter
    if (startDate || endDate) {
      filtered = filtered.filter((report) => {
        const reportDate = new Date(report.timestamp);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999); // Include the entire end date
        return reportDate >= start && reportDate <= end;
      });
    }

    // Report type filter
    if (reportType) {
      filtered = filtered.filter((report) => {
        const netAmount = (report.totals?.income || 0) - (report.totals?.expences || 0);
        const income = report.totals?.income || 0;

        switch (reportType) {
          case "profit":
            return netAmount > 0;
          case "loss":
            return netAmount < 0;
          case "high-income":
            return income > 5000; // Define high income threshold
          default:
            return true;
        }
      });
    }

    // Sort reports
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case "income":
          comparison = (a.totals?.income || 0) - (b.totals?.income || 0);
          break;
        case "expenses":
          comparison = (a.totals?.expences || 0) - (b.totals?.expences || 0);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredReports(filtered);
  };

  const calculateNetAmount = (report: Report) => {
    return (report.totals?.income || 0) - (report.totals?.expences || 0);
  };

  const printReport = (report: Report) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const netAmount = calculateNetAmount(report);
      const reportDate = new Date(report.timestamp).toLocaleDateString('en-IN');
      const cashAmount = typeof report.cash === 'number' ? report.cash : 0;

      printWindow.document.write(`
        <html>
          <head>
            <title>JANSEVA-2025 Daily Report - ${reportDate}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body { 
                font-family: 'Arial', sans-serif; 
                margin: 10px; 
                color: #000; 
                font-size: 11px;
                line-height: 1.3;
                background: white;
              }
              .header { 
                text-align: center; 
                margin-bottom: 20px;
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
              }
              .header h1 { 
                font-size: 18px; 
                margin: 8px 0; 
                font-weight: bold;
                text-transform: uppercase;
              }
              .header p { 
                margin: 3px 0; 
                font-size: 12px;
                font-weight: 500;
              }
              .report-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                padding: 5px 0;
                border-bottom: 1px solid #ccc;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-bottom: 12px;
                font-size: 10px;
              }
              th, td { 
                border: 1px solid #000; 
                padding: 3px 5px; 
                text-align: left;
                vertical-align: top;
              }
              th { 
                background-color: #f5f5f5; 
                font-weight: bold;
                text-align: center;
                font-size: 9px;
                text-transform: uppercase;
              }
              .section-title { 
                font-weight: bold; 
                margin: 12px 0 5px 0;
                text-align: center;
                font-size: 12px;
                background-color: #e9ecef;
                padding: 5px;
                border: 1px solid #000;
                text-transform: uppercase;
              }
              .two-column { 
                display: flex; 
                gap: 15px; 
              }
              .column { 
                flex: 1; 
              }
              .amount { 
                text-align: right; 
                font-weight: 500;
              }
              .total-row { 
                font-weight: bold; 
                background-color: #f9f9f9;
                border-top: 2px solid #000;
              }
              .total-row td {
                font-weight: bold;
                font-size: 11px;
              }
              .summary-box {
                border: 3px solid #000;
                padding: 15px;
                margin: 25px auto;
                width: 350px;
                text-align: center;
                background-color: #f8f9fa;
              }
              .summary-box h3 {
                margin: 0 0 12px 0;
                font-size: 14px;
                text-transform: uppercase;
                border-bottom: 1px solid #000;
                padding-bottom: 5px;
              }
              .summary-table {
                width: 100%;
                border-collapse: collapse;
              }
              .summary-table td {
                border: 1px solid #000;
                padding: 6px 10px;
                font-weight: bold;
                font-size: 11px;
              }
              .net-income-row {
                background-color: #e3f2fd;
                font-size: 12px;
              }
              .signature-section {
                margin-top: 30px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                page-break-inside: avoid;
              }
              .signature-box {
                text-align: center;
                width: 200px;
              }
              .signature-line {
                border-bottom: 2px solid #000;
                width: 180px;
                height: 40px;
                margin: 10px auto;
              }
              @media print { 
                body { 
                  margin: 5px; 
                  -webkit-print-color-adjust: exact;
                  color-adjust: exact;
                }
                .no-print { 
                  display: none; 
                }
                .page-break {
                  page-break-before: always;
                }
                .summary-box {
                  page-break-inside: avoid;
                }
              }
              @page {
                margin: 0.5in;
                size: A4;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>JANSEVA-2025 (DAILY REPORT)</h1>
              <p>Complete Financial Summary</p>
            </div>

            <div class="report-info">
              <div><strong>DATE:</strong> ${reportDate}</div>
              <div><strong>USER:</strong> ${report.username || 'N/A'}</div>
              <div><strong>REPORT ID:</strong> ${report.id.slice(0, 8)}...</div>
            </div>

            <div class="two-column">
              <div class="column">
                <div class="section-title">Deposit Amount (અપેલ રકમ)</div>
                <table>
                  <thead>
                    <tr>
                      <th style="width: 10%">No</th>
                      <th style="width: 65%">Particulars</th>
                      <th style="width: 25%">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${report.deposit?.map((item, index) => `
                      <tr>
                        <td style="text-align: center">${index + 1}</td>
                        <td>${item.name || 'N/A'}</td>
                        <td class="amount">₹${(item.amount || 0).toFixed(2)}</td>
                      </tr>
                    `).join('') || '<tr><td colspan="3" style="text-align: center; color: #666;">No data available</td></tr>'}
                    <tr class="total-row">
                      <td colspan="2" style="text-align: center">TOTAL DEPOSIT</td>
                      <td class="amount">₹${(report.totals?.deposit || 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                <div class="section-title">Stamp Printing Report</div>
                <table>
                  <thead>
                    <tr>
                      <th style="width: 8%">No</th>
                      <th style="width: 40%">Particulars</th>
                      <th style="width: 22%">Amount (₹)</th>
                      <th style="width: 30%">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${report.stamp?.map((item, index) => `
                      <tr>
                        <td style="text-align: center">${index + 1}</td>
                        <td>${item.name || 'N/A'}</td>
                        <td class="amount">₹${(item.amount || 0).toFixed(2)}</td>
                        <td>${item.remark || '-'}</td>
                      </tr>
                    `).join('') || '<tr><td colspan="4" style="text-align: center; color: #666;">No data available</td></tr>'}
                    <tr class="total-row">
                      <td colspan="3" style="text-align: center">TOTAL STAMP</td>
                      <td class="amount">₹${(report.totals?.stamp || 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                <div class="section-title">Income (Services)</div>
                <table>
                  <thead>
                    <tr>
                      <th style="width: 10%">No</th>
                      <th style="width: 65%">Service Name</th>
                      <th style="width: 25%">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${report.income?.filter(item => item.amount > 0).map((item, index) => `
                      <tr>
                        <td style="text-align: center">${index + 1}</td>
                        <td>${item.name || 'N/A'}</td>
                        <td class="amount">₹${(item.amount || 0).toFixed(2)}</td>
                      </tr>
                    `).join('') || '<tr><td colspan="3" style="text-align: center; color: #666;">No income recorded</td></tr>'}
                    <tr class="total-row">
                      <td colspan="2" style="text-align: center">TOTAL INCOME</td>
                      <td class="amount">₹${(report.totals?.income || 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="column">
                <div class="section-title">Balance (બચત રકમ)</div>
                <table>
                  <thead>
                    <tr>
                      <th style="width: 10%">No</th>
                      <th style="width: 65%">Particulars</th>
                      <th style="width: 25%">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${report.balance?.map((item, index) => `
                      <tr>
                        <td style="text-align: center">${index + 1}</td>
                        <td>${item.name || 'N/A'}</td>
                        <td class="amount">₹${(item.amount || 0).toFixed(2)}</td>
                      </tr>
                    `).join('') || '<tr><td colspan="3" style="text-align: center; color: #666;">No data available</td></tr>'}
                    <tr class="total-row">
                      <td colspan="2" style="text-align: center">TOTAL BALANCE</td>
                      <td class="amount">₹${(report.totals?.balance || 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                <div class="section-title">MGVCL Report</div>
                <table>
                  <thead>
                    <tr>
                      <th style="width: 8%">No</th>
                      <th style="width: 40%">Particulars</th>
                      <th style="width: 22%">Amount (₹)</th>
                      <th style="width: 30%">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${report.mgvcl?.map((item, index) => `
                      <tr>
                        <td style="text-align: center">${index + 1}</td>
                        <td>${item.name || 'N/A'}</td>
                        <td class="amount">₹${(item.amount || 0).toFixed(2)}</td>
                        <td>${item.remark || '-'}</td>
                      </tr>
                    `).join('') || '<tr><td colspan="4" style="text-align: center; color: #666;">No data available</td></tr>'}
                    <tr class="total-row">
                      <td colspan="3" style="text-align: center">TOTAL MGVCL</td>
                      <td class="amount">₹${(report.totals?.mgvcl || 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                <div class="section-title">Online Payment</div>
                <table>
                  <thead>
                    <tr>
                      <th style="width: 8%">No</th>
                      <th style="width: 35%">Payment Method</th>
                      <th style="width: 22%">Amount (₹)</th>
                      <th style="width: 35%">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${report.onlinePayment?.filter(item => item.amount > 0 || item.remark).map((item, index) => `
                      <tr>
                        <td style="text-align: center">${index + 1}</td>
                        <td>${item.name || 'N/A'}</td>
                        <td class="amount">₹${(item.amount || 0).toFixed(2)}</td>
                        <td>${item.remark || '-'}</td>
                      </tr>
                    `).join('') || '<tr><td colspan="4" style="text-align: center; color: #666;">No online payments</td></tr>'}
                    <tr class="total-row">
                      <td colspan="3" style="text-align: center">TOTAL ONLINE</td>
                      <td class="amount">₹${(report.totals?.onlinePayment || 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                <div class="section-title">Expenses</div>
                <table>
                  <thead>
                    <tr>
                      <th style="width: 8%">No</th>
                      <th style="width: 35%">Expense Type</th>
                      <th style="width: 22%">Amount (₹)</th>
                      <th style="width: 35%">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${report.expences?.filter(item => item.amount > 0 || item.name).map((item, index) => `
                      <tr>
                        <td style="text-align: center">${index + 1}</td>
                        <td>${item.name || 'N/A'}</td>
                        <td class="amount">₹${(item.amount || 0).toFixed(2)}</td>
                        <td>${item.remark || '-'}</td>
                      </tr>
                    `).join('') || '<tr><td colspan="4" style="text-align: center; color: #666;">No expenses recorded</td></tr>'}
                    <tr class="total-row">
                      <td colspan="3" style="text-align: center">TOTAL EXPENSES</td>
                      <td class="amount">₹${(report.totals?.expences || 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="summary-box">
              <h3>Financial Summary</h3>
              <table class="summary-table">
                <tbody>
                  <tr>
                    <td style="text-align: left; width: 60%;">SERVICE INCOME:</td>
                    <td style="text-align: right; width: 40%;">₹${(report.totals?.income || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="text-align: left;">ONLINE PAYMENT (G PAY):</td>
                    <td style="text-align: right;">₹${(report.totals?.onlinePayment || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="text-align: left;">CASH AMOUNT:</td>
                    <td style="text-align: right;">₹${cashAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="text-align: left;">TOTAL EXPENSES:</td>
                    <td style="text-align: right;">₹${(report.totals?.expences || 0).toFixed(2)}</td>
                  </tr>
                  <tr class="net-income-row">
                    <td style="text-align: left; font-size: 13px;"><strong>NET INCOME:</strong></td>
                    <td style="text-align: right; font-size: 13px;"><strong>₹${((report.totals?.income || 0) - (report.totals?.expences || 0)).toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="signature-section">
              <div class="signature-box">
                <div><strong>PREPARED BY</strong></div>
                <div class="signature-line"></div>
                <div>${report.username || 'N/A'}</div>
                <div style="font-size: 9px; margin-top: 5px;">${new Date().toLocaleString()}</div>
              </div>
              <div class="signature-box">
                <div><strong>SUPERVISOR SIGN</strong></div>
                <div class="signature-line"></div>
                <div>Authorized Signature</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();

      // Auto print with a small delay to ensure content is loaded
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      alert('Please allow pop-ups to print the report');
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setPasswordChangeLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          password: newPassword,
          page: 'admin',
          role: 'admin'
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Password changed successfully');
        setShowPasswordChange(false);
        setNewPassword('');
        setConfirmPassword('');
        setAuthToken(newPassword); // Update auth token to new password
      } else {
        alert(`Failed to change password: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const updateReport = async (updatedReport: Report) => {
    try {
      console.log("Attempting to update report:", updatedReport.id);

      // Add audit log entry
      const auditEntry = {
        timestamp: new Date().toISOString(),
        action: 'modified',
        user: 'admin',
        changes: 'Report edited via admin panel'
      };

      const reportWithAudit = {
        ...updatedReport,
        lastModified: new Date().toISOString(),
        auditLog: [...(updatedReport.auditLog || []), auditEntry]
      };

      const response = await fetch(`/api/reports/${updatedReport.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'x-page': 'admin',
          'x-username': 'admin'
        },
        body: JSON.stringify(reportWithAudit)
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Failed to update report');
      }

      if (result.success) {
        console.log("Update successful, data:", result.data || result.report);
        // Update the report in the state
        const updatedReportData = result.data || result.report || updatedReport;
        setReports(prev => 
          prev.map(report => 
            report.id === updatedReport.id ? updatedReportData : report
          )
        );

        // Close the modal and reset states
        setShowModal(false);
        setSelectedReport(null);
        setEditMode(false);
        setEditingReport(null);

        alert("Report updated successfully!");

        // Refresh reports to ensure consistency
        fetchReports();

        return true;
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error) {
      console.error("Error updating report:", error);
      alert(`An error occurred while updating the report: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  const exportToCSV = (reportsToExport: Report[] = filteredReports) => {
    if (reportsToExport.length === 0) {
      alert("No reports to export");
      return;
    }

    const headers = [
      'Report ID', 'Date', 'Username', 'Total Income', 'Total Expenses', 
      'Total Deposit', 'Total Stamp', 'Total Balance', 'Total MGVCL', 
      'Total Online Payment', 'Cash Amount', 'Net Profit'
    ];

    const csvData = reportsToExport.map(report => [
      report.id,
      new Date(report.timestamp).toLocaleDateString(),
      report.username || '',
      (report.totals?.income || 0).toFixed(2),
      (report.totals?.expences || 0).toFixed(2),
      (report.totals?.deposit || 0).toFixed(2),
      (report.totals?.stamp || 0).toFixed(2),
      (report.totals?.balance || 0).toFixed(2),
      (report.totals?.mgvcl || 0).toFixed(2),
      (report.totals?.onlinePayment || 0).toFixed(2),
      (report.cash || 0).toFixed(2),
      ((report.totals?.income || 0) - (report.totals?.expences || 0)).toFixed(2)
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reports_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };



  const deleteReport = async (reportId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this report? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/reports?id=${reportId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'x-page': 'admin',
          'x-username': 'admin'
        }
      });

      if (response.ok) {
        setReports(reports.filter((report) => report.id !== reportId));
        alert("Report deleted successfully!");
      } else {
        alert("Failed to delete report.");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("An error occurred while deleting the report.");
    }
  };

  const calculateStats = () => {
    const now = new Date();
    let periodReports = reports;

    switch (selectedPeriod) {
      case "today":
        periodReports = reports.filter((report) => {
          const reportDate = new Date(report.timestamp);
          return reportDate.toDateString() === now.toDateString();
        });
        break;
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        periodReports = reports.filter(
          (report) => new Date(report.timestamp) >= weekAgo,
        );
        break;
      case "month":
        const monthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate(),
        );
        periodReports = reports.filter(
          (report) => new Date(report.timestamp) >= monthAgo,
        );
        break;
      case "year":
        const yearAgo = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate(),
        );
        periodReports = reports.filter(
          (report) => new Date(report.timestamp) >= yearAgo,
        );
        break;
    }

    const totalIncome = periodReports.reduce((acc, report) => {
            return acc + (report.totals?.income || 0);
          }, 0);
    const totalExpenses = periodReports.reduce(
      (sum, report) => sum + (report.totals?.expences || 0),
      0,
    );
    const totalDeposit = periodReports.reduce(
      (sum, report) => sum + (report.totals?.deposit || 0),
      0,
    );
    const totalOnlinePayment = periodReports.reduce(
      (sum, report) => sum + (report.totals?.onlinePayment || 0),
      0,
    );
    const netProfit = totalIncome - totalExpenses;
    const totalReports = periodReports.length;
    const avgDailyIncome = totalIncome / Math.max(1, periodReports.length);

    return {
      totalIncome,
      totalExpenses,
      totalDeposit,
      totalOnlinePayment,
      netProfit,
      totalReports,
      avgDailyIncome,
      periodReports,
    };
  };

  const stats = calculateStats();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Password protected login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-2xl rounded-2xl border border-gray-100">
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Settings className="h-8 w-8 text-blue-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-gray-600 mt-2">
                    Enter admin password to access the control panel
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Admin Password
                    </label>
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setPasswordError(false);
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        passwordError ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter admin password"
                      data-testid="input-admin-password"
                    />
                    {passwordError && (
                      <div className="flex items-center space-x-2 mt-3 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm">Incorrect password. Please try again.</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handlePasswordSubmit}
                    disabled={passwordManagerLoading || !passwordInput.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    data-testid="button-admin-login"
                  >
                    {passwordManagerLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Settings className="h-4 w-4" />
                        <span>Access Admin Panel</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-8 text-center">
                  <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Home</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main admin dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPasswordChange(true)}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                data-testid="button-change-password"
              >
                <Lock className="h-4 w-4" />
                <span>Change Password</span>
              </button>
              <button
                onClick={() => fetchReports()}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPasswordInput('');
                  setPasswordError(false);
                  setReports([]);
                  setFilteredReports([]);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                data-testid="button-admin-logout"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Time Period:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as typeof selectedPeriod)}
              className="ml-2 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="stat-total-reports">
                  {stats.totalReports}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-700" data-testid="stat-total-income">
                  ₹{stats.totalIncome.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-700" data-testid="stat-total-expenses">
                  ₹{stats.totalExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stats.netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <BarChart3 className={`h-6 w-6 ${
                    stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p className={`text-2xl font-bold ${
                  stats.netProfit >= 0 ? 'text-green-700' : 'text-red-700'
                }`} data-testid="stat-net-profit">
                  ₹{stats.netProfit.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Reports</h3>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
              {showAdvancedFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search reports..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={usernameFilter}
                onChange={(e) => setUsernameFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Filter by username..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Income
                </label>
                <input
                  type="number"
                  value={minIncome}
                  onChange={(e) => setMinIncome(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Min income..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Income
                </label>
                <input
                  type="number"
                  value={maxIncome}
                  onChange={(e) => setMaxIncome(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Max income..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sort Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="income">Income</option>
                <option value="expenses">Expenses</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                <span>{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
                {sortOrder === "asc" ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredReports.length} of {reports.length} reports
            </div>
          </div>
        </div>

        {/* Export and Print Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Export & Print Options</h3>
            <div className="text-sm text-gray-600">
              {filteredReports.length} report(s) available
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => exportToCSV()}
              className="flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-sm"
              data-testid="button-export-csv"
            >
              <Download className="h-5 w-5" />
              <div>
                <div className="font-semibold">Export All CSV</div>
                <div className="text-sm opacity-90">Download filtered reports</div>
              </div>
            </button>

            <button
              onClick={() => {
                if (filteredReports.length === 0) {
                  alert("No reports to print");
                  return;
                }
                // Create a summary print of all reports
                const printContent = filteredReports.map(report => `
                  Report ID: ${report.id}
                  Date: ${new Date(report.timestamp).toLocaleDateString()}
                  Username: ${report.username || 'N/A'}
                  Income: ₹${(report.totals?.income || 0).toFixed(2)}
                  Expenses: ₹${(report.totals?.expences || 0).toFixed(2)}
                  Net: ₹${((report.totals?.income || 0) - (report.totals?.expences || 0)).toFixed(2)}
                `).join('\n\n');

                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  printWindow.document.write(`
                    <html>
                      <head><title>Reports Summary</title></head>
                      <body style="font-family: monospace; padding: 20px;">
                        <h1>Jansevakendra - Reports Summary</h1>
                        <p>Generated: ${new Date().toLocaleString()}</p>
                        <pre>${printContent}</pre>
                        <script>window.print(); window.onafterprint = () => window.close();</script>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                }
              }}
              className="flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-sm"
              data-testid="button-print-summary"
            >
              <Printer className="h-5 w-5" />
              <div>
                <div className="font-semibold">Print Summary</div>
                <div className="text-sm opacity-90">Print all filtered reports</div>
              </div>
            </button>

            <button
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                const todayReports = filteredReports.filter(report => 
                  new Date(report.timestamp).toISOString().split('T')[0] === today
                );

                if (todayReports.length === 0) {
                  alert("No reports found for today");
                  return;
                }

                exportToCSV(todayReports);
              }}
              className="flex items-center justify-center space-x-3 bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-sm"
              data-testid="button-export-today"
            >
              <Calendar className="h-5 w-5" />
              <div>
                <div className="font-semibold">Today's CSV</div>
                <div className="text-sm opacity-90">Export today's reports</div>
              </div>
            </button>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Reports Management</h2>
                <p className="text-sm text-gray-600">Manage and edit reports from the system</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Quick Actions:</span>
                <button
                  onClick={() => exportToCSV()}
                  className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                  title="Export CSV"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => fetchReports()}
                  className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Refresh Data"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Income
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                      <p className="text-gray-500">Loading reports...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <AlertCircle className="h-6 w-6 mx-auto mb-2 text-red-600" />
                      <p className="text-red-600">{error}</p>
                    </td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No reports found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report: any, index: number) => {
                    const netAmount = (report.totals?.income || 0) - (report.totals?.expences || 0);
                    return (
                      <tr key={report.id} data-testid={`row-report-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(report.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.username || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-medium">
                          ₹{(report.totals?.income || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700 font-medium">
                          ₹{(report.totals?.expences || 0).toFixed(2)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          netAmount >= 0 ? 'text-green-700' : 'text-red-700'
                        }`}>
                          ₹{netAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedReport(report);
                                setEditMode(true);
                                setShowModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded"
                              title="Edit Report"
                              data-testid={`button-edit-report-${index}`}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedReport(report);
                                setEditMode(false);
                                setShowModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 transition-colors p-1 rounded"
                              title="View Report"
                              data-testid={`button-view-report-${index}`}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => printReport(report)}
                              className="text-purple-600 hover:text-purple-900 transition-colors p-1 rounded"
                              title="Print Report"
                              data-testid={`button-print-report-${index}`}
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => exportToCSV([report])}
                              className="text-green-600 hover:text-green-900 transition-colors p-1 rounded"
                              title="Export as CSV"
                              data-testid={`button-csv-report-${index}`}
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteReport(report.id)}
                              className="text-red-600 hover:text-red-900 transition-colors p-1 rounded"
                              title="Delete Report"
                              data-testid={`button-delete-report-${index}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/reports/view" 
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl text-center transition-all transform hover:scale-[1.02] shadow-sm"
            data-testid="link-view-reports"
          >
            <Eye className="h-8 w-8 mx-auto mb-2" />
            <div className="text-lg font-semibold">View Reports</div>
            <div className="text-sm opacity-90">Access report dashboard</div>
          </Link>

          <Link 
            href="/debug" 
            className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl text-center transition-all transform hover:scale-[1.02] shadow-sm"
            data-testid="link-debug-tools"
          >
            <Activity className="h-8 w-8 mx-auto mb-2" />
            <div className="text-lg font-semibold">Debug Tools</div>
            <div className="text-sm opacity-90">System diagnostics</div>
          </Link>

          <div className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl text-center transition-all transform hover:scale-[1.02] cursor-pointer shadow-sm">
            <Settings className="h-8 w-8 mx-auto mb-2" />
            <div className="text-lg font-semibold">Settings</div>
            <div className="text-sm opacity-90">System configuration</div>
          </div>

          <div className="bg-orange-600 hover:bg-orange-700 text-white p-6 rounded-xl text-center transition-all transform hover:scale-[1.02] cursor-pointer shadow-sm">
            <BarChart3 className="h-8 w-8 mx-auto mb-2" />
            <div className="text-lg font-semibold">Analytics</div>
            <div className="text-sm opacity-90">Usage statistics</div>
          </div>
        </div>
      </div>

      {/* Modal for Edit/View Report */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl max-h-[90vh] w-full overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editMode ? 'Edit Report' : 'View Report'} - {selectedReport.id.slice(0, 8)}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedReport(null);
                  setEditMode(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {editMode ? (
                <EditReportForm
                  report={selectedReport}
                  onSave={updateReport}
                  onCancel={() => {
                    setShowModal(false);
                    setSelectedReport(null);
                    setEditMode(false);
                  }}
                />
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Report Information</h4>
                      <p><strong>Report ID:</strong> {selectedReport.id}</p>
                      <p><strong>Username:</strong> {selectedReport.username || 'Unknown'}</p>
                      <p><strong>Date:</strong> {formatDate(selectedReport.timestamp)}</p>
                      {selectedReport.lastModified && (
                        <p><strong>Last Modified:</strong> {formatDate(selectedReport.lastModified)}</p>
                      )}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Financial Summary</h4>
                      <div className="space-y-1 text-sm">
                        <p className="flex justify-between">
                          <span>Income:</span>
                          <span className="font-semibold text-green-700">₹{(selectedReport.totals?.income || 0).toFixed(2)}</span>
                        </p>
                        <p className="flex justify-between">
                          <span>Expenses:</span>
                          <span className="font-semibold text-red-700">₹{(selectedReport.totals?.expences || 0).toFixed(2)}</span>
                        </p>
                        <div className="border-t pt-1 mt-1">
                          <p className="flex justify-between font-semibold">
                            <span>Net Amount:</span>
                            <span className={
                              ((selectedReport.totals?.income || 0) - (selectedReport.totals?.expences || 0)) >= 0 
                                ? 'text-green-700' 
                                : 'text-red-700'
                            }>
                              ₹{((selectedReport.totals?.income || 0) - (selectedReport.totals?.expences || 0)).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedReport.auditLog && selectedReport.auditLog.length > 0 && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">Audit Trail</h4>
                      <div className="space-y-2 text-sm">
                        {selectedReport.auditLog.map((log, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Clock className="h-3 w-3 text-yellow-600" />
                            <span className="text-yellow-800">
                              {formatDate(log.timestamp)} - {log.action} by {log.user}: {log.changes}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Report</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setSelectedReport(null);
                        setEditMode(false);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Change Admin Password</h3>
              <button
                onClick={() => {
                  setShowPasswordChange(false);
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter new password"
                  disabled={passwordChangeLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Confirm new password"
                  disabled={passwordChangeLoading}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowPasswordChange(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  disabled={passwordChangeLoading}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={passwordChangeLoading || !newPassword || !confirmPassword}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 flex items-center space-x-2"
                >
                  {passwordChangeLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Change Password</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;

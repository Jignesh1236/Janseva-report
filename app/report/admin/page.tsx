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
  Loader2
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
    const updatedReport = { ...editedReport };
    updatedReport.timestamp = dateString;
    setEditedReport(updatedReport);
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
    if (validateReport()) {
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

      onSave(finalReport);
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
              value={new Date(editedReport.timestamp).toISOString().slice(0, 16)}
              onChange={(e) => updateReportDate(new Date(e.target.value).toISOString())}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              Current: {new Date(editedReport.timestamp).toLocaleString()}
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
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Initially not authenticated
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordManagerLoading, setPasswordManagerLoading] = useState(false); // Renamed from 'loading' to avoid conflict
  const [showPasswordManager, setShowPasswordManager] = useState(false);
  const [passwordSettings, setPasswordSettings] = useState({
    reportPassword: '',
    adminPassword: '',
    newReportPassword: '',
    newAdminPassword: ''
  });
  const [passwordUpdateStatus, setPasswordUpdateStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

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

    setPasswordManagerLoading(true); // Use the specific loading state for password submission
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

      if (result.success && result.role === 'admin') {
        setIsAuthenticated(true);
        setPasswordInput('');
      } else {
        setPasswordError(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setPasswordError(true);
    } finally {
      setPasswordManagerLoading(false); // Reset the loading state
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports", {
        headers: {
          'Authorization': 'Bearer admin123', // Default admin password - consider a more secure method
          'X-Page': 'admin',
          'X-Username': 'admin'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        // Handle cases where fetching might fail due to auth or other issues
        if (response.status === 401 || response.status === 403) {
          setIsAuthenticated(false); // Force re-authentication
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

  const deleteReport = async (reportId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this report? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "DELETE",
        headers: {
          'Authorization': 'Bearer admin123', // Ensure auth token is used
          'X-Page': 'admin',
          'X-Username': 'admin'
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

  const exportReportAsJSON = (report: Report) => {
    try {
      const dataStr = JSON.stringify(report, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `report-${report.id.slice(0, 8)}-${new Date(report.timestamp).toISOString().split("T")[0]}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
    } catch (error) {
      console.error("Error exporting JSON:", error);
      alert("Error exporting report as JSON");
    }
  };

  const exportReportAsCSV = (report: Report) => {
    try {
      const csvData = [
        ["Section", "Item", "Amount", "Remark"],
        // Income Section
        ...(report.income || []).map((item) => [
          "Income",
          item.name || "",
          item.amount || 0,
          item.remark || "",
        ]),
        // Deposit Section
        ...(report.deposit || []).map((item) => [
          "Deposit",
          item.name || "",
          item.amount || 0,
          item.remark || "",
        ]),
        // Stamp Section
        ...(report.stamp || []).map((item) => [
          "Stamp",
          item.name || "",
          item.amount || 0,
          item.remark || "",
        ]),
        // Balance Section
        ...(report.balance || []).map((item) => [
          "Balance",
          item.name || "",
          item.amount || 0,
          item.remark || "",
        ]),
        // MGVCL Section
        ...(report.mgvcl || []).map((item) => [
          "MGVCL",
          item.name || "",
          item.amount || 0,
          item.remark || "",
        ]),
        // Expenses Section
        ...(report.expences || []).map((item) => [
          "Expenses",
          item.name || "",
          item.amount || 0,
          item.remark || "",
        ]),
        // Online Payment Section
        ...(report.onlinePayment || []).map((item) => [
          "Online Payment",
          item.name || "",
          item.amount || 0,
          item.remark || "",
        ]),
        // Totals
        ["", "", "", ""],
        ["TOTALS", "", "", ""],
        ["Total Income", "", report.totals?.income || 0, ""],
        ["Total Deposit", "", report.totals?.deposit || 0, ""],
        ["Total Stamp", "", report.totals?.stamp || 0, ""],
        ["Total Balance", "", report.totals?.balance || 0, ""],
        ["Total MGVCL", "", report.totals?.mgvcl || 0, ""],
        ["Total Expenses", "", report.totals?.expences || 0, ""],
        ["Total Online Payment", "", report.totals?.onlinePayment || 0, ""],
        [
          "Net Amount",
          "",
          (report.totals?.income || 0) - (report.totals?.expences || 0),
          "",
        ],
      ];

      const csvContent = csvData
        .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
        .join("\n");
      const dataUri =
        "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csvContent);

      const exportFileDefaultName = `report-${report.id.slice(0, 8)}-${new Date(report.timestamp).toISOString().split("T")[0]}.csv`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Error exporting report as CSV");
    }
  };

  const exportReportAsPDF = (report: Report) => {
    try {
      // Open the print view in a new window for PDF generation
      const printWindow = window.open(`/reports/view?id=${report.id}&action=print`, "_blank");
      if (!printWindow) {
        alert("Please allow popups to export PDF");
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Error exporting report as PDF");
    }
  };

  const exportAllReportsAsJSON = () => {
    try {
      const dataStr = JSON.stringify(filteredReports, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `all-reports-${new Date().toISOString().split("T")[0]}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
    } catch (error) {
      console.error("Error exporting all reports as JSON:", error);
      alert("Error exporting all reports as JSON");
    }
  };

  const exportAllReportsAsCSV = () => {
    try {
      const csvData = [
        [
          "Report ID",
          "Date",
          "Username",
          "Income",
          "Expenses",
          "Deposit",
          "Stamp",
          "Balance",
          "MGVCL",
          "Online Payment",
          "Net Amount",
        ],
        ...filteredReports.map((report) => [
          report.id.slice(0, 8),
          new Date(report.timestamp).toLocaleDateString(),
          report.username || 'Unknown User',
          report.totals?.income || 0,
          report.totals?.expences || 0,
          report.totals?.deposit || 0,
          report.totals?.stamp || 0,
          report.totals?.balance || 0,
          report.totals?.mgvcl || 0,
          report.totals?.onlinePayment || 0,
          (report.totals?.income || 0) - (report.totals?.expences || 0),
        ]),
      ];

      const csvContent = csvData
        .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
        .join("\n");
      const dataUri =
        "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csvContent);

      const exportFileDefaultName = `all-reports-summary-${new Date().toISOString().split("T")[0]}.csv`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
    } catch (error) {
      console.error("Error exporting all reports as CSV:", error);
      alert("Error exporting all reports as CSV");
    }
  };

  const printReport = (report: Report) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const netAmount = (report.totals?.income || 0) - (report.totals?.expences || 0);
      const reportDate = new Date(report.timestamp).toLocaleDateString('en-IN');
      let cashAmount = 0;
      if (typeof report.cash === 'number') {
        cashAmount = report.cash;
      } else if (typeof report.cash === 'object' && report.cash !== null) {
        cashAmount = (report.cash as { amount: number }).amount || 0;
      }

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

  const openModal = (report: Report, edit: boolean = false) => {
    setSelectedReport(report);
    setEditMode(edit);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setShowModal(false);
    setEditMode(false);
  };

  const handleSaveReport = async (updatedReport: Report) => {
    try {
      const response = await fetch(`/api/reports/${updatedReport.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin123', // Ensure auth token is used
          'X-Page': 'admin',
          'X-Username': 'admin'
        },
        body: JSON.stringify(updatedReport),
      });

      if (response.ok) {
        // Update local state
        setReports(reports.map(r => r.id === updatedReport.id ? updatedReport : r));
        setSelectedReport(updatedReport);
        setEditMode(false);
        alert('Report updated successfully!');
      } else {
        alert('Failed to update report');
      }
    } catch (error) {
      console.error('Error updating report:', error);
      alert('An error occurred while updating the report');
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordSettings(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear status when user starts typing
    if (passwordUpdateStatus.type) {
      setPasswordUpdateStatus({ type: null, message: '' });
    }
  };

  const updatePassword = async (page: string, newPassword: string) => {
    if (!newPassword.trim()) {
      setPasswordUpdateStatus({
        type: 'error',
        message: 'Password cannot be empty'
      });
      return;
    }

    try {
      const response = await fetch('/api/auth', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: newPassword,
          page: page,
          role: page === 'admin' ? 'admin' : 'user'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPasswordUpdateStatus({
          type: 'success',
          message: `${page === 'admin' ? 'Admin' : 'Report'} password updated successfully!`
        });
        // Clear the input field
        setPasswordSettings(prev => ({
          ...prev,
          [page === 'admin' ? 'newAdminPassword' : 'newReportPassword']: ''
        }));
      } else {
        setPasswordUpdateStatus({
          type: 'error',
          message: result.message || 'Failed to update password'
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordUpdateStatus({
        type: 'error',
        message: 'An error occurred while updating the password'
      });
    }
  };

  // Render login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Settings className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Access</h1>
            <p className="text-gray-600">Please enter the admin password to access the dashboard</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false); // Clear error on input change
                }}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  passwordError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter admin password"
              />
              {passwordError && (
                <div className="mt-2 flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">Incorrect password. Please try again.</p>
                </div>
              )}
            </div>

            <button
              onClick={handlePasswordSubmit}
              disabled={passwordManagerLoading || !passwordInput.trim()} // Disable while loading or if input is empty
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {passwordManagerLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
              <span>Access Admin Panel</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <Link href="/report" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center space-x-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Reports</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render loading state if reports are being fetched initially
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Render error state if fetching failed
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-xl font-semibold mb-4">{error}</p>
          <button
            onClick={fetchReports}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  // Render the main AdminPage content
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/report"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Comprehensive reports management and analytics
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>

              {/* Export All Dropdown */}
              <div className="relative group">
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export All</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={exportAllReportsAsJSON}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Export as JSON</span>
                    </button>
                    <button
                      onClick={exportAllReportsAsCSV}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Export as Excel/CSV</span>
                    </button>
                  </div>
                </div>
              </div>

              <Link
                href="/report"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>New Report</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Period Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Analytics Period
            </h2>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">
                {stats.totalReports} reports in period
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            {(["today", "week", "month", "year"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Reports
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalReports}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  This {selectedPeriod}
                </p>
              </div>
              <FileText className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Income (Services Only)
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  ₹{stats.totalIncome.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Avg: ₹{stats.avgDailyIncome.toFixed(2)}/day
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Expenses
                </h3>
                <p className="text-3xl font-bold text-red-600">
                  ₹{stats.totalExpenses.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {(
                    (stats.totalExpenses / Math.max(1, stats.totalIncome)) *
                    100
                  ).toFixed(1)}
                  % of income
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-red-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Net Profit
                </h3>
                <p
                  className={`text-3xl font-bold ${stats.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  ₹{stats.netProfit.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.netProfit >= 0 ? "+" : ""}
                  {(
                    (stats.netProfit / Math.max(1, stats.totalIncome)) *
                    100
                  ).toFixed(1)}
                  % margin
                </p>
              </div>
              <BarChart3 className="h-12 w-12 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Deposit Amount</h4>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{stats.totalDeposit.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-teal-100 rounded-lg">
                <PieChart className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Online Payment</h4>
                <p className="text-2xl font-bold text-teal-600">
                  ₹{stats.totalOnlinePayment.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Report Status</h4>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.periodReports.length > 0 ? "Active" : "No Data"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Password Management Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Password Management</span>
            </h2>
            <button
              onClick={() => setShowPasswordManager(!showPasswordManager)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
            >
              <span>{showPasswordManager ? 'Hide' : 'Manage'} Passwords</span>
              {showPasswordManager ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {showPasswordManager && (
            <div className="space-y-6">
              {passwordUpdateStatus.type && (
                <div
                  className={`p-4 rounded-lg flex items-center space-x-2 ${
                    passwordUpdateStatus.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  {passwordUpdateStatus.type === 'success' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <span>{passwordUpdateStatus.message}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Report Page Password */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-4 flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Report Page Password</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordSettings.newReportPassword}
                        onChange={(e) => handlePasswordChange('newReportPassword', e.target.value)}
                        placeholder="Enter new password for report page"
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => updatePassword('report', passwordSettings.newReportPassword)}
                      disabled={!passwordSettings.newReportPassword.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Update Report Password</span>
                    </button>
                  </div>
                </div>

                {/* Admin Page Password */}
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-4 flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Admin Page Password</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordSettings.newAdminPassword}
                        onChange={(e) => handlePasswordChange('newAdminPassword', e.target.value)}
                        placeholder="Enter new password for admin page"
                        className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => updatePassword('admin', passwordSettings.newAdminPassword)}
                      disabled={!passwordSettings.newAdminPassword.trim()}
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Update Admin Password</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Security Notice</h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      • Choose strong passwords with a mix of letters, numbers, and symbols<br />
                      • Avoid using common words or personal information<br />
                      • Keep your passwords confidential and change them regularly<br />
                      • Password changes take effect immediately for all users
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Advanced Filters & Search
            </h2>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <span>Advanced</span>
              {showAdvancedFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <Users className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Filter by username..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={usernameFilter}
                onChange={(e) => setUsernameFilter(e.target.value)}
              />
            </div>

            <div className="relative">
              <Calendar className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>              
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "date" | "income" | "expenses")
              }
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="income">Sort by Income</option>
              <option value="expenses">Sort by Expenses</option>
            </select>

            <div className="flex space-x-2">
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
              >
                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                <span>{sortOrder === "asc" ? "Asc" : "Desc"}</span>
              </button>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setUsernameFilter("");
                  setDateFilter("");
                  setMinIncome("");
                  setMaxIncome("");
                  setStartDate("");
                  setEndDate("");
                  setReportType("");
                  setSortBy("date");
                  setSortOrder("desc");
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                title="Clear All Filters"
                >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Income Range (₹)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minIncome}
                      onChange={(e) => setMinIncome(e.target.value)}
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxIncome}
                      onChange={(e) => setMaxIncome(e.target.value)}
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Start Date"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="End Date"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type
                  </label>
                  <select 
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="profit">Profitable</option>
                    <option value="loss">Loss Making</option>
                    <option value="high-income">High Income (₹5000)</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Active filters: {[searchTerm, usernameFilter, dateFilter, minIncome, maxIncome, startDate, endDate, reportType].filter(Boolean).length}
                </p>
                <button
                  onClick={() => {
                    setMinIncome("");
                    setMaxIncome("");
                    setStartDate("");
                    setEndDate("");
                    setReportType("");
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear Advanced Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Reports Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Reports Management
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Showing {filteredReports.length} of {reports.length} reports
                </span>
                <button
                  onClick={fetchReports}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-xl mb-2">No reports found</p>
              <p className="text-gray-400 mb-6">
                {reports.length === 0
                  ? "No reports have been created yet"
                  : "Try adjusting your filters"}
              </p>
              <Link
                href="/report"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg"
              >
                <FileText className="h-4 w-4" />
                <span>Create First Report</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Financial Summary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => {
                    const netAmount =
                      (report.totals?.income || 0) -
                      (report.totals?.expences || 0);
                    const profitMargin =
                      (netAmount / Math.max(1, report.totals?.income || 1)) *
                      100;

                    return (
                      <tr
                        key={report.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              #{report.id.slice(0, 8)}...
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(report.timestamp)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {report.username || 'Unknown User'}
                            </div>
                            <div className="text-gray-500 text-xs">
                              User
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-green-600">
                              Income: ₹{(report.totals?.income || 0).toFixed(2)}
                            </div>
                            <div className="text-red-600">
                              Expenses: ₹
                              {(report.totals?.expences || 0).toFixed(2)}
                            </div>
                            <div className="text-gray-500">
                              Online: ₹
                              {(report.totals?.onlinePayment || 0).toFixed(2)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div
                              className={`font-medium ${netAmount >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              NET INCOME: ₹{netAmount.toFixed(2)}
                            </div>
                            <div className="text-gray-500">
                              Margin: {profitMargin.toFixed(1)}%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              netAmount >= 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {netAmount >= 0 ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Profitable
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Loss
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openModal(report, false)}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              title="View Report"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => printReport(report)}
                              className="text-purple-600 hover:text-purple-900 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                              title="Print Report"
                            >
                              <Printer className="h-4 w-4" />
                            </button>

                            {/* Export Dropdown */}
                            <div className="relative group">
                              <button
                                className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors flex items-center"
                                title="Export Report"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="py-1">
                                  <button
                                    onClick={() => exportReportAsJSON(report)}
                                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                  >
                                    JSON
                                  </button>
                                  <button
                                    onClick={() => exportReportAsCSV(report)}
                                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                  >
                                    Excel/CSV
                                  </button>
                                  <button
                                    onClick={() => exportReportAsPDF(report)}
                                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                  >
                                    PDF
                                  </button>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => openModal(report, true)}
                              className="text-yellow-600 hover:text-yellow-900 p-2 rounded-lg hover:bg-yellow-50 transition-colors"
                              title="Edit Report"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteReport(report.id)}
                              className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete Report"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  {editMode ? "Edit Report" : "Report Details"}
                </h3>
                <p className="text-gray-600">ID: {selectedReport.id}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => printReport(selectedReport)}
                  className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg"
                  title="Print Report"
                >
                  <Printer className="h-5 w-5" />
                </button>

                {/* Export Dropdown in Modal */}
                <div className="relative group">
                  <button
                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg flex items-center"
                    title="Export Report"
                  >
                    <Download className="h-5 w-5" />
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => exportReportAsJSON(selectedReport)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <FileText className="h-4 w-4" />
                        <span>JSON</span>
                      </button>
                      <button
                        onClick={() => exportReportAsCSV(selectedReport)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>Excel/CSV</span>
                      </button>
                      <button
                        onClick={() => exportReportAsPDF(selectedReport)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <FileText className="h-4 w-4" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Report Date</p>
                  <p className="font-medium text-lg">
                    {formatDate(selectedReport.timestamp)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Created By</p>
                  <p className="font-medium text-lg">
                    {selectedReport.username || 'Unknown User'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Report Status</p>
                  <p className="font-medium text-lg">
                    {(selectedReport.totals?.income || 0) -
                      (selectedReport.totals?.expences || 0) >=
                    0
                      ? "✅ Profitable"
                      : "❌ Loss Making"}
                  </p>
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 font-medium">
                    Total Income
                  </p>
                  <p className="text-3xl font-bold text-green-700">
                    ₹{(selectedReport.totals?.income || 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-red-600 font-medium">
                    Total Expenses
                  </p>
                  <p className="text-3xl font-bold text-red-700">
                    ₹{(selectedReport.totals?.expences || 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200">
                  <p className="text-sm text-teal-600 font-medium">
                    Online Payment Total
                  </p>
                  <p className="text-3xl font-bold text-teal-700">
                    ₹{(selectedReport.totals?.onlinePayment || 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 font-medium">
                    NET INCOME (Income - Expenses)
                  </p>
                  <p className="text-3xl font-bold text-blue-700">
                    ₹
                    {(
                      (selectedReport.totals?.income || 0) -
                      (selectedReport.totals?.expences || 0)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>

              {editMode ? (
                <EditReportForm 
                  report={selectedReport}
                  onSave={handleSaveReport}
                  onCancel={() => setEditMode(false)}
                />
              ) : (
                <div className="space-y-6">
                  <h4 className="font-semibold text-gray-800 text-xl border-b pb-2">
                    Detailed Breakdown
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="font-medium text-blue-800 mb-2">
                          💰 Deposit Amount
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          ₹{(selectedReport.totals?.deposit || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="font-medium text-purple-800 mb-2">
                          📊 Stamp Revenue
                        </p>
                        <p className="text-2xl font-bold text-purple-600">
                          ₹{(selectedReport.totals?.stamp || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="font-medium text-yellow-800 mb-2">
                          💳 Balance Amount
                        </p>
                        <p className="text-2xl font-bold text-yellow-600">
                          ₹{(selectedReport.totals?.balance || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <p className="font-medium text-indigo-800 mb-2">
                          ⚡ MGVCL Revenue
                        </p>
                        <p className="text-2xl font-bold text-indigo-600">
                          ₹{(selectedReport.totals?.mgvcl || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-teal-50 p-4 rounded-lg">
                        <p className="font-medium text-teal-800 mb-2">
                          💻 Online Payment
                        </p>
                        <p className="text-2xl font-bold text-teal-600">
                          ₹
                          {(selectedReport.totals?.onlinePayment || 0).toFixed(
                            2,
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-800 mb-2">
                          📈 Performance Score
                        </p>
                        <p className="text-2xl font-bold text-gray-600">
                          {Math.max(
                            0,
                            Math.min(
                              100,
                              ((selectedReport.totals?.income || 0) /
                                Math.max(
                                  1,
                                  selectedReport.totals?.expences || 1,
                                )) *
                                20,
                            ),
                          ).toFixed(0)}
                          /100
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
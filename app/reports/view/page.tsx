"use client";

import React, { useState, useEffect } from "react";
import { Eye, Download, Printer, Calendar, FileText, TrendingUp, TrendingDown, DollarSign, User, Lock } from "lucide-react";

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
  cash?: number | { amount: number };
  totals: any;
  timestamp: string;
  prepared_by?: string;
}

const ViewReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isPrintLocked, setIsPrintLocked] = useState(true);

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    if (isAuthenticated && currentUsername) {
      fetchUserReports();
    }
  }, [isAuthenticated, currentUsername]);

  useEffect(() => {
    if (isAuthenticated) {
      filterReports();
    }
  }, [reports, searchTerm, dateFilter]);

  const handleLogin = async () => {
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setLoginError(true);
      return;
    }

    try {
      // Authenticate with backend
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: passwordInput,
          page: 'report' // or 'user' for regular users
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Use the entered username as the current username
        const actualUsername = usernameInput.trim();
        setCurrentUsername(actualUsername);
        setIsAuthenticated(true);
        setLoginError(false);
        setAuthToken(passwordInput); // Store for API calls
        setLoading(true);
        console.log('Login successful, username:', actualUsername);
      } else {
        setLoginError(true);
        console.log('Login failed:', result.message);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUsername("");
    setUsernameInput("");
    setPasswordInput("");
    setAuthToken("");
    setReports([]);
    setFilteredReports([]);
    setError(null);
  };

  const filterReports = () => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter((report) =>
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(report.timestamp).toLocaleDateString().includes(searchTerm)
      );
    }

    if (dateFilter) {
      filtered = filtered.filter((report) => {
        const reportDate = new Date(report.timestamp).toISOString().split('T')[0];
        return reportDate === dateFilter;
      });
    }

    setFilteredReports(filtered);
  };

  const fetchUserReports = async () => {
    try {
      console.log('Fetching reports with:', {
        authToken: authToken ? 'present' : 'missing',
        currentUsername,
        page: 'report'
      });

      const response = await fetch("/api/reports", {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'x-username': currentUsername,
          'x-page': 'report'
        }
      });

      console.log('Reports API response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Reports fetched successfully:', data.length);
        // Data is already filtered by the secure API
        setReports(data);
        setFilteredReports(data);
      } else if (response.status === 401) {
        const errorText = await response.text();
        console.log('401 Authentication error:', errorText);
        setError("Authentication required. Please login again.");
        handleLogout();
      } else {
        const errorText = await response.text();
        console.log('API error response:', response.status, errorText);
        setError("Failed to fetch reports: " + errorText);
      }
    } catch (err) {
      console.error("Fetch reports error:", err);
      setError("Error fetching reports: " + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateNetAmount = (report: Report) => {
    const cashAmount = typeof report.cash === 'number' ? report.cash : (typeof report.cash === 'object' ? (report.cash?.amount || 0) : 0);
    const totalAllIncome = (report.totals?.income || 0) + 
                          (report.totals?.deposit || 0) + 
                          (report.totals?.stamp || 0) + 
                          (report.totals?.balance || 0) + 
                          (report.totals?.mgvcl || 0) + 
                          (report.totals?.onlinePayment || 0) + 
                          cashAmount;
    const totalExpenses = report.totals?.expences || 0;
    return totalAllIncome - totalExpenses;
  };

  const calculateServicesOnlyIncome = (report: Report) => {
    return report.totals?.income || 0;
  };

  const downloadReport = (report: Report) => {
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
        // Summary
        ["", "", "", ""],
        ["Summary", "", "", ""],
        ["Income Total", "", report.totals?.income || 0, ""],
        ["Deposit Total", "", report.totals?.deposit || 0, ""],
        ["Stamp Total", "", report.totals?.stamp || 0, ""],
        ["Balance Total", "", report.totals?.balance || 0, ""],
        ["MGVCL Total", "", report.totals?.mgvcl || 0, ""],
        ["Online Payment Total", "", report.totals?.onlinePayment || 0, ""],
        ["Expenses Total", "", report.totals?.expences || 0, ""],
        ["Net Amount", "", calculateNetAmount(report), ""],
      ];

      const csvContent = csvData
        .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
        .join("\n");
      const dataUri = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csvContent);

      const exportFileDefaultName = `report-${report.id.slice(0, 8)}-${new Date(report.timestamp).toISOString().split('T')[0]}.csv`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Error exporting report as Excel/CSV");
    }
  };

  const printReport = (report: Report) => {
    if (isPrintLocked) {
      // Show temporary report with maintenance message
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const reportDate = new Date(report.timestamp).toLocaleDateString('en-IN');
        
        printWindow.document.write(`
          <html>
            <head>
              <title>JANSEVA-2025 Temporary Report</title>
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                body { 
                  font-family: 'Arial', sans-serif; 
                  margin: 20px; 
                  color: #000; 
                  font-size: 12px;
                  line-height: 1.6;
                  background: white;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                }
                .header { 
                  text-align: center; 
                  margin-bottom: 30px;
                  padding-bottom: 15px;
                  border-bottom: 3px solid #ff9800;
                }
                .header h1 { 
                  font-size: 20px; 
                  margin: 10px 0; 
                  color: #d32f2f;
                }
                .maintenance-box {
                  background-color: #fff3e0;
                  border: 3px solid #ff9800;
                  border-radius: 8px;
                  padding: 20px;
                  margin: 20px 0;
                  text-align: center;
                }
                .maintenance-box h2 {
                  color: #e65100;
                  font-size: 18px;
                  margin-bottom: 10px;
                }
                .maintenance-box p {
                  color: #bf360c;
                  font-size: 14px;
                  font-weight: bold;
                }
                .summary-box {
                  border: 2px solid #2196f3;
                  padding: 15px;
                  margin: 20px 0;
                  border-radius: 5px;
                  background-color: #f5f5f5;
                }
                .summary-box h3 {
                  margin: 0 0 10px 0;
                  font-size: 14px;
                  color: #1976d2;
                  border-bottom: 2px solid #2196f3;
                  padding-bottom: 8px;
                }
                .summary-row {
                  display: flex;
                  justify-content: space-between;
                  margin: 8px 0;
                  padding: 5px 0;
                }
                .summary-row .label {
                  font-weight: bold;
                  color: #333;
                }
                .summary-row .value {
                  text-align: right;
                  color: #2196f3;
                  font-weight: bold;
                }
                .info {
                  margin: 15px 0;
                  padding: 10px;
                  background-color: #e3f2fd;
                  border-left: 4px solid #2196f3;
                  border-radius: 3px;
                }
                .info strong {
                  color: #1976d2;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>JANSEVA-2025 (TEMPORARY REPORT)</h1>
                  <p style="color: #666; margin-top: 5px;">Quick Summary Report</p>
                </div>

                <div class="maintenance-box">
                  <h2>⚠️ UNDER MAINTENANCE</h2>
                  <p>Full Report Printing is Currently Under Maintenance</p>
                  <p style="font-size: 12px; margin-top: 10px;">Please try again later</p>
                </div>

                <div class="info">
                  <strong>Date:</strong> ${reportDate}<br>
                  <strong>User:</strong> ${report.username || 'N/A'}<br>
                  <strong>Report ID:</strong> ${report.id.slice(0, 8)}...
                </div>

                <div class="summary-box">
                  <h3>Quick Financial Summary (Temporary)</h3>
                  <div class="summary-row">
                    <span class="label">Service Income:</span>
                    <span class="value">₹${(report.totals?.income || 0).toFixed(2)}</span>
                  </div>
                  <div class="summary-row">
                    <span class="label">Deposit Amount:</span>
                    <span class="value">₹${(report.totals?.deposit || 0).toFixed(2)}</span>
                  </div>
                  <div class="summary-row">
                    <span class="label">Stamp Amount:</span>
                    <span class="value">₹${(report.totals?.stamp || 0).toFixed(2)}</span>
                  </div>
                  <div class="summary-row">
                    <span class="label">Balance:</span>
                    <span class="value">₹${(report.totals?.balance || 0).toFixed(2)}</span>
                  </div>
                  <div class="summary-row">
                    <span class="label">MGVCL:</span>
                    <span class="value">₹${(report.totals?.mgvcl || 0).toFixed(2)}</span>
                  </div>
                  <div class="summary-row">
                    <span class="label">Online Payment:</span>
                    <span class="value">₹${(report.totals?.onlinePayment || 0).toFixed(2)}</span>
                  </div>
                  <div class="summary-row" style="border-top: 2px solid #999; margin-top: 10px; padding-top: 10px;">
                    <span class="label">Total Expenses:</span>
                    <span class="value">₹${(report.totals?.expences || 0).toFixed(2)}</span>
                  </div>
                  <div class="summary-row">
                    <span class="label" style="color: #2e7d32; font-size: 14px;">NET INCOME:</span>
                    <span class="value" style="color: #2e7d32; font-size: 14px;">₹${((report.totals?.income || 0) - (report.totals?.expences || 0)).toFixed(2)}</span>
                  </div>
                </div>

                <div class="info" style="background-color: #fce4ec; border-left-color: #c2185b;">
                  <strong style="color: #c2185b;">Notice:</strong> This is a temporary quick summary report. Complete detailed report printing is under maintenance. We will restore this feature soon.
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        
        setTimeout(() => {
          printWindow.print();
        }, 500);
      } else {
        alert('Please allow pop-ups to print the report');
      }
      return;
    }

    // Original full report printing (when not locked)
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const netAmount = calculateNetAmount(report);
      const reportDate = new Date(report.timestamp).toLocaleDateString('en-IN');
      const cashAmount = typeof report.cash === 'number' ? report.cash : (typeof report.cash === 'object' ? (report.cash?.amount || 0) : 0);

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
                <div>${report.prepared_by || report.username || 'N/A'}</div>
                <div style="font-size: 9px; margin-top: 5px;">${new Date(report.timestamp).toLocaleString()}</div>
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

  const openModal = (report: Report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setShowModal(false);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
        minHeight: '100vh'
      }}>
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">User Login</h1>
            <p className="text-gray-600">Enter your username to view your reports</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your username"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    loginError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    setLoginError(false);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {loginError && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid username and password</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    loginError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setLoginError(false);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Lock className="h-5 w-5" />
              <span>Login</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
        minHeight: '100vh'
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
        minHeight: '100vh'
      }}>
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-xl font-semibold">{error}</p>
          <button
            onClick={fetchUserReports}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                My Reports Dashboard
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Welcome back, <span className="font-semibold text-blue-600 px-2 py-1 bg-blue-50 rounded-md">{currentUsername}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <a
                href="/report"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FileText className="h-5 w-5" />
                <span>Create New Report</span>
              </a>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="border-t border-gray-200/50 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="🔍 Search reports..."
                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white group-hover:shadow-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative group">
                <input
                  type="date"
                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white group-hover:shadow-md"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setDateFilter("");
                }}
                className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
              >
                🗑️ Clear Filters
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600 bg-gray-100/50 px-3 py-1 rounded-full">
                Showing <span className="font-semibold text-blue-600">{filteredReports.length}</span> of <span className="font-semibold">{reports.length}</span> reports
              </div>
            </div>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-800 bg-clip-text text-transparent mb-3">
              {reports.length === 0 ? "No Reports Found" : "No Matching Reports"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              {reports.length === 0 
                ? "Get started by creating your first financial report to track your business income and expenses"
                : "Try adjusting your search filters or date range to find more reports"}
            </p>
            {reports.length === 0 ? (
              <a
                href="/report"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FileText className="h-5 w-5" />
                <span>Create Your First Report</span>
              </a>
            ) : (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setDateFilter("");
                }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>Clear All Filters</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReports.map((report) => {
              const netAmount = calculateNetAmount(report);
              const netIncome = (report.totals?.income || 0) - (report.totals?.expences || 0);
              return (
                <div
                  key={report.id}
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/20 hover:border-blue-200/50 transform hover:-translate-y-1"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
                    <div className="relative z-10 flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2 flex items-center">
                          <FileText className="h-5 w-5 mr-2 opacity-80" />
                          #{report.id.slice(0, 8)}...
                        </h3>
                        <div className="flex items-center text-blue-100/90 text-sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(report.timestamp)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-blue-200/80 uppercase tracking-wide mb-1">NET INCOME</div>
                        <div className={`text-xl font-bold flex items-center ${netIncome >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                          {netIncome >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          ₹{netIncome.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Service Income</div>
                            <div className="text-lg font-bold text-green-800 truncate">
                              ₹{calculateServicesOnlyIncome(report).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl border border-red-100 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-red-700 font-semibold uppercase tracking-wide mb-1">Total Expenses</div>
                            <div className="text-lg font-bold text-red-800 truncate">
                              ₹{(report.totals?.expences || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => openModal(report)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">View</span>
                      </button>

                      <button
                        onClick={() => downloadReport(report)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Download</span>
                      </button>

                      <button
                        onClick={() => printReport(report)}
                        disabled={isPrintLocked}
                        className={`font-semibold py-3 px-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1 text-sm ${
                          isPrintLocked 
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-70' 
                            : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                        title={isPrintLocked ? 'Print is temporarily locked - Full report under maintenance' : 'Print Report'}
                      >
                        <Printer className="h-4 w-4" />
                        <span className="hidden sm:inline">Print</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal for viewing detailed report */}
        {showModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
                <h3 className="text-2xl font-semibold">
                  Detailed Report #{selectedReport.id.slice(0, 8)}...
                </h3>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Report ID</p>
                    <p className="font-medium text-lg">{selectedReport.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created Date</p>
                    <p className="font-medium text-lg">{formatDate(selectedReport.timestamp)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created By</p>
                    <p className="font-medium text-lg">{selectedReport.username || 'Unknown User'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">INCOME (Services Only)</h4>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{(selectedReport.totals?.income || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Deposit</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{(selectedReport.totals?.deposit || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2">Stamp</h4>
                    <p className="text-2xl font-bold text-purple-600">
                      ₹{(selectedReport.totals?.stamp || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">Balance</h4>
                    <p className="text-2xl font-bold text-yellow-600">
                      ₹{(selectedReport.totals?.balance || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <h4 className="font-semibold text-indigo-800 mb-2">MGVCL</h4>
                    <p className="text-2xl font-bold text-indigo-600">
                      ₹{(selectedReport.totals?.mgvcl || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <h4 className="font-semibold text-teal-800 mb-2">Online Payment</h4>
                    <p className="text-2xl font-bold text-teal-600">
                      ₹{(selectedReport.totals?.onlinePayment || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">Total Expenses</h4>
                    <p className="text-2xl font-bold text-red-600">
                      ₹{(selectedReport.totals?.expences || 0).toFixed(2)}
                    </p>
                    <div className="mt-2 text-xs text-red-700">
                      {selectedReport.expences?.filter(item => item.amount > 0).length || 0} expense items
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">NET INCOME (Income - Expenses)</h4>
                    <p className={`text-4xl font-bold ${((selectedReport.totals?.income || 0) - (selectedReport.totals?.expences || 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{((selectedReport.totals?.income || 0) - (selectedReport.totals?.expences || 0)).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    onClick={() => downloadReport(selectedReport)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download Report</span>
                  </button>

                  <button
                    onClick={() => printReport(selectedReport)}
                    disabled={isPrintLocked}
                    className={`font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                      isPrintLocked 
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-70' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                    title={isPrintLocked ? 'Print is temporarily locked - Full report under maintenance' : 'Print Report'}
                  >
                    <Printer className="h-5 w-5" />
                    <span>{isPrintLocked ? 'Print (Under Maintenance)' : 'Print Report'}</span>
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

export default ViewReportsPage;

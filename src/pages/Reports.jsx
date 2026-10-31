import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Download,
  DollarSign,
  Repeat,
  CreditCard
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const Reports = () => {
  const { subscriptions, invoices, payments, products, plans, showToast } = useApp();

  const [dateRange, setDateRange] = useState('all');
  const [reportType, setReportType] = useState('revenue');

  // Aggregation 1: Revenue by Product
  const productRevenue = products.map(prod => {
    const matchingSubs = subscriptions.filter(s => s.productId === prod.id && s.status === 'active');
    const totalRev = matchingSubs.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    return {
      name: prod.name.length > 20 ? prod.name.substring(0, 18) + '...' : prod.name,
      fullName: prod.name,
      revenue: totalRev,
      activeSubs: matchingSubs.length
    };
  });

  // Aggregation 2: Revenue by Plan
  const planDistribution = plans.map(plan => {
    const matchingSubs = subscriptions.filter(s => s.planId === plan.id);
    return {
      name: plan.name,
      cycle: plan.billingCycle,
      count: matchingSubs.length,
      revenue: matchingSubs.reduce((sum, s) => sum + (s.totalAmount || 0), 0)
    };
  });

  // Aggregation 3: Payment by Method
  const methodStats = payments.reduce((acc, p) => {
    acc[p.method] = (acc[p.method] || 0) + (Number(p.amount) || 0);
    return acc;
  }, {});

  const paymentMethodData = Object.keys(methodStats).map((method, idx) => {
    const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'];
    return {
      name: method,
      value: Math.round(methodStats[method]),
      color: colors[idx % colors.length]
    };
  });

  // Export report to CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Type,Item Name,Revenue,Active Count\n";

    productRevenue.forEach(p => {
      csvContent += `"Product","${p.fullName}",${p.revenue},${p.activeSubs}\n`;
    });

    planDistribution.forEach(pl => {
      csvContent += `"Plan","${pl.name}",${pl.revenue},${pl.count}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `brightloop_financial_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Financial analytics report exported to CSV successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Financial & Growth Reports</h2>
          <p className="text-xs text-slate-500">
            Comprehensive business intelligence, recurring revenue recognition, and payment channel analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white shadow-2xs"
          >
            <option value="all">All-Time History</option>
            <option value="ytd">Year-to-Date (2026)</option>
            <option value="quarter">Last Quarter</option>
            <option value="month">Current Month</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Module Navigation Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 w-fit">
        <button
          onClick={() => setReportType('revenue')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            reportType === 'revenue' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Product Revenue</span>
        </button>

        <button
          onClick={() => setReportType('subscription')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            reportType === 'subscription' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Plan Breakdown</span>
        </button>

        <button
          onClick={() => setReportType('payment')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            reportType === 'payment' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payment Channels</span>
        </button>
      </div>

      {/* Main Report View Based on Selected Tab */}
      {reportType === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs lg:col-span-2 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Contract Revenue by Product SKU</h3>
            <p className="text-xs text-slate-400 mb-6">Aggregated from active subscriptions</p>

            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} angle={-15} textAnchor="end" />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Contract Value']}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Active Value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between min-w-0">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Top Revenue Generators</h3>
              <p className="text-xs text-slate-400 mb-4">Ranked by recognized contract yield</p>

              <div className="space-y-3">
                {productRevenue
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 truncate">{item.fullName}</p>
                        <p className="text-[10px] text-slate-400">{item.activeSubs} active contracts</p>
                      </div>
                      <span className="font-mono font-bold text-xs text-indigo-600 whitespace-nowrap">
                        ${item.revenue.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === 'subscription' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs min-w-0">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Subscriptions per Plan Tier</h3>
            <p className="text-xs text-slate-400 mb-6">Contract volume across intervals</p>

            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={planDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} name="Subscribers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs min-w-0">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Plan Revenue Yield</h3>
            <p className="text-xs text-slate-400 mb-6">Total contract monetary value per tier</p>

            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={planDistribution} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Total Value']}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {reportType === 'payment' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs min-w-0">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Payment Method Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Volume processed per settlement channel</p>

            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [`$${Number(val).toLocaleString()}`, name]}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {paymentMethodData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium">{item.name}:</span>
                  <span className="font-mono font-bold text-slate-900">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between min-w-0">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Reconciliation Summary</h3>
              <p className="text-xs text-slate-400 mb-4">Audit stats on transaction velocity</p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Total Invoices Issued</span>
                    <span className="text-lg font-bold text-slate-900">{invoices.length} invoices</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    ${invoices.reduce((s, i) => s + (Number(i.totalAmount) || 0), 0).toLocaleString()}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-emerald-800 font-medium block">Collected Receipts</span>
                    <span className="text-lg font-bold text-emerald-900">{payments.length} transactions</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    ${payments.reduce((s, p) => s + (Number(p.amount) || 0), 0).toLocaleString()}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-amber-800 font-medium block">Uncollected Balance</span>
                    <span className="text-lg font-bold text-amber-900">
                      {invoices.filter(i => i.status !== 'paid').length} open
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-700">
                    ${invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + (Number(i.totalAmount) || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

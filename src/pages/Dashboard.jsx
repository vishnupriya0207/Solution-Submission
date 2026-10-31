import React from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import {
  DollarSign,
  Repeat,
  Users,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  FileText,
  Plus
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const Dashboard = ({ onOpenNewSub, onOpenNewInvoice, onSelectInvoice }) => {
  const { dashboardMetrics, subscriptions, invoices, payments, user, setActiveTab } = useApp();

  const isCustomer = user?.role === 'customer';

  // If customer is viewing, tailor stats specifically to their account
  const customerInvoices = invoices.filter(i => i.customerId === user?.customerId);
  const customerSubs = subscriptions.filter(s => s.customerId === user?.customerId);

  const customerTotalPaid = customerInvoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + (Number(i.totalAmount) || 0), 0);

  const customerPending = customerInvoices
    .filter(i => i.status === 'confirmed' || i.status === 'overdue')
    .reduce((sum, i) => sum + (Number(i.totalAmount) || 0), 0);

  const customerActiveSubs = customerSubs.filter(s => s.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-lg shadow-indigo-950/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md">
              Brightloop Cloud OS
            </span>
            <span className="text-xs text-indigo-300">Live Production Mode</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Welcome back, {user?.name}
          </h2>
          <p className="text-sm text-indigo-200 mt-1 max-w-xl">
            {isCustomer
              ? `Manage your active enterprise subscriptions, view invoices, and track billing cycles.`
              : `Real-time subscription billing metrics, churn analytics, and multi-tier revenue projections.`}
          </p>
        </div>

        {!isCustomer && (
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewSub}
              className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/30 flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Subscription</span>
            </button>
            <button
              onClick={onOpenNewInvoice}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Invoice</span>
            </button>
          </div>
        )}
      </div>

      {/* Overdue Alert banner if overdue invoices exist */}
      {dashboardMetrics.overdueInvoicesCount > 0 && !isCustomer && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-900 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">
                Action Required: {dashboardMetrics.overdueInvoicesCount} Overdue Invoice
                {dashboardMetrics.overdueInvoicesCount > 1 ? 's' : ''} ($
                {dashboardMetrics.overdueInvoicesAmount.toLocaleString()})
              </p>
              <p className="text-[11px] text-amber-700">
                Payment collection past due date. Follow up with affected enterprise accounts.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('invoices')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap shadow-xs"
          >
            Review Overdue
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isCustomer ? 'Total Paid' : 'Total Revenue'}
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              ${isCustomer ? customerTotalPaid.toLocaleString() : dashboardMetrics.totalRevenue.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs last period</span>
          </div>
        </div>

        {/* Card 2: Active Subscriptions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Plans
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {isCustomer ? customerActiveSubs : dashboardMetrics.activeSubscriptionsCount}
            </span>
            <span className="text-xs text-slate-400">contracts</span>
          </div>
          <div className="mt-2 text-xs text-indigo-600 font-medium">
            MRR: ${dashboardMetrics.mrr.toLocaleString()}/mo
          </div>
        </div>

        {/* Card 3: Total Customers / Accounts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isCustomer ? 'Account Status' : 'Total Customers'}
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {isCustomer ? 'Verified' : dashboardMetrics.totalCustomersCount}
            </span>
            {!isCustomer && <span className="text-xs text-slate-400">clients</span>}
          </div>
          <div className="mt-2 text-xs text-blue-600 font-medium">
            {isCustomer ? 'Enterprise SLA 99.99%' : '100% renewal retention'}
          </div>
        </div>

        {/* Card 4: Pending Payments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Invoices
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              ${isCustomer ? customerPending.toLocaleString() : dashboardMetrics.pendingPaymentsAmount.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-xs text-amber-600 font-medium">
            {dashboardMetrics.pendingInvoicesCount} invoices waiting
          </div>
        </div>

        {/* Card 5: Overdue Invoices */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overdue
            </span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono tracking-tight ${dashboardMetrics.overdueInvoicesCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {dashboardMetrics.overdueInvoicesCount}
            </span>
            <span className="text-xs text-slate-400">overdue</span>
          </div>
          <div className="mt-2 text-xs text-rose-600 font-medium font-mono">
            ${dashboardMetrics.overdueInvoicesAmount.toLocaleString()} past due
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Revenue Trend Chart (Area) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs lg:col-span-2 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Revenue & Billing Velocity</h3>
              <p className="text-xs text-slate-400">Monthly recognized revenue vs invoiced receivables</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <span className="text-slate-600 font-medium">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span className="text-slate-600 font-medium">Invoiced</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardMetrics.revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#revGrad)" name="Revenue Collected" />
                <Area type="monotone" dataKey="invoiced" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" fill="transparent" name="Total Invoiced" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Subscription Status Distribution (Pie / Donut) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between min-w-0">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Subscription Status Breakdown</h3>
            <p className="text-xs text-slate-400">Distribution across contract life-cycles</p>
          </div>

          <div className="h-52 w-full my-2 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardMetrics.subscriptionStatusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {dashboardMetrics.subscriptionStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} subscriptions`, name]}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {dashboardMetrics.subscriptionStatusDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 font-medium">{item.name}:</span>
                <span className="font-bold text-slate-900 ml-auto font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Invoices & Payments Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Invoices</h3>
            </div>
            <button
              onClick={() => setActiveTab('invoices')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View all ({invoices.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Invoice</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.slice(0, 5).map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => onSelectInvoice && onSelectInvoice(inv)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-indigo-600">{inv.invoiceNumber}</td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-800 truncate max-w-[150px]">{inv.customerName}</p>
                      <p className="text-[10px] text-slate-400">Due {inv.dueDate}</p>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      ${Number(inv.totalAmount).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge status={inv.status} size="xs" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments Ledger */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Payment Collections</h3>
            </div>
            <button
              onClick={() => setActiveTab('payments')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View all ({payments.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Payment #</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3 text-right">Settled</th>
                  <th className="py-2.5 px-3 text-center">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.slice(0, 5).map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-slate-900">{pay.paymentNumber}</span>
                      <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{pay.customerName}</p>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">{pay.method}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                      +${Number(pay.amount).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-500 font-mono text-[11px]">
                      {pay.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

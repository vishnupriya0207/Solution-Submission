import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';

const getTodayString = () => new Date().toISOString().split('T')[0];

export const Payments = ({ recordPaymentTargetInvoice, setRecordPaymentTargetInvoice }) => {
  const { payments, invoices, recordPayment, user } = useApp();

  const isCustomer = user?.role === 'customer';

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [recordModalOpen, setRecordModalOpen] = useState(false);

  // Form State
  const unpaidInvoices = invoices.filter(i => i.status !== 'paid');

  const [formData, setFormData] = useState({
    invoiceId: recordPaymentTargetInvoice?.id || unpaidInvoices[0]?.id || '',
    amount: recordPaymentTargetInvoice ? recordPaymentTargetInvoice.totalAmount : (unpaidInvoices[0]?.totalAmount || 0),
    method: 'Credit Card',
    date: getTodayString(),
    notes: 'Invoice settlement'
  });

  // Sync when an external target invoice is passed
  useEffect(() => {
    if (recordPaymentTargetInvoice) {
      setFormData({
        invoiceId: recordPaymentTargetInvoice.id,
        amount: recordPaymentTargetInvoice.totalAmount,
        method: 'Credit Card',
        date: getTodayString(),
        notes: `Settlement for ${recordPaymentTargetInvoice.invoiceNumber}`
      });
      setRecordModalOpen(true);
    }
  }, [recordPaymentTargetInvoice]);

  const isModalOpen = recordModalOpen;

  const handleCloseModal = () => {
    setRecordModalOpen(false);
    if (setRecordPaymentTargetInvoice) {
      setRecordPaymentTargetInvoice(null);
    }
  };

  const handleInvoiceSelect = (invId) => {
    const inv = invoices.find(i => i.id === invId);
    setFormData(prev => ({
      ...prev,
      invoiceId: invId,
      amount: inv ? inv.totalAmount : 0
    }));
  };

  const handleRecordSubmit = (e) => {
    e.preventDefault();
    if (!formData.invoiceId) return;

    recordPayment({
      invoiceId: formData.invoiceId,
      amount: parseFloat(formData.amount),
      method: formData.method,
      date: formData.date,
      notes: formData.notes
    });

    handleCloseModal();
  };

  // Payment methods
  const methods = ['Credit Card', 'Bank Transfer', 'Stripe', 'PayPal'];

  // Role filter
  const displayPayments = isCustomer
    ? payments.filter(p => p.customerId === user?.customerId)
    : payments;

  const filteredPayments = displayPayments.filter(p => {
    const matchesSearch =
      p.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionRef?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMethod = methodFilter === 'all' || p.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  // Totals
  const totalPaid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const pendingAmount = invoices.filter(i => i.status === 'confirmed').reduce((sum, i) => sum + (Number(i.totalAmount) || 0), 0);
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + (Number(i.totalAmount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Payments & Collections</h2>
          <p className="text-xs text-slate-500">
            Track settled transactions, reconcile invoices, and monitor collection statuses.
          </p>
        </div>

        {unpaidInvoices.length > 0 && !isCustomer && (
          <button
            onClick={() => {
              if (unpaidInvoices[0]) {
                setFormData({
                  invoiceId: unpaidInvoices[0].id,
                  amount: unpaidInvoices[0].totalAmount,
                  method: 'Credit Card',
                  date: getTodayString(),
                  notes: 'Invoice settlement'
                });
              }
              setRecordModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        )}
      </div>

      {/* KPI Cards: Paid, Pending, Overdue */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Collected</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            ${totalPaid.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            {payments.length} settled payments
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Invoices</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            ${pendingAmount.toLocaleString()}
          </div>
          <div className="text-xs text-amber-600 font-medium mt-1">
            {invoices.filter(i => i.status === 'confirmed').length} pending invoices
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overdue Invoices</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${overdueAmount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            ${overdueAmount.toLocaleString()}
          </div>
          <div className="text-xs text-rose-600 font-medium mt-1">
            {invoices.filter(i => i.status === 'overdue').length} overdue invoices
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search payment #, TXN reference, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Method filter */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setMethodFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              methodFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Methods
          </button>
          {methods.map(m => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                methodFilter === m
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Receipt #</th>
                <th className="py-3.5 px-4">Invoice Linked</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Reference TXN</th>
                <th className="py-3.5 px-4 text-right">Settled Amount</th>
                <th className="py-3.5 px-4 text-center">Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.paymentNumber}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-indigo-600">{p.invoiceNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{p.customerName}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{p.method}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{p.transactionRef}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-600">
                    +${Number(p.amount).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-600 font-mono">{p.date}</td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge status="successful" size="xs" label="Settled" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No payment records found</p>
            <p className="text-xs text-slate-400 mt-1">Record a payment to settle an outstanding invoice.</p>
          </div>
        )}
      </div>

      {/* Modal: Record Payment */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Record Payment Settlement"
        subtitle="Apply funds towards outstanding receivable invoice"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Invoice to Settle *</label>
            <select
              required
              value={formData.invoiceId}
              onChange={(e) => handleInvoiceSelect(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {unpaidInvoices.length === 0 ? (
                <option value="">No unpaid invoices</option>
              ) : (
                unpaidInvoices.map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} — {inv.customerName} (${Number(inv.totalAmount).toLocaleString()}) [{inv.status.toUpperCase()}]
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Settlement Amount ($) *</label>
              <input
                type="number"
                required
                min="0.01"
                step="any"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono font-bold text-emerald-600 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              >
                {methods.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Transaction Reference</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              placeholder="e.g. Wire confirmation ref or last 4 digits of corporate card"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={unpaidInvoices.length === 0}
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
            >
              Confirm & Settle Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { InvoicePrintModal } from '../components/invoices/InvoicePrintModal';
import {
  FileText,
  Plus,
  Search,
  CreditCard,
  Trash2,
  AlertCircle,
  Eye
} from 'lucide-react';

const getDefaultDueDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 15);
  return d.toISOString().split('T')[0];
};

export const Invoices = ({ onRecordPayment, modalOpenProp, setModalOpenProp, targetSub, setTargetSub }) => {
  const {
    invoices,
    subscriptions,
    customers,
    products,
    generateInvoiceFromSubscription,
    deleteInvoice,
    isInvoiceDuplicate,
    changeSubscriptionStatus,
    user
  } = useApp();

  const isCustomer = user?.role === 'customer';

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [printModalInvoice, setPrintModalInvoice] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  // Form State for Invoice Generation
  const initialSub = targetSub || subscriptions[0];

  const [formData, setFormData] = useState(() => ({
    subscriptionId: initialSub?.id || '',
    billingPeriod: initialSub ? `${initialSub.startDate} to ${initialSub.nextBillingDate || getDefaultDueDate()}` : '',
    dueDate: getDefaultDueDate(),
    notes: ''
  }));

  const isGenerateOpen = modalOpenProp !== undefined ? modalOpenProp : createModalOpen;
  const setIsGenerateOpen = setModalOpenProp || setCreateModalOpen;

  const handlePeriodChange = useCallback((subId, period) => {
    setFormData(prev => ({ ...prev, billingPeriod: period, subscriptionId: subId }));
    if (subId && period) {
      const isDup = isInvoiceDuplicate(subId, period);
      if (isDup) {
        setDuplicateWarning(`Invoice for billing period "${period}" already exists for this subscription!`);
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  }, [isInvoiceDuplicate]);

  // React to targetSub prop changes
  useEffect(() => {
    if (targetSub) {
      const period = `${targetSub.startDate} to ${targetSub.nextBillingDate || getDefaultDueDate()}`;
      setFormData({
        subscriptionId: targetSub.id,
        billingPeriod: period,
        dueDate: getDefaultDueDate(),
        notes: ''
      });
      handlePeriodChange(targetSub.id, period);
    }
  }, [targetSub, handlePeriodChange]);

  // Selected subscription info
  const selectedSub = subscriptions.find(s => s.id === formData.subscriptionId) || initialSub;

  const handleCloseGenerateModal = () => {
    setIsGenerateOpen(false);
    if (setTargetSub) setTargetSub(null);
    setDuplicateWarning(null);
  };

  const handleGenerateSubmit = (e) => {
    e.preventDefault();
    if (!formData.subscriptionId) return;

    const period = formData.billingPeriod || `${selectedSub?.startDate} to ${selectedSub?.nextBillingDate || getDefaultDueDate()}`;

    if (isInvoiceDuplicate(formData.subscriptionId, period)) {
      setDuplicateWarning(`An invoice for "${period}" already exists. Cannot generate duplicate.`);
      return;
    }

    const created = generateInvoiceFromSubscription(formData.subscriptionId, period);
    if (created && !created.error) {
      // If subscription was in quotation or draft, confirm it now
      if (selectedSub && (selectedSub.status === 'quotation' || selectedSub.status === 'draft')) {
        changeSubscriptionStatus(selectedSub.id, 'confirmed', 'Confirmed upon invoice generation');
      }

      handleCloseGenerateModal();
      setPrintModalInvoice(created); // open print preview directly!
    }
  };

  // Filter invoices
  const displayInvoices = isCustomer
    ? invoices.filter(i => i.customerId === user?.customerId)
    : invoices;

  const filteredInvoices = displayInvoices.filter(inv => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.billingPeriod?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Billing Invoices</h2>
          <p className="text-xs text-slate-500">
            Generate receivables, enforce duplicate invoice prevention, print official tax invoices, and record payments.
          </p>
        </div>

        {!isCustomer && (
          <button
            onClick={() => {
              if (selectedSub) {
                const defPeriod = `${selectedSub.startDate} to ${selectedSub.nextBillingDate || getDefaultDueDate()}`;
                setFormData({
                  subscriptionId: selectedSub.id,
                  billingPeriod: defPeriod,
                  dueDate: getDefaultDueDate(),
                  notes: ''
                });
                handlePeriodChange(selectedSub.id, defPeriod);
              }
              setIsGenerateOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
        )}
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice #, customer name, period..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'confirmed', 'paid', 'overdue', 'draft'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Billing Period</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4 text-right">Tax (10%)</th>
                <th className="py-3.5 px-4 text-right">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Invoice # */}
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                    <button
                      onClick={() => setPrintModalInvoice(inv)}
                      className="hover:underline flex items-center gap-1"
                    >
                      {inv.invoiceNumber}
                    </button>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{inv.customerName}</p>
                    <p className="text-[11px] text-slate-400">{inv.customerEmail}</p>
                  </td>

                  {/* Billing Period */}
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {inv.billingPeriod}
                  </td>

                  {/* Issue Date */}
                  <td className="py-3.5 px-4 text-slate-600">
                    {inv.issueDate}
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    <span className={inv.status === 'overdue' ? 'text-rose-600 font-bold' : ''}>
                      {inv.dueDate}
                    </span>
                  </td>

                  {/* Tax */}
                  <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                    ${Number(inv.taxAmount).toLocaleString()}
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900">
                    ${Number(inv.totalAmount).toLocaleString()}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center">
                    <Badge status={inv.status} size="xs" />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View & Print Modal Button */}
                      <button
                        onClick={() => setPrintModalInvoice(inv)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View / Print Tax Invoice"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Record payment button if unpaid */}
                      {inv.status !== 'paid' && onRecordPayment && (
                        <button
                          onClick={() => onRecordPayment(inv)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                          title="Record Payment"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Pay</span>
                        </button>
                      )}

                      {/* Admin delete invoice */}
                      {user?.role === 'admin' && inv.status !== 'paid' && (
                        <button
                          onClick={() => deleteInvoice(inv.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete draft invoice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No invoices found</p>
            <p className="text-xs text-slate-400 mt-1">Generate a new invoice or adjust filters.</p>
          </div>
        )}
      </div>

      {/* Modal: Generate Invoice with Duplicate Prevention */}
      <Modal
        isOpen={isGenerateOpen}
        onClose={handleCloseGenerateModal}
        title="Generate Invoice from Subscription"
        subtitle="Automatic tax calculation & duplicate billing period protection"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleGenerateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Active / Confirmed Subscription *
            </label>
            <select
              required
              value={formData.subscriptionId}
              onChange={(e) => {
                const subId = e.target.value;
                const sub = subscriptions.find(s => s.id === subId);
                const period = sub ? `${sub.startDate} to ${sub.nextBillingDate || getDefaultDueDate()}` : '';
                handlePeriodChange(subId, period);
              }}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {subscriptions.map(s => {
                const cust = customers.find(c => c.id === s.customerId);
                const prod = products.find(p => p.id === s.productId);
                return (
                  <option key={s.id} value={s.id}>
                    {s.code} — {cust?.company || cust?.name} ({prod?.name}) - ${(s.totalAmount || 0).toLocaleString()} [{s.status.toUpperCase()}]
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Billing Period (e.g. YYYY-MM-DD to YYYY-MM-DD) *
            </label>
            <input
              type="text"
              required
              placeholder="YYYY-MM-DD to YYYY-MM-DD"
              value={formData.billingPeriod}
              onChange={(e) => handlePeriodChange(formData.subscriptionId, e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              System enforces that no two invoices can exist for the exact same subscription & billing period.
            </span>
          </div>

          {/* Duplicate period warning banner */}
          {duplicateWarning && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{duplicateWarning}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Payment Due Date *
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          {/* Live Preview Summary Card */}
          {selectedSub && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-mono font-semibold">${(selectedSub.unitPrice * (selectedSub.quantity || 1)).toLocaleString()}</span>
              </div>
              {selectedSub.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-mono">-${selectedSub.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Tax (10%)</span>
                <span className="font-mono font-semibold">
                  ${(Math.round((selectedSub.totalAmount * 0.1) * 100) / 100).toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                <span>Estimated Total</span>
                <span className="font-mono text-indigo-600">
                  ${(Math.round((selectedSub.totalAmount * 1.1) * 100) / 100).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseGenerateModal}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!!duplicateWarning}
              className={`px-5 py-2 text-xs font-bold rounded-xl shadow-xs text-white ${
                duplicateWarning
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable Invoice Modal */}
      {printModalInvoice && (
        <InvoicePrintModal
          isOpen={!!printModalInvoice}
          onClose={() => setPrintModalInvoice(null)}
          invoice={printModalInvoice}
          onRecordPayment={onRecordPayment}
        />
      )}
    </div>
  );
};

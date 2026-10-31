import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import {
  Repeat,
  Plus,
  Search,
  Play,
  Pause,
  RotateCw,
  XCircle,
  FileText,
  Clock,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const getTodayString = () => new Date().toISOString().split('T')[0];

export const Subscriptions = ({ onGenerateInvoiceForSub, modalOpenProp, setModalOpenProp }) => {
  const {
    subscriptions,
    customers,
    plans,
    products,
    validateDiscount,
    addSubscription,
    changeSubscriptionStatus,
    generateInvoiceFromSubscription,
    user
  } = useApp();

  const isCustomer = user?.role === 'customer';

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  // Form State for New Subscription
  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || '',
    productId: products[0]?.id || '',
    planId: plans[0]?.id || '',
    quantity: 1,
    discountCode: '',
    status: 'confirmed',
    startDate: getTodayString(),
    renewalSettings: 'auto'
  });

  const [discountFeedback, setDiscountFeedback] = useState(null);

  // Sync external open modal request (from header button)
  const isCreateOpen = modalOpenProp !== undefined ? modalOpenProp : createModalOpen;
  const setIsCreateOpen = setModalOpenProp || setCreateModalOpen;

  // Selected plan and product calculations
  const selectedPlan = plans.find(p => p.id === formData.planId) || plans[0];

  const unitPrice = selectedPlan ? selectedPlan.price : 0;
  const rawSubtotal = unitPrice * (parseInt(formData.quantity, 10) || 1);

  // Handle promo code check
  const handleDiscountCheck = (code) => {
    setFormData(prev => ({ ...prev, discountCode: code }));
    if (!code.trim()) {
      setDiscountFeedback(null);
      return;
    }
    const result = validateDiscount(code, rawSubtotal);
    setDiscountFeedback(result);
  };

  const currentDiscountAmount = discountFeedback?.valid ? discountFeedback.discountAmount : 0;
  const finalTotalAmount = Math.max(0, rawSubtotal - currentDiscountAmount);

  // Create handler
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerId || !formData.productId || !formData.planId) return;

    // Calculate next billing date
    const start = new Date(formData.startDate);
    const nextDate = new Date(start);
    if (selectedPlan?.billingCycle === 'yearly') nextDate.setFullYear(start.getFullYear() + 1);
    else if (selectedPlan?.billingCycle === 'monthly') nextDate.setMonth(start.getMonth() + 1);
    else if (selectedPlan?.billingCycle === 'weekly') nextDate.setDate(start.getDate() + 7);
    else nextDate.setDate(start.getDate() + 1);

    const payload = {
      customerId: formData.customerId,
      productId: formData.productId,
      planId: formData.planId,
      quantity: parseInt(formData.quantity, 10) || 1,
      unitPrice,
      discountCode: discountFeedback?.valid ? formData.discountCode.toUpperCase() : '',
      discountAmount: currentDiscountAmount,
      totalAmount: finalTotalAmount,
      billingCycle: selectedPlan?.billingCycle || 'monthly',
      startDate: formData.startDate,
      nextBillingDate: nextDate.toISOString().split('T')[0],
      renewalSettings: formData.renewalSettings,
      status: formData.status
    };

    addSubscription(payload);
    setIsCreateOpen(false);
    setFormData({
      customerId: customers[0]?.id || '',
      productId: products[0]?.id || '',
      planId: plans[0]?.id || '',
      quantity: 1,
      discountCode: '',
      status: 'confirmed',
      startDate: getTodayString(),
      renewalSettings: 'auto'
    });
    setDiscountFeedback(null);
  };

  // Status transitions
  const handleActivate = (id) => changeSubscriptionStatus(id, 'active', 'Activated by admin');
  const handlePause = (id) => changeSubscriptionStatus(id, 'paused', 'Paused per customer request');
  const handleResume = (id) => changeSubscriptionStatus(id, 'active', 'Resumed after pause');
  const handleRenew = (id) => changeSubscriptionStatus(id, 'active', 'Renewed for next billing cycle');
  const handleCancel = (id) => changeSubscriptionStatus(id, 'closed', 'Contract cancelled');
  const handleConfirm = (id) => changeSubscriptionStatus(id, 'confirmed', 'Quotation approved and confirmed');

  // Generate invoice quick trigger
  const handleGenerateInvoice = (sub) => {
    if (onGenerateInvoiceForSub) {
      onGenerateInvoiceForSub(sub);
    } else {
      generateInvoiceFromSubscription(sub.id);
    }
  };

  // Role filtering
  const displaySubs = isCustomer
    ? subscriptions.filter(s => s.customerId === user?.customerId)
    : subscriptions;

  const filteredSubs = displaySubs.filter(s => {
    const cust = customers.find(c => c.id === s.customerId);
    const prod = products.find(p => p.id === s.productId);
    const matchesSearch =
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Subscriptions Management</h2>
          <p className="text-xs text-slate-500">
            Lifecycle state transitions: Draft ➔ Quotation ➔ Confirmed ➔ Active ➔ Paused ➔ Closed.
          </p>
        </div>

        {!isCustomer && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Subscription</span>
          </button>
        )}
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search code (SUB-), customer, product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'active', 'confirmed', 'quotation', 'draft', 'paused', 'closed'].map(st => (
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

      {/* Main Subscriptions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Contract Code</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Product & Plan</th>
                <th className="py-3.5 px-4">Interval</th>
                <th className="py-3.5 px-4 text-right">Value</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Next Billing</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubs.map((sub) => {
                const customer = customers.find(c => c.id === sub.customerId);
                const product = products.find(p => p.id === sub.productId);
                const plan = plans.find(p => p.id === sub.planId);

                return (
                  <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      <button
                        onClick={() => {
                          setSelectedSub(sub);
                          setDetailModalOpen(true);
                        }}
                        className="hover:underline flex items-center gap-1"
                      >
                        {sub.code}
                      </button>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{customer?.company || customer?.name || 'Unknown'}</p>
                      <p className="text-[11px] text-slate-400">{customer?.name}</p>
                    </td>

                    {/* Product & Plan */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{product?.name || 'Custom Software'}</p>
                      <p className="text-[11px] text-slate-400">
                        {plan?.name || sub.billingCycle} • Qty: {sub.quantity || 1}
                      </p>
                    </td>

                    {/* Billing Interval */}
                    <td className="py-3.5 px-4">
                      <Badge status={sub.billingCycle} size="xs" />
                    </td>

                    {/* Value */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-bold text-slate-900">
                        ${(sub.totalAmount || 0).toLocaleString()}
                      </div>
                      {sub.discountAmount > 0 && (
                        <div className="text-[10px] text-emerald-600 font-medium">
                          Saved ${sub.discountAmount.toLocaleString()}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <Badge status={sub.status} size="xs" />
                    </td>

                    {/* Next Billing Date */}
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {sub.nextBillingDate || sub.startDate}
                    </td>

                    {/* Lifecycle Action Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick View Details */}
                        <button
                          onClick={() => {
                            setSelectedSub(sub);
                            setDetailModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View contract details and audit timeline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {!isCustomer && (
                          <>
                            {/* Draft -> Quotation -> Confirm */}
                            {sub.status === 'draft' && (
                              <button
                                onClick={() => changeSubscriptionStatus(sub.id, 'quotation', 'Sent quotation')}
                                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-[11px] font-semibold"
                                title="Send Quotation"
                              >
                                Quotation
                              </button>
                            )}

                            {sub.status === 'quotation' && (
                              <button
                                onClick={() => handleConfirm(sub.id)}
                                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-semibold"
                                title="Confirm Quotation"
                              >
                                Confirm
                              </button>
                            )}

                            {/* Confirmed -> Activate */}
                            {sub.status === 'confirmed' && (
                              <button
                                onClick={() => handleActivate(sub.id)}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                                title="Activate Plan"
                              >
                                <Play className="w-3 h-3" /> Activate
                              </button>
                            )}

                            {/* Active -> Pause */}
                            {sub.status === 'active' && (
                              <button
                                onClick={() => handlePause(sub.id)}
                                className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                                title="Pause Subscription"
                              >
                                <Pause className="w-3 h-3" /> Pause
                              </button>
                            )}

                            {/* Paused -> Resume */}
                            {sub.status === 'paused' && (
                              <button
                                onClick={() => handleResume(sub.id)}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                                title="Resume Subscription"
                              >
                                <Play className="w-3 h-3" /> Resume
                              </button>
                            )}

                            {/* Renew */}
                            {(sub.status === 'active' || sub.status === 'confirmed') && (
                              <button
                                onClick={() => handleRenew(sub.id)}
                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Renew for next cycle"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Generate Invoice Direct Button */}
                            {(sub.status === 'active' || sub.status === 'confirmed') && (
                              <button
                                onClick={() => handleGenerateInvoice(sub)}
                                className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                                title="Generate Invoice"
                              >
                                <FileText className="w-3 h-3" /> Invoice
                              </button>
                            )}

                            {/* Cancel */}
                            {sub.status !== 'closed' && (
                              <button
                                onClick={() => handleCancel(sub.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Cancel subscription"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredSubs.length === 0 && (
          <div className="text-center py-12">
            <Repeat className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No subscriptions found</p>
            <p className="text-xs text-slate-400 mt-1">Adjust filters or create a new subscription.</p>
          </div>
        )}
      </div>

      {/* Modal: Create Subscription */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Subscription"
        subtitle="Provision recurring license with live discount verification and pricing calculator"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Account *</label>
              <select
                required
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.company ? `${c.company} (${c.name})` : c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Offering *</label>
              <select
                required
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${Number(p.salesPrice).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Plan select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subscription Plan *</label>
              <select
                required
                value={formData.planId}
                onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${Number(p.price).toLocaleString()}/{p.billingCycle})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Units / Seats</label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Initial Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-xs capitalize border border-slate-200 rounded-xl"
              >
                <option value="confirmed">Confirmed (Ready to invoice)</option>
                <option value="active">Active (Immediate provision)</option>
                <option value="draft">Draft (Working draft)</option>
                <option value="quotation">Quotation (Awaiting approval)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>

            {/* Renewal Settings */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Renewal Policy</label>
              <select
                value={formData.renewalSettings}
                onChange={(e) => setFormData({ ...formData, renewalSettings: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              >
                <option value="auto">Auto-Renew at End of Term</option>
                <option value="manual">Manual Renewal Required</option>
              </select>
            </div>
          </div>

          {/* Discount Promo Code Input with Instant Validation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Promotional Discount Code (e.g. LAUNCH20, ENTERPRISE500)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                value={formData.discountCode}
                onChange={(e) => handleDiscountCheck(e.target.value)}
                className="flex-1 px-3 py-2 text-xs uppercase font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {discountFeedback && (
              <div className="mt-2 text-xs">
                {discountFeedback.valid ? (
                  <p className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Promo code verified: -${discountFeedback.discountAmount.toLocaleString()} off
                  </p>
                ) : (
                  <p className="text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {discountFeedback.error}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Live Pricing Breakdown */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex justify-between items-center">
            <div>
              <p className="text-xs text-indigo-950 font-bold">Calculated Contract Value</p>
              <p className="text-[11px] text-slate-500">
                ${unitPrice.toLocaleString()} × {formData.quantity || 1} units
                {currentDiscountAmount > 0 && ` - $${currentDiscountAmount.toLocaleString()} discount`}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-indigo-900 font-mono">
                ${finalTotalAmount.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 block">/{selectedPlan?.billingCycle || 'month'}</span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
            >
              Create Subscription
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: View Subscription Details & History Timeline */}
      {selectedSub && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={`Contract ${selectedSub.code}`}
          subtitle="Audit log and life-cycle events"
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 font-medium">Status</span>
                <div className="mt-0.5"><Badge status={selectedSub.status} size="xs" /></div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Billing Cycle</span>
                <p className="font-bold capitalize text-slate-800 mt-0.5">{selectedSub.billingCycle}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Contract Value</span>
                <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">${(selectedSub.totalAmount || 0).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Next Billing Date</span>
                <p className="font-mono text-slate-800 mt-0.5">{selectedSub.nextBillingDate || selectedSub.startDate}</p>
              </div>
            </div>

            {/* Timeline History */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                Audit Trail & Status Transitions
              </h4>
              <div className="space-y-2 border-l-2 border-slate-200 pl-3 ml-1.5">
                {selectedSub.history && selectedSub.history.length > 0 ? (
                  selectedSub.history.map((event, idx) => (
                    <div key={idx} className="relative text-xs">
                      <span className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
                      <p className="font-semibold text-slate-800">{event.action}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(event.timestamp).toLocaleString()} • by {event.by || 'System'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No events logged yet.</p>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

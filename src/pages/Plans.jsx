import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { Plus, Clock, Check, Edit2, Trash2 } from 'lucide-react';

const getTodayString = () => new Date().toISOString().split('T')[0];

export const Plans = () => {
  const { plans, addPlan, updatePlan, deletePlan, user } = useApp();

  const [selectedCycle, setSelectedCycle] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    billingCycle: 'monthly',
    price: '',
    minQuantity: 1,
    startDate: getTodayString(),
    endDate: '2028-12-31',
    renewalMode: 'auto',
    pauseAllowed: true,
    description: '',
    active: true
  });

  const canEdit = user?.role === 'admin' || user?.role === 'staff';
  const canDelete = user?.role === 'admin';

  const cycles = ['daily', 'weekly', 'monthly', 'yearly'];

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      billingCycle: 'monthly',
      price: '',
      minQuantity: 1,
      startDate: getTodayString(),
      endDate: '2028-12-31',
      renewalMode: 'auto',
      pauseAllowed: true,
      description: '',
      active: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      billingCycle: plan.billingCycle,
      price: plan.price,
      minQuantity: plan.minQuantity || 1,
      startDate: plan.startDate || '',
      endDate: plan.endDate || '',
      renewalMode: plan.renewalMode || 'auto',
      pauseAllowed: plan.pauseAllowed !== false,
      description: plan.description || '',
      active: plan.active !== false
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload = {
      name: formData.name.trim(),
      billingCycle: formData.billingCycle,
      price: parseFloat(formData.price) || 0,
      minQuantity: parseInt(formData.minQuantity, 10) || 1,
      startDate: formData.startDate,
      endDate: formData.endDate,
      renewalMode: formData.renewalMode,
      pauseAllowed: formData.pauseAllowed,
      description: formData.description.trim(),
      active: formData.active
    };

    if (editingPlan) {
      updatePlan(editingPlan.id, payload);
    } else {
      addPlan(payload);
    }
    setModalOpen(false);
  };

  const filteredPlans = plans.filter(p => {
    if (selectedCycle === 'all') return true;
    return p.billingCycle === selectedCycle;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Subscription Billing Plans</h2>
          <p className="text-xs text-slate-500">
            Define recurring intervals (daily, weekly, monthly, yearly), minimum commitments, and pause policies.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Plan</span>
          </button>
        )}
      </div>

      {/* Cycle Tabs Filter */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 w-fit">
        <button
          onClick={() => setSelectedCycle('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
            selectedCycle === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Intervals ({plans.length})
        </button>
        {cycles.map(cycle => (
          <button
            key={cycle}
            onClick={() => setSelectedCycle(cycle)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              selectedCycle === cycle
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {cycle}
          </button>
        ))}
      </div>

      {/* Plans Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredPlans.map((plan) => {
          return (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all hover:shadow-lg relative overflow-hidden ${
                plan.billingCycle === 'yearly'
                  ? 'border-indigo-300 ring-2 ring-indigo-500/10 shadow-sm'
                  : 'border-slate-200/80 shadow-2xs'
              }`}
            >
              {plan.billingCycle === 'yearly' && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge status={plan.billingCycle} size="xs" />
                  {canEdit && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(plan)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => deletePlan(plan.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {plan.description || 'Standard recurring contract configuration.'}
                </p>

                {/* Price Display */}
                <div className="mt-4 pb-4 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                      ${Number(plan.price).toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 capitalize">/{plan.billingCycle}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Min commitment: {plan.minQuantity || 1} seat/unit
                  </span>
                </div>

                {/* Attributes checklist */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>Renewal: <strong className="capitalize text-slate-800">{plan.renewalMode}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Check className={`w-3.5 h-3.5 flex-shrink-0 ${plan.pauseAllowed ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span>{plan.pauseAllowed ? 'Pause/Resume Permitted' : 'Pause not available'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>Valid: {plan.startDate} to {plan.endDate || 'No expiration'}</span>
                  </div>
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Plan Status</span>
                <span className={`text-xs font-bold ${plan.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {plan.active ? '● Active' : '○ Inactive'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Plan Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPlan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
        subtitle="Set recurring interval, contract validity dates, and auto-renewal policies"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Plan Title *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="e.g. Enterprise Annual Pro"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Billing Cycle</label>
              <select
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                className="w-full px-3 py-2 text-xs capitalize border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {cycles.map(c => (
                  <option key={c} value={c} className="capitalize">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Plan Price ($) *</label>
              <input
                type="number"
                required
                min="0"
                step="any"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="2200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Min Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Availability Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Availability End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Renewal Mode</label>
              <select
                value={formData.renewalMode}
                onChange={(e) => setFormData({ ...formData, renewalMode: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              >
                <option value="auto">Automatic (Auto-renew at period end)</option>
                <option value="manual">Manual (Customer must confirm)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.pauseAllowed}
                  onChange={(e) => setFormData({ ...formData, pauseAllowed: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span>Allow Customers to Pause Plan</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Plan Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              placeholder="Features, SLA guarantees, or volume requirements included in this tier."
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
            >
              {editingPlan ? 'Save Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

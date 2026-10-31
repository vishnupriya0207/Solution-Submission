import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/common/Modal';
import { Plus, Edit2, Trash2, Copy, CheckCircle } from 'lucide-react';

const getTodayString = () => new Date().toISOString().split('T')[0];

export const Discounts = () => {
  const { discounts, addDiscount, updateDiscount, deleteDiscount, user, showToast } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minPurchase: 0,
    startDate: getTodayString(),
    expiryDate: '2026-12-31',
    usageLimit: 100,
    active: true
  });

  const canEdit = user?.role === 'admin' || user?.role === 'staff';
  const canDelete = user?.role === 'admin';

  const handleOpenAdd = () => {
    setEditingDiscount(null);
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      minPurchase: 0,
      startDate: getTodayString(),
      expiryDate: '2026-12-31',
      usageLimit: 100,
      active: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (disc) => {
    setEditingDiscount(disc);
    setFormData({
      code: disc.code,
      type: disc.type,
      value: disc.value,
      minPurchase: disc.minPurchase || 0,
      startDate: disc.startDate || '',
      expiryDate: disc.expiryDate || '',
      usageLimit: disc.usageLimit || 100,
      active: disc.active !== false
    });
    setModalOpen(true);
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Code "${code}" copied to clipboard!`, 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    const payload = {
      code: formData.code.trim().toUpperCase(),
      type: formData.type,
      value: parseFloat(formData.value) || 0,
      minPurchase: parseFloat(formData.minPurchase) || 0,
      startDate: formData.startDate,
      expiryDate: formData.expiryDate,
      usageLimit: parseInt(formData.usageLimit, 10) || 100,
      active: formData.active
    };

    if (editingDiscount) {
      updateDiscount(editingDiscount.id, payload);
    } else {
      addDiscount(payload);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Promotional Discounts & Coupons</h2>
          <p className="text-xs text-slate-500">
            Configure percent-off or fixed rate vouchers, campaign expiry dates, and automated redemption limits.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promo Code</span>
          </button>
        )}
      </div>

      {/* Discount Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {discounts.map((disc) => {
          const isExpired = disc.expiryDate && disc.expiryDate < getTodayString();
          const usagePercent = Math.min(100, Math.round(((disc.timesUsed || 0) / (disc.usageLimit || 1)) * 100));

          return (
            <div
              key={disc.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg tracking-wider">
                      {disc.code}
                    </span>
                    <button
                      onClick={() => handleCopy(disc.code)}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                      title="Copy code"
                    >
                      {copiedCode === disc.code ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {canEdit && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(disc)}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => deleteDiscount(disc.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-slate-900 font-mono">
                    {disc.type === 'percentage' ? `${disc.value}%` : `$${disc.value}`}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {disc.type === 'percentage' ? 'off contract subtotal' : 'flat rebate'}
                  </span>
                </div>

                {/* Restrictions */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Min Purchase:</span>
                    <span className="font-mono font-medium">${disc.minPurchase || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Valid Until:</span>
                    <span className={`font-mono ${isExpired ? 'text-rose-600 font-bold' : ''}`}>
                      {disc.expiryDate || 'Ongoing'}
                    </span>
                  </div>
                </div>

                {/* Usage meter */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Redemptions</span>
                    <span className="font-mono font-bold text-slate-700">
                      {disc.timesUsed || 0} / {disc.usageLimit || '∞'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Status pill */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Status</span>
                <span className={`text-xs font-bold ${disc.active && !isExpired ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isExpired ? '● Expired' : disc.active ? '● Active' : '○ Disabled'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Discount Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDiscount ? 'Edit Promotional Coupon' : 'Create Promotional Coupon'}
        subtitle="Set discount values, minimum order thresholds, and redemption caps"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Promo Code *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 text-xs font-mono uppercase font-bold text-indigo-700 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="e.g. SUMMER25"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Discount Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              >
                <option value="percentage">Percentage Off (%)</option>
                <option value="fixed">Fixed Rebate ($)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Discount Value *</label>
              <input
                type="number"
                required
                min="0.01"
                step="any"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl"
                placeholder={formData.type === 'percentage' ? '20' : '500'}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Min Spend Required ($)</label>
              <input
                type="number"
                min="0"
                value={formData.minPurchase}
                onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl"
                placeholder="1000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Max Redemptions Limit</label>
            <input
              type="number"
              min="1"
              value={formData.usageLimit}
              onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl"
              placeholder="100"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span>Enable coupon immediately for new subscriptions</span>
            </label>
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
              {editingDiscount ? 'Save Coupon' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

import React from 'react';

const statusStyles = {
  // Subscriptions & general
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
  quotation: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
  draft: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20',
  paused: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20',
  closed: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
  
  // Invoices & Payments
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
  overdue: 'bg-red-50 text-red-700 border-red-200 ring-red-500/20 font-semibold',
  pending: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
  successful: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
  failed: 'bg-red-50 text-red-700 border-red-200 ring-red-500/20',

  // Billing cycles
  yearly: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  monthly: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  weekly: 'bg-teal-50 text-teal-700 border-teal-200',
  daily: 'bg-orange-50 text-orange-700 border-orange-200',

  // Roles
  admin: 'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
  staff: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
  customer: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'
};

export const Badge = ({ status = 'draft', label, size = 'sm', className = '' }) => {
  const normStatus = (status || '').toString().toLowerCase();
  const currentStyle = statusStyles[normStatus] || 'bg-slate-50 text-slate-700 border-slate-200';
  const displayLabel = label || status;

  const sizeClasses = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium capitalize transition-colors ${sizeClasses} ${currentStyle} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {displayLabel}
    </span>
  );
};

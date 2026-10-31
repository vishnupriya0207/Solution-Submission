import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  RotateCcw,
  Plus,
  Shield,
  Briefcase,
  UserCheck,
  FileText
} from 'lucide-react';

export const Header = ({ onOpenMobile, onOpenNewSubscriptionModal, onOpenNewInvoiceModal }) => {
  const { user, setUser, demoUsers, activeTab, resetToDemoData } = useApp();
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Executive Overview';
      case 'subscriptions': return 'Subscriptions & Recurring Contracts';
      case 'invoices': return 'Billing Invoices';
      case 'payments': return 'Payments & Collections';
      case 'customers': return 'Customer Directory';
      case 'products': return 'Product Catalog';
      case 'plans': return 'Subscription Plans';
      case 'discounts': return 'Discount Coupons & Promotions';
      case 'reports': return 'Financial & Growth Analytics';
      case 'auth': return 'Authentication & Accounts';
      default: return 'Brightloop Software';
    }
  };

  const handleSwitchUser = (demoUser) => {
    setUser(demoUser);
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-white border-b border-slate-200/80 flex items-center justify-between gap-4 sticky top-0 z-30 no-print">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
            {getPageTitle()}
          </h1>
          <p className="text-[11px] text-slate-400 mt-1 hidden sm:block">
            Brightloop Software Enterprise SaaS Management System
          </p>
        </div>
      </div>

      {/* Center/Right: Role Switcher & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Quick Switcher Pills */}
        <div className="hidden md:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
            Role:
          </span>
          {demoUsers.map((u) => {
            const isCurrent = user?.id === u.id;
            const Icon = u.role === 'admin' ? Shield : u.role === 'staff' ? Briefcase : UserCheck;
            return (
              <button
                key={u.id}
                onClick={() => handleSwitchUser(u)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
                title={`Switch to ${u.name} (${u.role})`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="capitalize">{u.role}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Shortcuts (for admin/staff) */}
        {user?.role !== 'customer' && (
          <div className="hidden sm:flex items-center gap-2">
            {onOpenNewSubscriptionModal && (
              <button
                onClick={onOpenNewSubscriptionModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Sub</span>
              </button>
            )}

            {onOpenNewInvoiceModal && (
              <button
                onClick={onOpenNewInvoiceModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-all active:scale-95"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Invoice</span>
              </button>
            )}
          </div>
        )}

        {/* Reset Demo Data Button */}
        {resetConfirmOpen ? (
          <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2 py-1 rounded-xl animate-in fade-in">
            <span className="text-[11px] text-rose-700 font-semibold">Reset all?</span>
            <button
              onClick={() => {
                resetToDemoData();
                setResetConfirmOpen(false);
              }}
              className="px-2 py-0.5 bg-rose-600 text-white rounded text-[11px] font-bold hover:bg-rose-700"
            >
              Yes
            </button>
            <button
              onClick={() => setResetConfirmOpen(false)}
              className="px-1.5 py-0.5 text-slate-500 text-[11px] hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setResetConfirmOpen(true)}
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50/70 border border-slate-200/80 rounded-xl transition-colors"
            title="Reset to factory demo data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* Top-Right User Profile Section */}
        <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200/80">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"}
            alt={user?.role === 'admin' ? 'Vishnupriya' : (user?.name || 'User')}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20 flex-shrink-0"
          />
          <div className="text-left">
            <p className="text-xs font-bold text-slate-800 leading-none whitespace-nowrap">
              {user?.role === 'admin' ? 'Vishnupriya — Admin' : `${user?.name || 'User'} — ${user?.role === 'staff' ? 'Staff' : 'Customer'}`}
            </p>
            <p className="text-[10px] text-indigo-600 font-medium capitalize mt-0.5">
              {user?.role === 'admin' ? 'Administrator' : (user?.title || user?.role)}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

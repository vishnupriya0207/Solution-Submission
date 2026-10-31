import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Layers,
  Repeat,
  FileText,
  CreditCard,
  Users,
  Package,
  Percent,
  BarChart3,
  ShieldCheck,
  Zap,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { Badge } from './Badge';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, user } = useApp();

  const isCustomer = user?.role === 'customer';

  // Navigation schema with role gating
  const navItems = isCustomer
    ? [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'subscriptions', label: 'My Subscriptions', icon: Repeat },
        { id: 'invoices', label: 'My Invoices', icon: FileText },
        { id: 'payments', label: 'Payment History', icon: CreditCard },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
        { id: 'invoices', label: 'Invoices', icon: FileText },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'plans', label: 'Subscription Plans', icon: Layers },
        { id: 'discounts', label: 'Discounts & Codes', icon: Percent },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
      ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-base">Brightloop</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                  SaaS
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Subscription Engine</p>
            </div>
          </div>
        </div>

        {/* Role indicator pill */}
        <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-100/80 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Workspace Mode</span>
          <Badge status={user?.role || 'admin'} size="xs" />
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
              </button>
            );
          })}
        </div>

        {/* Quick System Badge & Stats Banner */}
        <div className="p-4 mx-3 mb-3 rounded-xl bg-gradient-to-br from-indigo-50/70 to-slate-50 border border-indigo-100/60">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-950">Brightloop Core v2.4</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Automated recurrent billing, proration & multi-tier pricing active.
          </p>
        </div>

        {/* User Profile Card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate capitalize">{user?.role} Portal</p>
            </div>
            <button
              onClick={() => setActiveTab('auth')}
              title="Switch user account"
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

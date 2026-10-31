import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, User, Building, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export const Auth = () => {
  const { user, setUser, demoUsers, customers, addCustomer, setActiveTab, showToast } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('customer');

  const handleDemoLogin = (demoUser) => {
    setUser(demoUser);
    showToast(`Logged in as ${demoUser.name} (${demoUser.role.toUpperCase()})`);
    setActiveTab('dashboard');
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      // Find matching demo user or customer in directory
      const foundDemo = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (foundDemo) {
        setUser(foundDemo);
      } else {
        const foundCustomer = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
        setUser({
          id: `user-${Date.now()}`,
          name: foundCustomer ? foundCustomer.name : email.split('@')[0],
          email,
          role: foundCustomer ? 'customer' : 'customer',
          customerId: foundCustomer ? foundCustomer.id : undefined,
          title: foundCustomer ? `Client Representative at ${foundCustomer.company}` : 'Registered Client User',
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
        });
      }
      showToast('Logged in successfully!');
      setActiveTab('dashboard');
    } else {
      // Registration: if role is customer, also add to customer directory
      let assignedCustId = undefined;
      if (role === 'customer') {
        const newCust = addCustomer({
          name: name.trim() || 'New Customer',
          company: company.trim() || 'Independent Client',
          email: email.trim(),
          phone: '',
          address: '',
          status: 'active'
        });
        assignedCustId = newCust.id;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: name.trim() || email.split('@')[0],
        email: email.trim(),
        role,
        customerId: assignedCustId,
        title: `${role.toUpperCase()} User at ${company || 'Brightloop'}`,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
      };

      setUser(newUser);
      showToast(`Account registered as ${newUser.role.toUpperCase()}!`);
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-6 px-4">
      {/* Container */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
        {/* Brand Icon Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-3">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Brightloop Software</h2>
          <p className="text-xs text-slate-500 mt-1">Enterprise Subscription Billing & Management Platform</p>
        </div>

        {/* Quick 1-Click Demo Accounts Selector */}
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
          <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            Quick One-Click Demo Personas:
          </span>
          <div className="space-y-2">
            {demoUsers.map((u) => {
              const isCurrent = user?.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => handleDemoLogin(u)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    isCurrent
                      ? 'bg-white border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white/80 hover:bg-white border-slate-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-none">{u.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{u.title}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    u.role === 'staff' ? 'bg-blue-100 text-blue-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {u.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-slate-100 mb-5">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 pb-3 text-xs font-bold transition-all border-b-2 ${
              mode === 'login'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Direct Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 pb-3 text-xs font-bold transition-all border-b-2 ${
              mode === 'register'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Custom Auth Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization</label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="customer">Customer Client (View My Invoices & Pay)</option>
                  <option value="staff">Billing Staff (Operations & Invoicing)</option>
                  <option value="admin">Administrator (Full CRUD & Settings)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="user@brightloop.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all active:scale-98"
          >
            <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

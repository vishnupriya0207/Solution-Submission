import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';
import { Mail, Phone, MapPin, Repeat, FileText, ArrowRight } from 'lucide-react';

export const CustomerDetailModal = ({ isOpen, onClose, customer, onSelectInvoice, onSelectSubscription }) => {
  const { subscriptions, invoices, plans, products } = useApp();

  if (!customer) return null;

  // Filter subscriptions and invoices for this customer
  const customerSubs = subscriptions.filter(s => s.customerId === customer.id);
  const customerInvs = invoices.filter(i => i.customerId === customer.id);

  const totalSpent = customerInvs
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + (Number(i.totalAmount) || 0), 0);

  const pendingDue = customerInvs
    .filter(i => i.status === 'confirmed' || i.status === 'overdue')
    .reduce((sum, i) => sum + (Number(i.totalAmount) || 0), 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer.company || customer.name}
      subtitle={`Customer Account Overview — Joined ${new Date(customer.createdAt).toLocaleDateString()}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Customer Header Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="space-y-1.5 md:col-span-1 border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Primary Contact</span>
            <p className="text-sm font-bold text-slate-800">{customer.name}</p>
            <div className="text-xs text-slate-600 space-y-1">
              <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {customer.email}</p>
              {customer.phone && (
                <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {customer.phone}</p>
              )}
              {customer.address && (
                <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {customer.address}</p>
              )}
            </div>
            <div className="pt-1">
              <Badge status={customer.status || 'active'} size="xs" />
            </div>
          </div>

          <div className="flex flex-col justify-center p-3 bg-white rounded-lg border border-slate-200/60 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Lifetime Revenue</span>
            <span className="text-2xl font-black text-emerald-600 font-mono mt-1">
              ${totalSpent.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Paid invoices total</span>
          </div>

          <div className="flex flex-col justify-center p-3 bg-white rounded-lg border border-slate-200/60 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Outstanding Invoices</span>
            <span className={`text-2xl font-black font-mono mt-1 ${pendingDue > 0 ? 'text-amber-600' : 'text-slate-700'}`}>
              ${pendingDue.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              {customerInvs.filter(i => i.status === 'overdue').length > 0 ? 'Includes overdue balance' : 'Pending settlement'}
            </span>
          </div>
        </div>

        {/* Subscriptions Tab Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Subscription History ({customerSubs.length})
              </h4>
            </div>
          </div>

          {customerSubs.length === 0 ? (
            <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
              No subscriptions on record for this customer.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Contract Code</th>
                    <th className="py-2.5 px-3">Product & Plan</th>
                    <th className="py-2.5 px-3">Billing Cycle</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Start Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customerSubs.map((sub) => {
                    const prod = products.find(p => p.id === sub.productId);
                    const plan = plans.find(p => p.id === sub.planId);
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">
                          {onSelectSubscription ? (
                            <button
                              onClick={() => {
                                onClose();
                                onSelectSubscription(sub);
                              }}
                              className="hover:underline"
                            >
                              {sub.code}
                            </button>
                          ) : (
                            sub.code
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="font-semibold text-slate-800">{prod ? prod.name : 'Custom License'}</p>
                          <p className="text-[10px] text-slate-400">{plan ? plan.name : sub.billingCycle}</p>
                        </td>
                        <td className="py-2.5 px-3 capitalize font-medium text-slate-600">{sub.billingCycle}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          ${(sub.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <Badge status={sub.status} size="xs" />
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-500">{sub.startDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Invoices Tab Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Invoices & Statements ({customerInvs.length})
              </h4>
            </div>
          </div>

          {customerInvs.length === 0 ? (
            <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
              No invoices generated yet for this customer.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Invoice #</th>
                    <th className="py-2.5 px-3">Billing Period</th>
                    <th className="py-2.5 px-3">Issue Date</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customerInvs.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{inv.invoiceNumber}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{inv.billingPeriod}</td>
                      <td className="py-2.5 px-3 text-slate-600">{inv.issueDate}</td>
                      <td className="py-2.5 px-3 text-slate-600">{inv.dueDate}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        ${Number(inv.totalAmount).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Badge status={inv.status} size="xs" />
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {onSelectInvoice && (
                          <button
                            onClick={() => {
                              onClose();
                              onSelectInvoice(inv);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
                          >
                            <span>View</span> <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

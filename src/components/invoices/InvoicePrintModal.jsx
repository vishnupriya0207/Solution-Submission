import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Printer, CheckCircle, CreditCard, Mail, MapPin } from 'lucide-react';

export const InvoicePrintModal = ({ isOpen, onClose, invoice, onRecordPayment }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPaid = invoice.status === 'paid';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice Preview — ${invoice.invoiceNumber}`}
      subtitle="Commercial Tax Invoice & Billing Receipt"
      maxWidth="max-w-3xl"
      footer={
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge status={invoice.status} size="sm" />
            {isPaid && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Settled via {invoice.paymentMethod || 'Payment'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isPaid && onRecordPayment && (
              <button
                onClick={() => {
                  onClose();
                  onRecordPayment(invoice);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Record Payment</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      }
    >
      {/* Printable Invoice Document Body */}
      <div id="printable-invoice" className="bg-white p-6 sm:p-8 rounded-xl border border-slate-100 text-slate-800">
        {/* Header with Brightloop Logo & Invoice Title */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                BL
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Brightloop Software
              </span>
            </div>
            <p className="text-xs text-slate-500">Brightloop Enterprise Cloud Solutions Inc.</p>
            <p className="text-xs text-slate-500">100 Technology Plaza, Suite 900</p>
            <p className="text-xs text-slate-500">San Francisco, CA 94105 • billing@brightloop.io</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-600">
              Tax Invoice
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
              {invoice.invoiceNumber}
            </h2>
            <div className="mt-2 inline-block">
              <Badge status={invoice.status} size="sm" />
            </div>
          </div>
        </div>

        {/* Invoice Metadata (Bill To, Dates, Billing Period) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Billed To
            </span>
            <p className="text-sm font-bold text-slate-900">{invoice.customerName}</p>
            {invoice.customerEmail && (
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {invoice.customerEmail}
              </p>
            )}
            {invoice.customerAddress && (
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {invoice.customerAddress}
              </p>
            )}
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Invoice Details
            </span>
            <p className="text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Billing Cycle:</span>{' '}
              <span className="font-mono">{invoice.billingPeriod || 'Current Period'}</span>
            </p>
            <p className="text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Issue Date:</span>{' '}
              {invoice.issueDate}
            </p>
            <p className="text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Payment Due:</span>{' '}
              <span className="text-rose-600 font-semibold">{invoice.dueDate}</span>
            </p>
            {invoice.paidAt && (
              <p className="text-xs text-emerald-600 font-semibold">
                Paid Date: {new Date(invoice.paidAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="pb-3">Description</th>
                <th className="pb-3 text-center">Qty</th>
                <th className="pb-3 text-right">Unit Price</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {invoice.items && invoice.items.length > 0 ? (
                invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 font-medium text-slate-800">{item.description}</td>
                    <td className="py-3.5 text-center text-slate-600 font-mono">{item.quantity}</td>
                    <td className="py-3.5 text-right text-slate-600 font-mono">
                      ${Number(item.unitPrice).toLocaleString()}
                    </td>
                    <td className="py-3.5 text-right font-bold text-slate-900 font-mono">
                      ${Number(item.amount).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3 font-medium text-slate-800">Enterprise Recurring Plan</td>
                  <td className="py-3 text-center text-slate-600 font-mono">1</td>
                  <td className="py-3 text-right text-slate-600 font-mono">${Number(invoice.subtotal).toLocaleString()}</td>
                  <td className="py-3 text-right font-bold text-slate-900 font-mono">${Number(invoice.subtotal).toLocaleString()}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Financial Summary Calculation */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <div className="w-full sm:w-72 space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Subtotal</span>
              <span className="font-mono font-medium">${Number(invoice.subtotal).toLocaleString()}</span>
            </div>

            {invoice.discount > 0 && (
              <div className="flex justify-between text-xs text-emerald-600 font-medium">
                <span>Discount Applied</span>
                <span className="font-mono">-${Number(invoice.discount).toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-slate-600">
              <span>Estimated Tax (10% VAT/GST)</span>
              <span className="font-mono font-medium">${Number(invoice.taxAmount).toLocaleString()}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-base font-extrabold text-slate-900">
              <span>Total Amount</span>
              <span className="text-lg text-indigo-600 font-mono">
                ${Number(invoice.totalAmount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Terms */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-[11px] text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Thank you for choosing Brightloop Software. Standard Net-15 payment terms apply.</span>
          <span className="font-mono text-slate-500">ID: {invoice.id}</span>
        </div>
      </div>
    </Modal>
  );
};

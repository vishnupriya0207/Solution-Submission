import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/Toast';
import { InvoicePrintModal } from './components/invoices/InvoicePrintModal';
import { CustomerDetailModal } from './components/customers/CustomerDetailModal';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Subscriptions } from './pages/Subscriptions';
import { Invoices } from './pages/Invoices';
import { Payments } from './pages/Payments';
import { Customers } from './pages/Customers';
import { Products } from './pages/Products';
import { Plans } from './pages/Plans';
import { Discounts } from './pages/Discounts';
import { Reports } from './pages/Reports';
import { Auth } from './pages/Auth';

const MainLayout = () => {
  const { activeTab, setActiveTab } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Global cross-page modal states
  const [newSubModalOpen, setNewSubModalOpen] = useState(false);
  const [newInvoiceModalOpen, setNewInvoiceModalOpen] = useState(false);
  const [targetSubForInvoice, setTargetSubForInvoice] = useState(null);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [recordPaymentInvoice, setRecordPaymentInvoice] = useState(null);
  const [detailCustomer, setDetailCustomer] = useState(null);

  // Action to jump to Invoices with target sub pre-selected
  const handleGenerateInvoiceFromSub = (sub) => {
    setTargetSubForInvoice(sub);
    setActiveTab('invoices');
    setNewInvoiceModalOpen(true);
  };

  // Action to jump to Payments with target invoice pre-selected
  const handleRecordPaymentForInvoice = (inv) => {
    setRecordPaymentInvoice(inv);
    setActiveTab('payments');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Navbar */}
        <Header
          onOpenMobile={() => setMobileSidebarOpen(true)}
          onOpenNewSubscriptionModal={() => {
            setActiveTab('subscriptions');
            setNewSubModalOpen(true);
          }}
          onOpenNewInvoiceModal={() => {
            setTargetSubForInvoice(null);
            setActiveTab('invoices');
            setNewInvoiceModalOpen(true);
          }}
        />

        {/* Page Content View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0">
          {activeTab === 'dashboard' && (
            <Dashboard
              onOpenNewSub={() => {
                setActiveTab('subscriptions');
                setNewSubModalOpen(true);
              }}
              onOpenNewInvoice={() => {
                setTargetSubForInvoice(null);
                setActiveTab('invoices');
                setNewInvoiceModalOpen(true);
              }}
              onSelectInvoice={(inv) => setPreviewInvoice(inv)}
            />
          )}

          {activeTab === 'subscriptions' && (
            <Subscriptions
              onGenerateInvoiceForSub={handleGenerateInvoiceFromSub}
              modalOpenProp={newSubModalOpen}
              setModalOpenProp={setNewSubModalOpen}
            />
          )}

          {activeTab === 'invoices' && (
            <Invoices
              onRecordPayment={handleRecordPaymentForInvoice}
              modalOpenProp={newInvoiceModalOpen}
              setModalOpenProp={setNewInvoiceModalOpen}
              targetSub={targetSubForInvoice}
              setTargetSub={setTargetSubForInvoice}
            />
          )}

          {activeTab === 'payments' && (
            <Payments
              recordPaymentTargetInvoice={recordPaymentInvoice}
              setRecordPaymentTargetInvoice={setRecordPaymentInvoice}
            />
          )}

          {activeTab === 'customers' && (
            <Customers
              onSelectInvoice={(inv) => setPreviewInvoice(inv)}
              onSelectSubscription={() => setActiveTab('subscriptions')}
              onOpenCustomerDetail={(c) => setDetailCustomer(c)}
            />
          )}

          {activeTab === 'products' && <Products />}

          {activeTab === 'plans' && <Plans />}

          {activeTab === 'discounts' && <Discounts />}

          {activeTab === 'reports' && <Reports />}

          {activeTab === 'auth' && <Auth />}
        </main>
      </div>

      {/* Global Invoice Preview / Print Modal */}
      {previewInvoice && (
        <InvoicePrintModal
          isOpen={!!previewInvoice}
          onClose={() => setPreviewInvoice(null)}
          invoice={previewInvoice}
          onRecordPayment={handleRecordPaymentForInvoice}
        />
      )}

      {/* Global Customer Detail Modal */}
      {detailCustomer && (
        <CustomerDetailModal
          isOpen={!!detailCustomer}
          onClose={() => setDetailCustomer(null)}
          customer={detailCustomer}
          onSelectInvoice={(inv) => setPreviewInvoice(inv)}
          onSelectSubscription={() => setActiveTab('subscriptions')}
        />
      )}

      {/* Floating Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import BottomNav from './components/common/BottomNav';

// User Portal Pages
import UserLogin from './user/UserLogin';
import UserDashboard from './user/UserDashboard';
import UserCustomers from './user/UserCustomers';
import UserHens from './user/UserHens';
import UserPayments from './user/UserPayments';
import UserProfile from './user/UserProfile';
import UserSettings from './user/UserSettings';

// Admin Portal Pages & Suite
import AdminLogin from './admin/AdminLogin';
import AdminSuite from './admin/AdminSuite';

function AppContent() {
  const { portal, setPortal, currentUser, toast } = useAuth();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Shared modal navigation between tabs on User side
  const [userModalAction, setUserModalAction] = useState(null);

  // Sync default tab when portal changes
  useEffect(() => {
    if (portal === 'admin') {
      if (!activeTab.startsWith('admin-')) {
        setActiveTab('admin-dashboard');
      }
    } else {
      if (activeTab.startsWith('admin-')) {
        setActiveTab('dashboard');
      }
    }
  }, [portal]);

  // If user is logged out, render respective clean login screen
  if (!currentUser) {
    if (portal === 'admin') {
      return <AdminLogin onSwitchToUser={() => setPortal('user')} />;
    }
    return <UserLogin onSwitchToAdmin={() => setPortal('admin')} />;
  }

  // Derive Screen Titles
  const getHeaderTitles = () => {
    if (portal === 'admin') {
      switch (activeTab) {
        case 'admin-dashboard':
          return { title: 'Executive Command Center', subtitle: 'Poultry operations governance & mandi control' };
        case 'admin-users':
          return { title: 'Staff User Directory', subtitle: 'Field operators, managers & role assignments' };
        case 'admin-roles':
          return { title: 'Roles & Permissions Matrix', subtitle: 'System capabilities & role-based access' };
        case 'admin-field-access':
          return { title: 'Field-Level Privacy Rules', subtitle: 'Data masking & field visibility controls' };
        case 'admin-rates':
          return { title: 'Live Rates & Pricing Index', subtitle: 'Wholesale mandi benchmarks for Marga & Margee' };
        case 'admin-audit-logs':
          return { title: 'Security Audit Trail', subtitle: 'Immutable log of administrative & pricing actions' };
        case 'admin-settings':
          return { title: 'System Settings', subtitle: 'Global mandi parameters & database backup' };
        default:
          return { title: 'JV Admin Console', subtitle: 'Executive poultry oversight' };
      }
    } else {
      switch (activeTab) {
        case 'dashboard':
          return { title: 'JV Hen Management', subtitle: 'Smart Poultry Intake & Billing' };
        case 'customers':
          return { title: 'Customer Accounts', subtitle: 'Ledger balances & contact directory' };
        case 'hens':
          return { title: 'Hens Intake & Weigh-in', subtitle: 'Batch bird measurements & mandi calculations' };
        case 'payments':
          return { title: 'Payment Receipts', subtitle: 'Market collections & settled receipts' };
        case 'profile':
          return { title: 'Operator Profile', subtitle: 'Handheld operator credentials' };
        case 'settings':
          return { title: 'Field Settings', subtitle: 'Sync & notification preferences' };
        default:
          return { title: 'JV Hen Management', subtitle: 'Smart Poultry Intake & Billing' };
      }
    }
  };

  const { title, subtitle } = getHeaderTitles();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#DBEAFE] selection:text-[#2563EB]">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white border border-[#DBEAFE] shadow-lg text-xs font-bold text-[#0F172A] animate-in fade-in slide-in-from-top-2 duration-200">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              toast.type === 'error'
                ? 'bg-[#DC2626]'
                : toast.type === 'info'
                ? 'bg-[#2563EB]'
                : toast.type === 'warning'
                ? 'bg-[#F59E0B]'
                : 'bg-[#16A34A]'
            }`}
          />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Persistent Global Header */}
      <Header title={title} subtitle={subtitle} />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-10">
          {portal === 'user' && (
            <>
              {activeTab === 'dashboard' && (
                <UserDashboard onNavigateTab={setActiveTab} />
              )}
              {activeTab === 'customers' && (
                <UserCustomers
                  onOpenBatchHen={() => setActiveTab('hens')}
                  onOpenPayment={() => setActiveTab('payments')}
                />
              )}
              {activeTab === 'hens' && <UserHens />}
              {activeTab === 'payments' && <UserPayments />}
              {activeTab === 'profile' && <UserProfile />}
              {activeTab === 'settings' && <UserSettings />}
            </>
          )}

          {portal === 'admin' && (
            <AdminSuite
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

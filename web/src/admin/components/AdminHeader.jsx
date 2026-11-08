import React from 'react';
import { Search, Bell, TrendingUp, UserPlus, RefreshCw } from 'lucide-react';

export default function AdminHeader({
  activeTab,
  rates,
  onOpenRateModal,
  onOpenAddUserModal,
  onOpenSimulator
}) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Executive Overview';
      case 'users': return 'User Directory & Access';
      case 'roles': return 'Role Permissions Matrix';
      case 'field-access': return 'Field Privacy & Masking';
      case 'rates': return 'Live Poultry Rates';
      case 'audit-logs': return 'Security Audit Trail';
      default: return 'Administration';
    }
  };

  return (
    <header className="admin-header">
      {/* Breadcrumb & Path */}
      <div className="header-left">
        <div className="breadcrumb-path">
          <span className="breadcrumb-root">Admin</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{getTabTitle()}</span>
        </div>
      </div>

      {/* Right Controls: Live Rates Ticker, Shortcuts, Notifications */}
      <div className="header-right">
        {/* Live Rates Ticker */}
        <div
          className="rates-ticker-pill"
          onClick={onOpenRateModal}
          style={{ cursor: 'pointer' }}
          title="Click to adjust live rates"
        >
          <span className="ticker-indicator" />
          <span>Marga: <strong>₹{rates.MARGA}</strong></span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>Margee: <strong>₹{rates.MARGEE}</strong></span>
        </div>

        {/* Dynamic Context Shortcut Button */}
        {activeTab === 'users' && (
          <button className="btn-primary-cta" onClick={onOpenAddUserModal}>
            <UserPlus size={16} />
            <span>Add User</span>
          </button>
        )}

        {activeTab === 'rates' && (
          <button className="btn-primary-cta" onClick={onOpenRateModal}>
            <TrendingUp size={16} />
            <span>Update Rates</span>
          </button>
        )}

        {activeTab === 'field-access' && (
          <button className="btn-primary-cta" onClick={onOpenSimulator}>
            <span>Test Role View</span>
          </button>
        )}

        {/* Notifications Button */}
        <button className="header-icon-btn" title="System alerts (2 unread)">
          <Bell size={18} />
          <span className="icon-unread-dot" />
        </button>
      </div>
    </header>
  );
}

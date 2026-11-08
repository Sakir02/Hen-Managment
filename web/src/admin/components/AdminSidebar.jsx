import React from 'react';
import {
  Feather,
  LayoutDashboard,
  Users,
  ShieldCheck,
  EyeOff,
  TrendingUp,
  History,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  metrics
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Admin Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      badge: metrics?.userCount || '6'
    },
    {
      id: 'roles',
      label: 'Roles & Permissions',
      icon: ShieldCheck,
      badge: metrics?.roleCount || '4'
    },
    {
      id: 'field-access',
      label: 'Field Privacy Rules',
      icon: EyeOff,
      badge: '6 Rules'
    },
    {
      id: 'rates',
      label: 'Rates & Pricing',
      icon: TrendingUp,
      badge: 'Live'
    },
    {
      id: 'audit-logs',
      label: 'Security Audit Logs',
      icon: History,
      badge: metrics?.logCount || '7'
    }
  ];

  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-wrapper">
          <div className="brand-emblem"><Feather className="w-5 h-5 text-[#2563EB]" /></div>
          {!isCollapsed && (
            <div className="brand-info">
              <span className="brand-title">HenOps Admin</span>
              <span className="brand-badge">Enterprise v1.0</span>
            </div>
          )}
        </div>
        <button
          className="sidebar-collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {!isCollapsed && <div className="nav-section-title">Administration</div>}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="nav-icon">
                <Icon size={19} />
              </span>
              {!isCollapsed && (
                <>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-counter">{item.badge}</span>}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Current Logged-in Admin Profile Footer */}
      <div className="sidebar-footer">
        <div className="user-avatar-pill">SK</div>
        {!isCollapsed && (
          <div className="user-info-text">
            <span className="user-name-line">Sakir Khan</span>
            <span className="user-role-line">Super Administrator</span>
          </div>
        )}
      </div>
    </aside>
  );
}

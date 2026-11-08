import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Settings,
  User,
  LogOut,
  ShieldCheck,
  TrendingUp,
  Receipt,
  Scale,
  EyeOff,
  History
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab }) {
  const { portal, currentUser, logout } = useAuth();

  const userNavItems = [
    { id: 'dashboard', label: 'Home / Overview', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers & Ledger', icon: Users },
    { id: 'hens', label: 'Hens & Weigh-in', icon: Scale },
    { id: 'payments', label: 'Payments & Billing', icon: Receipt },
    { id: 'profile', label: 'Operator Profile', icon: User },
    { id: 'settings', label: 'Field Settings', icon: Settings },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'admin-users', label: 'Staff Users Directory', icon: Users },
    { id: 'admin-roles', label: 'Roles & Permissions', icon: ShieldCheck },
    { id: 'admin-field-access', label: 'Field Privacy Rules', icon: EyeOff },
    { id: 'admin-rates', label: 'Live Rates & Pricing', icon: TrendingUp },
    { id: 'admin-audit-logs', label: 'Security Audit Logs', icon: History },
    { id: 'admin-settings', label: 'System Settings', icon: Settings },
  ];

  const navItems = portal === 'admin' ? adminNavItems : userNavItems;

  return (
    <aside className="w-64 bg-white border-r border-[#DBEAFE] flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-4rem)]">
      {/* Navigation Group */}
      <div className="p-4 space-y-5">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2.5">
            {portal === 'admin' ? 'Executive Administration' : 'Field Operations'}
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition cursor-pointer ${
                    isActive
                      ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                      : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick System Badge */}
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DBEAFE]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span className="text-xs font-bold text-[#0F172A]">
              {portal === 'admin' ? 'Mandi Synced' : 'Active Intake Session'}
            </span>
          </div>
          <p className="text-[11px] text-[#64748B]">
            {portal === 'admin'
              ? 'Wholesale benchmark prices live on all field handhelds.'
              : 'Auto-calculating live weights via authorized mandi rates.'}
          </p>
        </div>
      </div>

      {/* Footer / Current Session & Sign Out */}
      <div className="p-4 border-t border-[#DBEAFE] space-y-2">
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-8 h-8 rounded-full bg-[#DBEAFE] text-[#2563EB] font-bold flex items-center justify-center text-xs">
            {currentUser?.avatar || 'JV'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-[#0F172A] truncate">{currentUser?.name || 'User'}</p>
            <p className="text-[10px] text-[#64748B] truncate">{currentUser?.role || 'Field Operator'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-xs text-[#DC2626] hover:bg-[#FEE2E2]/60 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

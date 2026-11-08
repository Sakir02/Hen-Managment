import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Scale,
  Receipt,
  Settings,
  TrendingUp,
  History
} from 'lucide-react';

export default function BottomNav({ activeTab, onSelectTab }) {
  const { portal } = useAuth();

  const userTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'hens', label: 'Hens', icon: Scale },
    { id: 'payments', label: 'Payments', icon: Receipt },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const adminTabs = [
    { id: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin-users', label: 'Users', icon: Users },
    { id: 'admin-rates', label: 'Rates', icon: TrendingUp },
    { id: 'admin-audit-logs', label: 'Logs', icon: History },
    { id: 'admin-settings', label: 'Settings', icon: Settings },
  ];

  const tabs = portal === 'admin' ? adminTabs : userTabs;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#DBEAFE] flex items-center justify-around z-40 px-1 shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              isActive ? 'text-[#2563EB]' : 'text-[#64748B]'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-[#DBEAFE]' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

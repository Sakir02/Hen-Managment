import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Shield, User } from 'lucide-react';

export default function Header({ title, subtitle, onToggleSidebar }) {
  const { portal, switchPortal, currentUser, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-[#DBEAFE] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Brand Identity / Screen Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
          JV
        </div>
        <div>
          <h1 className="text-base md:text-lg font-bold text-[#0F172A] leading-tight">
            {title || (portal === 'admin' ? 'JV Admin Dashboard' : 'JV Hen Management')}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#64748B] hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: Actions, Portal Toggle & User Badge */}
      <div className="flex items-center gap-3">
        {/* Portal Switcher Pill */}
        <button
          onClick={() => switchPortal(portal === 'admin' ? 'user' : 'admin')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#CCFBF1] text-[#0D9488] hover:bg-[#CCFBF1]/80 transition cursor-pointer border border-[#0D9488]/30"
          title="Switch Portal Interface"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>{portal === 'admin' ? 'Switch to User' : 'Admin Panel'}</span>
        </button>

        {/* Notifications Button */}
        <button
          className="relative p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2563EB]" />
        </button>

        {/* User Avatar Circle */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#DBEAFE]">
          <div className="w-9 h-9 rounded-full bg-[#DBEAFE] border border-[#2563EB] flex items-center justify-center text-[#2563EB] font-bold text-xs">
            {currentUser?.avatar || 'RK'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-[#0F172A] leading-none">{currentUser?.name || 'Rahul Kumar'}</p>
            <p className="text-[11px] text-[#64748B] leading-tight mt-0.5">{currentUser?.role || 'Field Operator'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

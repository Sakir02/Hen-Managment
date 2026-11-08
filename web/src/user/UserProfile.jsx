import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Phone, Mail, MapPin, Calendar } from 'lucide-react';

export default function UserProfile() {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-[#DBEAFE] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-[#DBEAFE]">
          <div className="w-20 h-20 rounded-full bg-[#DBEAFE] border-2 border-[#2563EB] flex items-center justify-center text-[#2563EB] font-black text-2xl shadow-xs">
            {currentUser?.avatar || 'RK'}
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-[#0F172A]">{currentUser?.name || 'Rahul Kumar'}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#CCFBF1] text-[#0D9488]">
                {currentUser?.status || 'ACTIVE'}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1">{currentUser?.role || 'Field Operator'}</p>
            <p className="text-xs font-medium text-[#2563EB] mt-0.5">Staff ID: JV-OP-4089</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DBEAFE]">
            <div className="p-2 rounded-lg bg-[#DBEAFE] text-[#2563EB]">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#64748B]">Phone Number</p>
              <p className="text-xs font-bold text-[#0F172A]">{currentUser?.phone || '+91 98765 43210'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DBEAFE]">
            <div className="p-2 rounded-lg bg-[#DBEAFE] text-[#2563EB]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#64748B]">Email Address</p>
              <p className="text-xs font-bold text-[#0F172A] truncate max-w-[180px]">
                {currentUser?.email || 'rahul.kumar@henoperations.com'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DBEAFE]">
            <div className="p-2 rounded-lg bg-[#CCFBF1] text-[#0D9488]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#64748B]">Assigned Farm Sector</p>
              <p className="text-xs font-bold text-[#0F172A]">Sector 4 (Mandi West Yard)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DBEAFE]">
            <div className="p-2 rounded-lg bg-[#CCFBF1] text-[#0D9488]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#64748B]">Joined Farm Operations</p>
              <p className="text-xs font-bold text-[#0F172A]">15 Jan 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white border border-[#DBEAFE] text-center shadow-xs">
          <p className="text-[11px] font-medium text-[#64748B]">Hens Intake</p>
          <p className="text-lg font-bold text-[#2563EB] mt-1">1,284</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#DBEAFE] text-center shadow-xs">
          <p className="text-[11px] font-medium text-[#64748B]">Payments Taken</p>
          <p className="text-lg font-bold text-[#0D9488] mt-1">₹ 38,500</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#DBEAFE] text-center shadow-xs">
          <p className="text-[11px] font-medium text-[#64748B]">Ledger Accuracy</p>
          <p className="text-lg font-bold text-[#16A34A] mt-1">99.8%</p>
        </div>
      </div>
    </div>
  );
}

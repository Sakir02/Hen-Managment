import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { initialRates, enterpriseMetrics, formatINR } from '../data/mockData';
import Modal from '../components/common/Modal';
import {
  Feather,
  Users,
  TrendingUp,
  Scale,
  Edit2,
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboard({ onNavigateUsers: _onNavigateUsers }) {
  const { showToast } = useAuth();
  const [rates, setRates] = useState(initialRates);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [margaRate, setMargaRate] = useState(String(rates.MARGA));
  const [margeeRate, setMargeeRate] = useState(String(rates.MARGEE));

  const handleSaveRates = (e) => {
    e.preventDefault();
    setRates({
      MARGA: parseFloat(margaRate) || rates.MARGA,
      MARGEE: parseFloat(margeeRate) || rates.MARGEE,
      lastUpdated: 'Just now',
      updatedBy: 'Admin (Priya Sharma)'
    });
    setIsRateModalOpen(false);
    showToast('Daily Mandi rates updated and synced to all field handhelds!');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A]">Dashboard Overview</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Centralized enterprise poultry analytics, customer balances, and mandi pricing.
          </p>
        </div>

        <button
          onClick={() => setIsRateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0D9488] text-white hover:bg-[#0D9488]/90 transition cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Edit2 className="w-4 h-4" />
          <span>Update Mandi Rates</span>
        </button>
      </div>

      {/* 2. Enterprise Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div className="p-5 rounded-2xl bg-white border border-[#DBEAFE] shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-[#64748B]">Active Customers</p>
          <p className="text-2xl font-extrabold text-[#0F172A] mt-1">{enterpriseMetrics.totalCustomers}</p>
        </div>

        {/* Total Hens Recorded */}
        <div className="p-5 rounded-2xl bg-white border border-[#DBEAFE] shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#CCFBF1] text-[#0D9488] flex items-center justify-center mb-3 text-lg">
            <Feather className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-[#64748B]">Total Hens In Stock</p>
          <p className="text-2xl font-extrabold text-[#0F172A] mt-1">{enterpriseMetrics.totalHens.toLocaleString()}</p>
        </div>

        {/* Outstanding Receivables */}
        <div className="p-5 rounded-2xl bg-white border border-[#DBEAFE] shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#CCFBF1] text-[#0D9488] flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-[#64748B]">Total Outstanding</p>
          <p className="text-2xl font-extrabold text-[#0D9488] mt-1">{formatINR(enterpriseMetrics.outstandingAmount)}</p>
        </div>

        {/* Monthly Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-[#DBEAFE] shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-[#64748B]">Monthly Turnover</p>
          <p className="text-2xl font-extrabold text-[#0F172A] mt-1">{formatINR(enterpriseMetrics.monthlyRevenue)}</p>
        </div>
      </div>

      {/* 3. Live Mandi Standard Rates Card */}
      <div className="p-6 rounded-2xl bg-white border border-[#DBEAFE] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DBEAFE] gap-2">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Live Mandi Standard Rates</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Current benchmark rates applied by operators during live bird intake.
            </p>
          </div>
          <span className="text-xs font-medium text-[#64748B]">
            Updated: <strong className="text-[#0F172A]">{rates.lastUpdated}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DBEAFE] flex items-center justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DBEAFE] text-[#2563EB]">
                MARGA (Male)
              </span>
              <p className="text-2xl font-black text-[#0F172A] mt-2">
                ₹ {rates.MARGA.toFixed(2)} <span className="text-xs font-medium text-[#64748B]">/ kg</span>
              </p>
            </div>
            <Scale className="w-8 h-8 text-[#2563EB]/40" />
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DBEAFE] flex items-center justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#CCFBF1] text-[#0D9488]">
                MARGEE (Female)
              </span>
              <p className="text-2xl font-black text-[#0F172A] mt-2">
                ₹ {rates.MARGEE.toFixed(2)} <span className="text-xs font-medium text-[#64748B]">/ kg</span>
              </p>
            </div>
            <Scale className="w-8 h-8 text-[#0D9488]/40" />
          </div>
        </div>
      </div>

      {/* Rate Update Modal */}
      <Modal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        title="Update Daily Mandi Rates"
        subtitle="Broadcast updated market prices to all active operators"
      >
        <form onSubmit={handleSaveRates} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Marga Rate (₹ / kg) *
            </label>
            <input
              type="number"
              step="0.5"
              value={margaRate}
              onChange={(e) => setMargaRate(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-sm font-bold text-[#0F172A] focus:border-[#0D9488]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Margee Rate (₹ / kg) *
            </label>
            <input
              type="number"
              step="0.5"
              value={margeeRate}
              onChange={(e) => setMargeeRate(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-sm font-bold text-[#0F172A] focus:border-[#0D9488]"
              required
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsRateModalOpen(false)}
              className="flex-1 py-3 rounded-xl font-bold text-xs border border-[#DBEAFE] text-[#64748B] hover:bg-[#F8FAFC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl font-bold text-xs bg-[#0D9488] text-white hover:bg-[#0D9488]/90 shadow-xs"
            >
              Broadcast Rates
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

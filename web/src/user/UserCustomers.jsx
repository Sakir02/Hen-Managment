import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { formatINR } from '../data/mockData';
import Modal from '../components/common/Modal';
import {
  Users,
  Search,
  Plus,
  Phone,
  Calendar,
  CreditCard,
  ChevronRight,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  Receipt
} from 'lucide-react';

export default function UserCustomers({ onOpenBatchHen, onOpenPayment }) {
  const { customers, addCustomer } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'DUE' | 'SETTLED'
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'DUE' && c.payableAmount > 0) ||
      (filterStatus === 'SETTLED' && c.payableAmount === 0);

    return matchesSearch && matchesStatus;
  });

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || filteredCustomers[0] || customers[0];

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newCust = addCustomer({ name, phone });
    setSelectedCustomerId(newCust.id);
    setName('');
    setPhone('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A]">Customer Ledger Directory</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Active customer accounts, outstanding mandi credit, and weighing history.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#2563EB] text-white hover:bg-[#2563EB]/90 transition cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-2xl border border-[#DBEAFE] shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search by customer name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs font-medium text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none transition"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'DUE', 'SETTLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {st === 'ALL' ? 'All Customers' : st === 'DUE' ? 'Pending Due' : 'Settled'}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Split: Customer List & Customer Detail Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customer Cards */}
        <div className="lg:col-span-5 space-y-3">
          {filteredCustomers.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#DBEAFE]">
              <Users className="w-8 h-8 text-[#64748B] mx-auto mb-2 opacity-60" />
              <p className="text-sm font-bold text-[#0F172A]">No customers found</p>
              <p className="text-xs text-[#64748B] mt-1">Try a different search query or add a new customer.</p>
            </div>
          ) : (
            filteredCustomers.map((cust) => {
              const isSelected = selectedCustomer?.id === cust.id;
              const hasDue = cust.payableAmount > 0;

              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-white border-[#2563EB] shadow-md ring-2 ring-[#2563EB]/10'
                      : 'bg-white border-[#DBEAFE] hover:border-[#2563EB]/50 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${
                      hasDue ? 'bg-[#CCFBF1] text-[#0D9488]' : 'bg-[#DBEAFE] text-[#2563EB]'
                    }`}>
                      {cust.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A]">{cust.name}</h4>
                      <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{cust.phone}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-sm font-extrabold ${hasDue ? 'text-[#0D9488]' : 'text-[#16A34A]'}`}>
                      {formatINR(cust.payableAmount)}
                    </p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                      hasDue ? 'bg-[#CCFBF1] text-[#0D9488]' : 'bg-[#DCFCE7] text-[#16A34A]'
                    }`}>
                      {hasDue ? 'Pending Due' : 'Settled'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Customer Details & Recent Ledgers */}
        {selectedCustomer && (
          <div className="lg:col-span-7 space-y-5">
            {/* Header Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#DBEAFE] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#DBEAFE]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#0F172A]">{selectedCustomer.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedCustomer.payableAmount > 0 ? 'bg-[#CCFBF1] text-[#0D9488]' : 'bg-[#DCFCE7] text-[#16A34A]'
                    }`}>
                      {selectedCustomer.payableAmount > 0 ? 'Due Account' : 'All Clear'}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1 flex items-center gap-2">
                    <span>{selectedCustomer.phone}</span>
                    <span>•</span>
                    <span>Account ID: {selectedCustomer.id}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenBatchHen && onOpenBatchHen(selectedCustomer)}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-[#CCFBF1] text-[#0D9488] hover:bg-[#CCFBF1]/80 transition cursor-pointer"
                  >
                    + Batch Hens
                  </button>
                  <button
                    onClick={() => onOpenPayment && onOpenPayment(selectedCustomer)}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-[#2563EB] text-white hover:bg-[#2563EB]/90 transition cursor-pointer"
                  >
                    + Record Payment
                  </button>
                </div>
              </div>

              {/* 3 Metrics Cards */}
              <div className="grid grid-cols-3 gap-3 pt-5">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DBEAFE] text-center">
                  <p className="text-[11px] font-medium text-[#64748B]">Total Billed</p>
                  <p className="text-base font-extrabold text-[#0F172A] mt-1">{formatINR(selectedCustomer.totalBilled)}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DBEAFE] text-center">
                  <p className="text-[11px] font-medium text-[#64748B]">Total Paid</p>
                  <p className="text-base font-extrabold text-[#16A34A] mt-1">{formatINR(selectedCustomer.paidAmount)}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DBEAFE] text-center">
                  <p className="text-[11px] font-bold text-[#0D9488]">Balance Due</p>
                  <p className="text-base font-black text-[#0D9488] mt-1">{formatINR(selectedCustomer.payableAmount)}</p>
                </div>
              </div>
            </div>

            {/* Hens Record List */}
            <div className="p-6 rounded-2xl bg-white border border-[#DBEAFE] shadow-xs">
              <h4 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center justify-between">
                <span>Intake Hens ({selectedCustomer.hens?.length || 0})</span>
                <span className="text-xs text-[#64748B] font-normal">Standard mandi rates applied</span>
              </h4>

              {(!selectedCustomer.hens || selectedCustomer.hens.length === 0) ? (
                <p className="text-xs text-[#64748B] italic py-4 text-center">No hens recorded yet for this customer.</p>
              ) : (
                <div className="divide-y divide-[#DBEAFE] max-h-60 overflow-y-auto">
                  {selectedCustomer.hens.map((h) => (
                    <div key={h.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          h.type === 'MARGA' ? 'bg-[#DBEAFE] text-[#2563EB]' : 'bg-[#CCFBF1] text-[#0D9488]'
                        }`}>
                          {h.type}
                        </span>
                        <span className="font-bold text-[#0F172A]">{h.henNumber}</span>
                        <span className="text-[#64748B]">{h.weight.toFixed(2)} kg @ ₹{h.rateApplied}/kg</span>
                      </div>
                      <span className="font-extrabold text-[#0F172A]">{formatINR(h.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payments History List */}
            <div className="p-6 rounded-2xl bg-white border border-[#DBEAFE] shadow-xs">
              <h4 className="text-sm font-bold text-[#0F172A] mb-3">Payment History ({selectedCustomer.payments?.length || 0})</h4>
              {(!selectedCustomer.payments || selectedCustomer.payments.length === 0) ? (
                <p className="text-xs text-[#64748B] italic py-4 text-center">No payments received yet.</p>
              ) : (
                <div className="divide-y divide-[#DBEAFE]">
                  {selectedCustomer.payments.map((p) => (
                    <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#0F172A]">{p.method} Payment</span>
                        <p className="text-[11px] text-[#64748B]">{p.date}</p>
                      </div>
                      <span className="font-extrabold text-[#16A34A]">+{formatINR(p.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Customer (Strictly NO address field as per spec) */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Customer Account"
      >
        <form onSubmit={handleSaveCustomer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Customer Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Patel"
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-sm font-semibold text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Mobile Contact Number *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-sm font-semibold text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-sm bg-[#2563EB] text-white hover:bg-[#2563EB]/90 transition cursor-pointer mt-2"
          >
            Register Customer
          </button>

          <p className="text-center text-xs text-[#64748B] italic">
            Address field omitted per requirement
          </p>
        </form>
      </Modal>
    </div>
  );
}

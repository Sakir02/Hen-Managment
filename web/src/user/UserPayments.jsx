import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { formatINR } from '../data/mockData';
import Modal from '../components/common/Modal';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  ArrowDownLeft,
  Filter,
  DollarSign,
  Receipt
} from 'lucide-react';

export default function UserPayments() {
  const { customers, metrics, addPayment } = useData();

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [filterMethod, setFilterMethod] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Form states
  const [amount, setAmount] = useState('3000');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState('UPI / QR');
  const [notes, setNotes] = useState('');

  // Aggregate all payments across customers
  const allPayments = customers.flatMap(c =>
    (c.payments || []).map(p => ({
      ...p,
      customerName: c.name,
      customerId: c.id
    }))
  );

  const filteredPayments = allPayments.filter(p => {
    const matchesSearch =
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.method && p.method.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMethod = filterMethod === 'ALL' || p.method === filterMethod;
    return matchesSearch && matchesMethod;
  });

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if (!selectedCustomerId) return;

    const success = addPayment({
      customerId: selectedCustomerId,
      amount,
      date,
      method,
      notes
    });

    if (success) {
      setIsPaymentModalOpen(false);
      setAmount('2000');
      setNotes('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A]">Payment Receipts & Billing</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Record market receipts, manage customer balance settlements, and audit payment methods.
          </p>
        </div>

        <button
          onClick={() => setIsPaymentModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0D9488] text-white hover:bg-[#0D9488]/90 transition cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Payment</span>
        </button>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#DBEAFE] shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-bold text-sm mb-3">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-[#64748B]">Total Collections Received</p>
          <p className="text-2xl font-extrabold text-[#16A34A] mt-1">{formatINR(metrics.totalPaid)}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#DBEAFE] shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#CCFBF1] text-[#0D9488] flex items-center justify-center mb-3">
            <Receipt className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-[#64748B]">Outstanding Market Due</p>
          <p className="text-2xl font-extrabold text-[#0D9488] mt-1">{formatINR(metrics.outstandingAmount)}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#DBEAFE] shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center mb-3">
            <CreditCard className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-[#64748B]">Settled Accounts</p>
          <p className="text-2xl font-extrabold text-[#0F172A] mt-1">
            {customers.length - metrics.dueCustomersCount} / {customers.length}
          </p>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white rounded-2xl border border-[#DBEAFE] shadow-xs overflow-hidden">
        {/* Table Filter Header */}
        <div className="p-4 border-b border-[#DBEAFE] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search customer or receipt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs font-medium text-[#0F172A] focus:bg-white focus:border-[#0D9488] outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {['ALL', 'UPI / QR', 'Cash', 'Bank Transfer'].map((m) => (
              <button
                key={m}
                onClick={() => setFilterMethod(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterMethod === m
                    ? 'bg-[#0D9488] text-white'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-bold border-b border-[#DBEAFE] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Receipt ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DBEAFE] text-[#0F172A] font-medium">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#64748B]">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-[#F8FAFC]/60 transition">
                    <td className="py-3.5 px-4 font-bold text-[#0F172A]">{pay.id}</td>
                    <td className="py-3.5 px-4 font-bold text-[#2563EB]">{pay.customerName}</td>
                    <td className="py-3.5 px-4 text-[#64748B]">{pay.date}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#DBEAFE] font-bold text-[11px] text-[#0F172A]">
                        {pay.method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#16A34A] flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Received</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-sm text-[#16A34A]">
                      +{formatINR(pay.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Record Payment Sheet */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Payment Receipt"
        subtitle="Receipt will instantly update customer's remaining balance"
      >
        <form onSubmit={handleConfirmPayment} className="space-y-4">
          {/* Customer Selection */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Select Customer Ledger *
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#0D9488] outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - Due: {formatINR(c.payableAmount)}
                </option>
              ))}
            </select>
          </div>

          {/* Mini Ledger Details */}
          {selectedCustomer && (
            <div className="grid grid-cols-3 gap-2 p-3 bg-[#F8FAFC] rounded-xl border border-[#DBEAFE] text-center">
              <div>
                <span className="text-[10px] text-[#64748B] font-medium block">Total Billed</span>
                <span className="text-xs font-bold text-[#0F172A]">{formatINR(selectedCustomer.totalBilled)}</span>
              </div>
              <div className="border-x border-[#DBEAFE]">
                <span className="text-[10px] text-[#64748B] font-medium block">Paid So Far</span>
                <span className="text-xs font-bold text-[#16A34A]">{formatINR(selectedCustomer.paidAmount)}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#0D9488] font-bold block">Current Due</span>
                <span className="text-xs font-black text-[#0D9488]">{formatINR(selectedCustomer.payableAmount)}</span>
              </div>
            </div>
          )}

          {/* Amount Received Input */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Payment Amount Received (₹) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-sm font-bold text-[#0F172A] focus:bg-white focus:border-[#0D9488] outline-none"
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Payment Method *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['UPI / QR', 'Cash', 'Bank Transfer'].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    method === m
                      ? 'bg-[#0D9488] text-white border-[#0D9488]'
                      : 'bg-[#F8FAFC] text-[#64748B] border-[#DBEAFE] hover:border-[#0D9488]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Receipt Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs font-semibold text-[#0F172A] focus:bg-white focus:border-[#0D9488] outline-none"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Reference / Note (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. UPI Ref: 394829384920"
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs font-medium text-[#0F172A] focus:bg-white focus:border-[#0D9488] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-sm bg-[#0D9488] text-white hover:bg-[#0D9488]/90 transition cursor-pointer shadow-xs mt-2"
          >
            Confirm & Save Payment Receipt
          </button>
        </form>
      </Modal>
    </div>
  );
}

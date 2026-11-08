import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatINR } from '../data/mockData';
import Modal from '../components/common/Modal';
import {
  Feather,
  Users,
  Plus,
  ChevronRight,
  CreditCard,
  Calendar,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Scale,
  Receipt,
  TrendingUp
} from 'lucide-react';

export default function UserDashboard({ onNavigateTab }) {
  const { currentUser, showToast } = useAuth();
  const { customers, rates, metrics, addCustomer, addBatchHens, addPayment } = useData();

  const [selectedCustomer, setSelectedCustomer] = useState(customers[0] || null);

  // Fast action modals
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isBatchHenOpen, setIsBatchHenOpen] = useState(false);
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);

  // Form states
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  // Batch Hen states (Rates derived from standard mandi rates)
  const [margaRows, setMargaRows] = useState([
    { id: 1, weight: '2.50' },
    { id: 2, weight: '2.30' }
  ]);
  const [margeeRows, setMargeeRows] = useState([
    { id: 3, weight: '1.80' },
    { id: 4, weight: '1.95' }
  ]);

  // Payment states
  const [paymentAmount, setPaymentAmount] = useState('2000');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR');

  // Add Customer Handler
  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) return;

    addCustomer({ name: newCustName, phone: newCustPhone });
    setNewCustName('');
    setNewCustPhone('');
    setIsAddCustomerOpen(false);
  };

  // Batch Hen Save Handler
  const handleSaveBatchHens = () => {
    const target = selectedCustomer || customers[0];
    if (!target) return;

    const success = addBatchHens({
      customerId: target.id,
      margaRows,
      margeeRows
    });

    if (success) {
      setIsBatchHenOpen(false);
      setMargaRows([{ id: Date.now() + 1, weight: '2.50' }]);
      setMargeeRows([{ id: Date.now() + 2, weight: '2.00' }]);
    }
  };

  // Payment Confirm Handler
  const handleConfirmPayment = (e) => {
    e.preventDefault();
    const target = selectedCustomer || customers[0];
    if (!target) return;

    const success = addPayment({
      customerId: target.id,
      amount: paymentAmount,
      date: paymentDate,
      method: paymentMethod
    });

    if (success) {
      setIsPaymentSheetOpen(false);
      setPaymentAmount('2000');
    }
  };

  const activeTarget = selectedCustomer || customers[0] || {};
  const modalMargaSum = margaRows.reduce((sum, r) => sum + ((parseFloat(r.weight) || 0) * rates.MARGA), 0);
  const modalMargeeSum = margeeRows.reduce((sum, r) => sum + ((parseFloat(r.weight) || 0) * rates.MARGEE), 0);

  return (
    <div className="space-y-6">
      {/* 1. Header Greeting & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#64748B]">Welcome Operator,</p>
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A]">
            {currentUser?.name || 'Rahul Kumar'}
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddCustomerOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#2563EB] text-white hover:bg-[#2563EB]/90 transition cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>

          <button
            onClick={() => setIsBatchHenOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#CCFBF1] text-[#0D9488] hover:bg-[#CCFBF1]/80 transition cursor-pointer border border-[#0D9488]/30"
          >
            <Plus className="w-4 h-4" />
            <span>Batch Hens</span>
          </button>
        </div>
      </div>

      {/* 2. 2-Column Summary Cards: Customers & Total Hens */}
      <div className="grid grid-cols-2 gap-4">
        <div
          onClick={() => onNavigateTab && onNavigateTab('customers')}
          className="p-5 rounded-2xl bg-white border border-[#DBEAFE] shadow-xs cursor-pointer hover:border-[#2563EB] transition"
        >
          <div className="w-10 h-10 rounded-full bg-[#CCFBF1] flex items-center justify-center text-[#0D9488] mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-[#64748B]">Total Customers</p>
          <p className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mt-1">
            {metrics.totalCustomers}
          </p>
        </div>

        <div
          onClick={() => onNavigateTab && onNavigateTab('hens')}
          className="p-5 rounded-2xl bg-white border border-[#DBEAFE] shadow-xs cursor-pointer hover:border-[#2563EB] transition"
        >
          <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center text-[#2563EB] mb-3 text-lg">
            <Feather className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-[#64748B]">Total Hens In Stock</p>
          <p className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mt-1">
            {metrics.totalHens.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 3. Solid Teal Outstanding Amount Card */}
      <div className="p-6 rounded-2xl bg-[#0D9488] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <p className="text-xs font-medium text-white/90">Market Outstanding Balance</p>
          <p className="text-2xl md:text-3xl font-extrabold mt-1 tracking-wide">
            {formatINR(metrics.outstandingAmount)}
          </p>
          <p className="text-[11px] text-white/80 mt-1">
            {metrics.dueCustomersCount} accounts with pending dues
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCustomer(customers[0]);
            setIsPaymentSheetOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-[#0D9488] hover:bg-white/90 transition cursor-pointer self-start sm:self-auto shadow-xs"
        >
          Record Payment
        </button>
      </div>

      {/* 4. Active Mandi Rates Banner (Read-only) */}
      <div className="p-4 rounded-2xl bg-white border border-[#DBEAFE] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#2563EB]" />
          <span className="font-bold text-[#0F172A]">Today's Authorized Mandi Rates:</span>
          <span className="bg-[#DBEAFE] text-[#2563EB] font-bold px-2 py-0.5 rounded-md">
            Marga ₹{rates.MARGA.toFixed(2)}/kg
          </span>
          <span className="bg-[#CCFBF1] text-[#0D9488] font-bold px-2 py-0.5 rounded-md">
            Margee ₹{rates.MARGEE.toFixed(2)}/kg
          </span>
        </div>
        <span className="text-[11px] text-[#64748B]">
          Updated: {rates.lastUpdated}
        </span>
      </div>

      {/* 5. Customer Ledger Preview (Top 4) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0F172A]">Recent Customer Ledgers</h3>
          <button
            onClick={() => onNavigateTab && onNavigateTab('customers')}
            className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({customers.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {customers.slice(0, 4).map((cust) => {
            const hasDue = cust.payableAmount > 0;
            return (
              <div
                key={cust.id}
                onClick={() => {
                  setSelectedCustomer(cust);
                  if (onNavigateTab) onNavigateTab('customers');
                }}
                className="p-4 rounded-xl bg-white border border-[#DBEAFE] hover:border-[#2563EB] transition cursor-pointer flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#DBEAFE] text-[#2563EB] font-bold flex items-center justify-center text-xs">
                    {cust.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition">
                      {cust.name}
                    </h4>
                    <p className="text-[11px] text-[#64748B]">{cust.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {hasDue ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#CCFBF1] text-[#0D9488]">
                      Due: {formatINR(cust.payableAmount)}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A]">
                      Settled
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-[#2563EB] transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal 1: Add Customer */}
      <Modal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        title="Add Customer"
      >
        <form onSubmit={handleSaveCustomer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Customer Name *
            </label>
            <input
              type="text"
              value={newCustName}
              onChange={(e) => setNewCustName(e.target.value)}
              placeholder="Enter customer name"
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-sm font-semibold text-[#0F172A] focus:bg-white focus:border-[#2563EB] transition outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Mobile Number *
            </label>
            <input
              type="tel"
              value={newCustPhone}
              onChange={(e) => setNewCustPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-sm font-semibold text-[#0F172A] focus:bg-white focus:border-[#2563EB] transition outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-sm bg-[#2563EB] text-white hover:bg-[#2563EB]/90 transition cursor-pointer mt-2"
          >
            Save Customer
          </button>

          <p className="text-center text-xs text-[#64748B] italic">
            Address field omitted per requirement
          </p>
        </form>
      </Modal>

      {/* Modal 2: Batch Add Hens (Display Only Standard Rates) */}
      <Modal
        isOpen={isBatchHenOpen}
        onClose={() => setIsBatchHenOpen(false)}
        title="Add Hen (Combined Marga & Margee)"
        subtitle={`Customer: ${activeTarget?.name || 'Customer'}`}
        maxWidth="max-w-lg"
      >
        <div className="space-y-5">
          {/* Marga Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                  Marga Section
                </span>
                <span className="text-[10px] bg-[#DBEAFE] text-[#2563EB] font-bold px-1.5 py-0.5 rounded">
                  ₹{rates.MARGA}/kg
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMargaRows([...margaRows, { id: Date.now(), weight: '2.50' }])}
                className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
              >
                + Add Marga
              </button>
            </div>
            <div className="space-y-2">
              {margaRows.map((r, i) => (
                <div key={r.id} className="flex items-center gap-2 p-2 rounded-lg bg-[#F8FAFC] border border-[#DBEAFE]">
                  <span className="text-xs font-bold text-[#0F172A] w-12">H00{i + 1}</span>
                  <input
                    type="number"
                    step="0.01"
                    value={r.weight}
                    onChange={(e) => {
                      const updated = [...margaRows];
                      updated[i].weight = e.target.value;
                      setMargaRows(updated);
                    }}
                    placeholder="Weight (kg)"
                    className="flex-1 px-3 py-1.5 text-xs font-bold bg-white border border-[#DBEAFE] rounded-md outline-none focus:border-[#2563EB]"
                  />
                  <span className="text-xs text-[#64748B]">kg</span>
                  <span className="text-xs font-bold text-[#0F172A] w-20 text-right">
                    {formatINR((parseFloat(r.weight) || 0) * rates.MARGA)}
                  </span>
                  {margaRows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setMargaRows(margaRows.filter(row => row.id !== r.id))}
                      className="p-1 text-[#DC2626] hover:bg-[#FEE2E2] rounded-md cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Margee Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
                  Margee Section
                </span>
                <span className="text-[10px] bg-[#CCFBF1] text-[#0D9488] font-bold px-1.5 py-0.5 rounded">
                  ₹{rates.MARGEE}/kg
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMargeeRows([...margeeRows, { id: Date.now(), weight: '2.00' }])}
                className="text-xs font-bold text-[#0D9488] hover:underline cursor-pointer"
              >
                + Add Margee
              </button>
            </div>
            <div className="space-y-2">
              {margeeRows.map((r, i) => (
                <div key={r.id} className="flex items-center gap-2 p-2 rounded-lg bg-[#F8FAFC] border border-[#DBEAFE]">
                  <span className="text-xs font-bold text-[#0F172A] w-12">H00{i + 1 + margaRows.length}</span>
                  <input
                    type="number"
                    step="0.01"
                    value={r.weight}
                    onChange={(e) => {
                      const updated = [...margeeRows];
                      updated[i].weight = e.target.value;
                      setMargeeRows(updated);
                    }}
                    placeholder="Weight (kg)"
                    className="flex-1 px-3 py-1.5 text-xs font-bold bg-white border border-[#DBEAFE] rounded-md outline-none focus:border-[#0D9488]"
                  />
                  <span className="text-xs text-[#64748B]">kg</span>
                  <span className="text-xs font-bold text-[#0F172A] w-20 text-right">
                    {formatINR((parseFloat(r.weight) || 0) * rates.MARGEE)}
                  </span>
                  {margeeRows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setMargeeRows(margeeRows.filter(row => row.id !== r.id))}
                      className="p-1 text-[#DC2626] hover:bg-[#FEE2E2] rounded-md cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#DBEAFE]/40 border border-[#DBEAFE] flex items-center justify-between text-xs">
            <span className="font-bold text-[#0F172A]">Total Batch Value:</span>
            <span className="font-extrabold text-[#2563EB] text-sm">
              {formatINR(modalMargaSum + modalMargeeSum)}
            </span>
          </div>

          <button
            onClick={handleSaveBatchHens}
            className="w-full py-3 rounded-xl font-bold text-sm bg-[#2563EB] text-white hover:bg-[#2563EB]/90 transition cursor-pointer shadow-xs"
          >
            Save All Hens
          </button>
        </div>
      </Modal>

      {/* Modal 3: Payment Sheet */}
      <Modal
        isOpen={isPaymentSheetOpen}
        onClose={() => setIsPaymentSheetOpen(false)}
        title="Add Payment"
        subtitle={`Customer: ${activeTarget?.name || 'Customer'}`}
      >
        <form onSubmit={handleConfirmPayment} className="space-y-4">
          <div className="grid grid-cols-3 gap-2 p-3 bg-[#F8FAFC] rounded-xl border border-[#DBEAFE]">
            <div className="text-center">
              <span className="text-[10px] text-[#64748B] block font-medium">Total</span>
              <span className="text-xs font-bold text-[#0F172A]">{formatINR(activeTarget?.totalBilled || 0)}</span>
            </div>
            <div className="text-center border-x border-[#DBEAFE]">
              <span className="text-[10px] text-[#64748B] block font-medium">Paid</span>
              <span className="text-xs font-bold text-[#16A34A]">{formatINR(activeTarget?.paidAmount || 0)}</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-[#0D9488] block font-bold">Payable</span>
              <span className="text-xs font-bold text-[#0D9488]">{formatINR(activeTarget?.payableAmount || 0)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Amount Received *
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm font-bold text-[#64748B]">₹</span>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="2000"
                className="w-full pl-8 pr-4 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-sm font-bold text-[#0F172A] focus:bg-white focus:border-[#0D9488] outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Payment Method *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['UPI / QR', 'Cash', 'Bank Transfer'].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    paymentMethod === m
                      ? 'bg-[#0D9488] text-white border-[#0D9488]'
                      : 'bg-[#F8FAFC] text-[#64748B] border-[#DBEAFE] hover:border-[#0D9488]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Receipt Date
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs font-semibold text-[#0F172A] focus:bg-white focus:border-[#0D9488] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-sm bg-[#0D9488] text-white hover:bg-[#0D9488]/90 transition cursor-pointer shadow-xs mt-2"
          >
            Confirm Payment
          </button>
        </form>
      </Modal>
    </div>
  );
}

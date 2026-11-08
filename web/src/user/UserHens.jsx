import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { formatINR } from '../data/mockData';
import Modal from '../components/common/Modal';
import {
  Feather,
  Plus,
  Search,
  Filter,
  Trash2,
  Scale,
  Calendar,
  AlertCircle,
  Tag
} from 'lucide-react';

export default function UserHens() {
  const { customers, rates, addBatchHens } = useData();

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'MARGA' | 'MARGEE'
  const [searchQuery, setSearchQuery] = useState('');
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // Batch Intake Rows (Rates are strictly derived, NOT user-typed)
  const [margaRows, setMargaRows] = useState([
    { id: 1, weight: '2.50' },
    { id: 2, weight: '2.30' }
  ]);
  const [margeeRows, setMargeeRows] = useState([
    { id: 3, weight: '1.80' },
    { id: 4, weight: '1.95' }
  ]);

  // Aggregate all hens across all customers
  const allHens = customers.flatMap(c =>
    (c.hens || []).map(h => ({
      ...h,
      customerName: c.name,
      customerId: c.id
    }))
  );

  const filteredHens = allHens.filter(h => {
    const matchesSearch =
      h.henNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'ALL' || h.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalWeight = filteredHens.reduce((sum, h) => sum + (h.weight || 0), 0);
  const totalValue = filteredHens.reduce((sum, h) => sum + (h.amount || 0), 0);

  const handleSaveBatch = () => {
    if (!selectedCustomerId) return;
    const success = addBatchHens({
      customerId: selectedCustomerId,
      margaRows,
      margeeRows
    });
    if (success) {
      setIsBatchModalOpen(false);
      // Reset rows to defaults
      setMargaRows([{ id: Date.now() + 1, weight: '2.50' }]);
      setMargeeRows([{ id: Date.now() + 2, weight: '2.00' }]);
    }
  };

  // Preview total for modal
  const modalMargaSum = margaRows.reduce((sum, r) => sum + ((parseFloat(r.weight) || 0) * rates.MARGA), 0);
  const modalMargeeSum = margeeRows.reduce((sum, r) => sum + ((parseFloat(r.weight) || 0) * rates.MARGEE), 0);
  const modalBatchTotal = modalMargaSum + modalMargeeSum;

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A]">Hens Inventory & Weigh-in</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time batch weigh-ins with authorized Mandi standard rates.
          </p>
        </div>

        <button
          onClick={() => setIsBatchModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#2563EB] text-white hover:bg-[#2563EB]/90 transition cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Batch Hen Intake</span>
        </button>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#DBEAFE] shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold text-sm mb-3">
            <Feather className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-[#64748B]">Total Hens Recorded</p>
          <p className="text-2xl font-extrabold text-[#0F172A] mt-1">{filteredHens.length} birds</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#DBEAFE] shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#CCFBF1] text-[#0D9488] flex items-center justify-center mb-3">
            <Scale className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-[#64748B]">Total Net Weight</p>
          <p className="text-2xl font-extrabold text-[#0F172A] mt-1">{totalWeight.toFixed(2)} kg</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#DBEAFE] shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center mb-3">
            <Tag className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-[#64748B]">Current Mandi Valuation</p>
          <p className="text-2xl font-extrabold text-[#0F172A] mt-1">{formatINR(totalValue)}</p>
        </div>
      </div>

      {/* Standard Rates Read-Only Ticker Banner (Admin-only hen price per kg rule) */}
      <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#DBEAFE] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#0F172A]">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="font-bold">Active Mandi Benchmark:</span>
          <span className="bg-white border border-[#DBEAFE] px-2.5 py-1 rounded-lg font-bold text-[#2563EB]">
            Marga (Male): ₹{rates.MARGA.toFixed(2)} / kg
          </span>
          <span className="bg-white border border-[#DBEAFE] px-2.5 py-1 rounded-lg font-bold text-[#0D9488]">
            Margee (Female): ₹{rates.MARGEE.toFixed(2)} / kg
          </span>
        </div>
        <p className="text-[11px] text-[#64748B] italic">
          Standard rates configured by Administrator (Display Only)
        </p>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white rounded-2xl border border-[#DBEAFE] shadow-xs overflow-hidden">
        {/* Table Filter Header */}
        <div className="p-4 border-b border-[#DBEAFE] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search hen ID or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs font-medium text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {['ALL', 'MARGA', 'MARGEE'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterType === t
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-bold border-b border-[#DBEAFE] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Hen ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Weight (kg)</th>
                <th className="py-3 px-4 text-right">Standard Rate</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DBEAFE] text-[#0F172A] font-medium">
              {filteredHens.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#64748B]">
                    No hens match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredHens.map((hen) => (
                  <tr key={hen.id} className="hover:bg-[#F8FAFC]/60 transition">
                    <td className="py-3.5 px-4 font-bold text-[#0F172A]">{hen.henNumber}</td>
                    <td className="py-3.5 px-4 text-[#64748B]">{hen.customerName}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        hen.type === 'MARGA' ? 'bg-[#DBEAFE] text-[#2563EB]' : 'bg-[#CCFBF1] text-[#0D9488]'
                      }`}>
                        {hen.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold">{hen.weight.toFixed(2)} kg</td>
                    <td className="py-3.5 px-4 text-right text-[#64748B]">₹{hen.rateApplied.toFixed(2)} / kg</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-[#0F172A]">
                      {formatINR(hen.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Batch Hen Intake (Combined Marga & Margee with Read-only Rate) */}
      <Modal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        title="Batch Hen Intake (Marga & Margee)"
        subtitle="Standard wholesale mandi rates are applied automatically"
        maxWidth="max-w-xl"
      >
        <div className="space-y-5">
          {/* Customer Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Select Customer Ledger *
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone}) - Due: {formatINR(c.payableAmount)}
                </option>
              ))}
            </select>
          </div>

          {/* Marga (Male) Section */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DBEAFE] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                  Marga (Male)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DBEAFE] text-[#2563EB]">
                  ₹{rates.MARGA.toFixed(2)} / kg (Fixed Rate)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMargaRows([...margaRows, { id: Date.now(), weight: '2.50' }])}
                className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
              >
                + Add Marga Row
              </button>
            </div>

            <div className="space-y-2">
              {margaRows.map((r, i) => {
                const w = parseFloat(r.weight) || 0;
                const calcAmt = w * rates.MARGA;
                return (
                  <div key={r.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#DBEAFE]">
                    <span className="text-xs font-bold text-[#0F172A] w-12">H00{i + 1}</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Weight (kg)"
                      value={r.weight}
                      onChange={(e) => {
                        const updated = [...margaRows];
                        updated[i].weight = e.target.value;
                        setMargaRows(updated);
                      }}
                      className="flex-1 px-3 py-1.5 text-xs font-bold bg-[#F8FAFC] border border-[#DBEAFE] rounded-md outline-none focus:border-[#2563EB]"
                    />
                    <span className="text-xs text-[#64748B]">kg</span>
                    <span className="text-xs font-bold text-[#0F172A] w-24 text-right">
                      {formatINR(calcAmt)}
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
                );
              })}
            </div>
          </div>

          {/* Margee (Female) Section */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DBEAFE] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0D9488] uppercase tracking-wider">
                  Margee (Female)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#CCFBF1] text-[#0D9488]">
                  ₹{rates.MARGEE.toFixed(2)} / kg (Fixed Rate)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMargeeRows([...margeeRows, { id: Date.now(), weight: '2.00' }])}
                className="text-xs font-bold text-[#0D9488] hover:underline cursor-pointer"
              >
                + Add Margee Row
              </button>
            </div>

            <div className="space-y-2">
              {margeeRows.map((r, i) => {
                const w = parseFloat(r.weight) || 0;
                const calcAmt = w * rates.MARGEE;
                return (
                  <div key={r.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#DBEAFE]">
                    <span className="text-xs font-bold text-[#0F172A] w-12">H00{i + 1 + margaRows.length}</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Weight (kg)"
                      value={r.weight}
                      onChange={(e) => {
                        const updated = [...margeeRows];
                        updated[i].weight = e.target.value;
                        setMargeeRows(updated);
                      }}
                      className="flex-1 px-3 py-1.5 text-xs font-bold bg-[#F8FAFC] border border-[#DBEAFE] rounded-md outline-none focus:border-[#0D9488]"
                    />
                    <span className="text-xs text-[#64748B]">kg</span>
                    <span className="text-xs font-bold text-[#0F172A] w-24 text-right">
                      {formatINR(calcAmt)}
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
                );
              })}
            </div>
          </div>

          {/* Batch Summary */}
          <div className="p-3.5 rounded-xl bg-[#DBEAFE]/40 border border-[#DBEAFE] flex items-center justify-between text-xs">
            <span className="font-bold text-[#0F172A]">
              Total Birds: {margaRows.length + margeeRows.length}
            </span>
            <span className="font-extrabold text-[#2563EB] text-sm">
              Batch Amount: {formatINR(modalBatchTotal)}
            </span>
          </div>

          <button
            onClick={handleSaveBatch}
            className="w-full py-3 rounded-xl font-bold text-sm bg-[#2563EB] text-white hover:bg-[#2563EB]/90 transition cursor-pointer shadow-xs"
          >
            Confirm & Save Batch to Ledger
          </button>
        </div>
      </Modal>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { initialRates } from '../data/mockData';
import {
  FileSpreadsheet,
  Save,
  Scale,
  Shield
} from 'lucide-react';

export default function AdminSettings() {
  const { showToast } = useAuth();
  const [smsReceipts, setSmsReceipts] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [requirePinOnPayment, setRequirePinOnPayment] = useState(true);
  const [currencyUnit, setCurrencyUnit] = useState('INR (₹)');
  const [weightUnit, setWeightUnit] = useState('Kilograms (kg)');

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Admin system settings saved successfully!');
  };

  const handleExportData = () => {
    showToast('Exporting enterprise ledger CSV to downloads folder...', 'info');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-[#0F172A]">System Settings</h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Configure global mandi calculation standards, operator security, and automated backups.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Global Mandi & Calculation Rules */}
        <div className="bg-white rounded-2xl border border-[#DBEAFE] p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#DBEAFE]">
            <div className="p-2 rounded-lg bg-[#DBEAFE] text-[#2563EB]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Mandi Valuation & Measurement Defaults</h3>
              <p className="text-[11px] text-[#64748B]">Units applied across all operator weighing handhelds</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                Currency Unit
              </label>
              <select
                value={currencyUnit}
                onChange={(e) => setCurrencyUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs font-semibold text-[#0F172A]"
              >
                <option value="INR (₹)">INR (₹) - Indian Rupee</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                Standard Weight Unit
              </label>
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs font-semibold text-[#0F172A]"
              >
                <option value="Kilograms (kg)">Kilograms (kg)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Automated Notifications & Operator Security */}
        <div className="bg-white rounded-2xl border border-[#DBEAFE] p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#DBEAFE]">
            <div className="p-2 rounded-lg bg-[#CCFBF1] text-[#0D9488]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Operational Controls & Audit</h3>
              <p className="text-[11px] text-[#64748B]">Rules applied to field intake and customer payment receipts</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {/* SMS Receipts */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DBEAFE]">
              <div>
                <p className="text-xs font-bold text-[#0F172A]">Automated SMS Receipts</p>
                <p className="text-[11px] text-[#64748B]">Dispatch instant SMS payment confirmation to customer mobile</p>
              </div>
              <button
                type="button"
                onClick={() => setSmsReceipts(!smsReceipts)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                  smsReceipts ? 'bg-[#0D9488]' : 'bg-[#DBEAFE]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    smsReceipts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Daily Cloud DB Backup */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DBEAFE]">
              <div>
                <p className="text-xs font-bold text-[#0F172A]">Automated Daily Backup</p>
                <p className="text-[11px] text-[#64748B]">Snapshot batch ledger, customers, and payment logs every midnight</p>
              </div>
              <button
                type="button"
                onClick={() => setAutoBackup(!autoBackup)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                  autoBackup ? 'bg-[#0D9488]' : 'bg-[#DBEAFE]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    autoBackup ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Operator PIN confirmation */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DBEAFE]">
              <div>
                <p className="text-xs font-bold text-[#0F172A]">Require PIN on Ledger Settlements</p>
                <p className="text-[11px] text-[#64748B]">Field operators must re-enter security PIN before recording cash receipts</p>
              </div>
              <button
                type="button"
                onClick={() => setRequirePinOnPayment(!requirePinOnPayment)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                  requirePinOnPayment ? 'bg-[#0D9488]' : 'bg-[#DBEAFE]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    requirePinOnPayment ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Export & Database Actions */}
        <div className="bg-white rounded-2xl border border-[#DBEAFE] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">Enterprise Ledger Export</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Download complete batch inventory, weighing slips, and financial dues in CSV format.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportData}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#DBEAFE] text-[#2563EB] hover:bg-[#DBEAFE]/80 transition cursor-pointer shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl font-bold text-xs bg-[#2563EB] text-white hover:bg-[#2563EB]/90 transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save System Settings</span>
        </button>
      </form>
    </div>
  );
}

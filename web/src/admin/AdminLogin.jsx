import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLogin({ onSwitchToUser }) {
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState('priya.sharma@henoperations.com');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = (e) => {
    e.preventDefault();
    loginAdmin(email, password);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#DBEAFE] p-8">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0D9488] flex items-center justify-center text-white font-extrabold text-2xl shadow-sm mb-3">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Admin Console</h2>
          <p className="text-xs font-semibold text-[#0D9488] tracking-wider uppercase mt-1">
            Enterprise Command Center
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
              Administrator Email *
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-[#64748B]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-sm font-semibold text-[#0F172A] focus:border-[#0D9488] focus:bg-white transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
              Password *
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-[#64748B]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-sm font-semibold text-[#0F172A] focus:border-[#0D9488] focus:bg-white transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-[#0D9488] text-white hover:bg-[#0D9488]/90 transition cursor-pointer flex items-center justify-center gap-2 shadow-sm mt-2"
          >
            <span>Sign In to Admin Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#DBEAFE] text-center">
          <p className="text-xs text-[#64748B] mb-2 font-medium">Field Operator?</p>
          <button
            onClick={onSwitchToUser}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#2563EB]/80 cursor-pointer"
          >
            <span>Open Field User Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
}

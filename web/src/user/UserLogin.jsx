import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function UserLogin({ onSwitchToAdmin }) {
  const { loginUser } = useAuth();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState(['3', '9', '1', '8']);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep('otp');
    }
  };

  const handleOtpChange = (index, val) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    loginUser(phone, otp.join(''));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#DBEAFE] p-8">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#2563EB] flex items-center justify-center text-white font-extrabold text-2xl shadow-sm mb-3">
            JV
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Hen Management</h2>
          <p className="text-xs font-semibold text-[#0D9488] tracking-wider uppercase mt-1">
            Smart Poultry Field Portal
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                Mobile Number *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-sm font-semibold text-[#64748B] flex items-center gap-1.5 border-r border-[#DBEAFE] pr-2.5">
                  <Phone className="w-4 h-4 text-[#2563EB]" />
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-24 pr-4 py-3 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-sm font-semibold text-[#0F172A] focus:border-[#2563EB] focus:bg-white transition"
                  placeholder="98765 43210"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-[#2563EB] text-white hover:bg-[#2563EB]/90 transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-[#0F172A]">Verify OTP</h3>
              <p className="text-xs text-[#64748B] mt-1">
                Enter the 4-digit verification code sent to <br />
                <span className="font-semibold text-[#0F172A]">+91 {phone}</span>
              </p>
            </div>

            <div className="flex justify-center gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-12 h-14 text-center text-xl font-bold bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-[#0F172A] focus:border-[#2563EB] focus:bg-white transition"
                />
              ))}
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-xs text-[#2563EB] hover:underline font-semibold"
              >
                Change mobile number?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-[#2563EB] text-white hover:bg-[#2563EB]/90 transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Continue</span>
            </button>
          </form>
        )}

        {/* Quick Demo Switcher */}
        <div className="mt-8 pt-6 border-t border-[#DBEAFE] text-center">
          <p className="text-xs text-[#64748B] mb-2 font-medium">Administrator Access?</p>
          <button
            onClick={onSwitchToAdmin}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D9488] hover:text-[#0D9488]/80 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Open Admin Command Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
}

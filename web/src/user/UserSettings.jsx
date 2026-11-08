import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Wifi, Lock, Shield, Check } from 'lucide-react';

export default function UserSettings() {
  const { showToast } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [offlineSync, setOfflineSync] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    showToast('User preferences saved successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-[#DBEAFE] p-6 shadow-xs">
        <h2 className="text-lg font-bold text-[#0F172A] mb-1">Operator Preferences</h2>
        <p className="text-xs text-[#64748B] mb-6">
          Configure weighing alerts, offline synchronization, and handheld credentials.
        </p>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DBEAFE]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#DBEAFE] text-[#2563EB]">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0F172A]">Push Notifications</p>
                  <p className="text-[11px] text-[#64748B]">Daily Mandi rate updates and batch alerts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                  notifications ? 'bg-[#2563EB]' : 'bg-[#DBEAFE]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    notifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DBEAFE]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#CCFBF1] text-[#0D9488]">
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0F172A]">Offline Weighing Sync</p>
                  <p className="text-[11px] text-[#64748B]">Automatically cache batch entries without active WiFi</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOfflineSync(!offlineSync)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                  offlineSync ? 'bg-[#0D9488]' : 'bg-[#DBEAFE]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    offlineSync ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Quick PIN Reset */}
          <div className="pt-4 border-t border-[#DBEAFE] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Security PIN
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-1">
                  Current PIN
                </label>
                <input
                  type="password"
                  defaultValue="1234"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs font-bold text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-1">
                  New 4-Digit PIN
                </label>
                <input
                  type="password"
                  placeholder="••••"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs font-bold text-[#0F172A]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-xs bg-[#2563EB] text-white hover:bg-[#2563EB]/90 transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </form>
      </div>
    </div>
  );
}

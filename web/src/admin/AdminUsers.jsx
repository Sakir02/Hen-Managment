import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { initialStaffUsers } from '../data/mockData';
import Modal from '../components/common/Modal';
import { UserPlus, Search } from 'lucide-react';

export default function AdminUsers() {
  const { showToast } = useAuth();
  const [users, setUsers] = useState(initialStaffUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Field Operator');

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        showToast(`${u.name} is now ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser = {
      id: `usr-${Date.now().toString().slice(-3)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+91 98000 00000',
      role,
      status: 'ACTIVE',
      avatar: name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      joinedDate: 'Just now'
    };

    setUsers([...users, newUser]);
    setName('');
    setEmail('');
    setPhone('');
    setIsAddUserModalOpen(false);
    showToast(`Staff account for ${newUser.name} created!`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Header & Search (Prototype Screen 18) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A]">Manage Users</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Operator directory, system permissions, and operational status controls.
          </p>
        </div>

        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#2563EB] text-white hover:bg-[#2563EB]/90 transition cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add User</span>
        </button>
      </div>

      {/* 2. Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#64748B]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DBEAFE] rounded-xl text-xs font-semibold text-[#0F172A] focus:border-[#2563EB] shadow-xs"
        />
      </div>

      {/* 3. Users List (Prototype Screen 18 cards) */}
      <div className="space-y-3">
        {filteredUsers.map((user) => {
          const isActive = user.status === 'ACTIVE';
          return (
            <div
              key={user.id}
              className="p-4 rounded-xl bg-white border border-[#DBEAFE] hover:border-[#2563EB]/40 transition flex items-center justify-between shadow-2xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#DBEAFE] border border-[#2563EB] flex items-center justify-center text-[#2563EB] font-bold text-sm shrink-0">
                  {user.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#0F172A]">{user.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F8FAFC] border border-[#DBEAFE] text-[#64748B]">
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">{user.phone} • {user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleStatus(user.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-[#CCFBF1] text-[#16A34A] hover:bg-[#CCFBF1]/80'
                      : 'bg-[#DBEAFE] text-[#64748B] hover:bg-[#DBEAFE]/80'
                  }`}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Add Staff User"
        subtitle="Create handheld operator or administrative console login"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Patel"
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs font-semibold text-[#0F172A] focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ramesh.patel@henoperations.com"
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs font-semibold text-[#0F172A] focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">Mobile Phone *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98234 56781"
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs font-semibold text-[#0F172A] focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">Assigned Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs font-semibold text-[#0F172A]"
            >
              <option value="Field Operator">Field Operator</option>
              <option value="Admin">Admin</option>
              <option value="Billing Auditor">Billing Auditor</option>
              <option value="Farm Manager">Farm Manager</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-xs bg-[#2563EB] text-white hover:bg-[#2563EB]/90 transition cursor-pointer shadow-xs mt-2"
          >
            Create Staff Account
          </button>
        </form>
      </Modal>
    </div>
  );
}

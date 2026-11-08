import React, { useState } from 'react';
import { Search, UserPlus, Edit2, Power, CheckCircle, XCircle } from 'lucide-react';

export default function UserManagementPage({
  users,
  roles,
  onOpenAddUserModal,
  onEditUser,
  onToggleUserStatus
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };

  return (
    <div className="fade-in">
      {/* Title Bar */}
      <div className="page-title-row">
        <div className="page-title-group">
          <h1>Staff User Directory</h1>
          <p>Manage staff accounts, assign operational roles, and enforce login permissions.</p>
        </div>
        <button className="btn-primary-cta" onClick={onOpenAddUserModal}>
          <UserPlus size={16} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-toolbar">
        <div className="filter-left-controls">
          {/* Search Box */}
          <div className="search-input-wrap">
            <Search size={16} className="search-icon-pos" />
            <input
              type="text"
              className="search-field-styled"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <select
            className="select-filter-styled"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles ({roles.length})</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="select-filter-styled"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredUsers.length}</strong> of {users.length} staff members
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Contact Details</th>
              <th>Assigned Role</th>
              <th>Assigned Customers</th>
              <th>Status</th>
              <th>Last Active</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                {/* User Info */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: 'var(--radius-full)',
                      backgroundColor: user.status === 'ACTIVE' ? 'var(--primary-light)' : '#F3F4F6',
                      color: user.status === 'ACTIVE' ? 'var(--primary-dark)' : '#6B7280',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '700', fontSize: '13px', flexShrink: 0
                    }}>
                      {user.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{user.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        ID: {user.id}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td>
                  <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>{user.email}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.phone}</div>
                </td>

                {/* Role Badge */}
                <td>
                  <span className={`role-badge ${user.role === 'SUPER_ADMIN' ? 'role-super-admin' : ''}`}>
                    {getRoleName(user.role)}
                  </span>
                </td>

                {/* Customers */}
                <td>
                  <span style={{ fontWeight: '600' }}>{user.assignedCustomersCount}</span> customers
                </td>

                {/* Status */}
                <td>
                  <span className={`status-pill ${user.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                    {user.status === 'ACTIVE' ? (
                      <CheckCircle size={12} color="var(--success)" />
                    ) : (
                      <XCircle size={12} color="#6B7280" />
                    )}
                    {user.status}
                  </span>
                </td>

                {/* Last Active */}
                <td>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {user.lastLogin}
                  </span>
                </td>

                {/* Action Buttons */}
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button
                      className="table-action-btn"
                      onClick={() => onEditUser(user)}
                      title="Edit User Details"
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>

                    {user.role !== 'SUPER_ADMIN' && (
                      <button
                        className="table-action-btn"
                        style={{
                          color: user.status === 'ACTIVE' ? 'var(--danger)' : 'var(--success)',
                          borderColor: user.status === 'ACTIVE' ? '#FCA5A5' : '#86EFAC'
                        }}
                        onClick={() => onToggleUserStatus(user.id)}
                        title={user.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
                      >
                        <Power size={13} />
                        <span>{user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  No staff accounts found matching your search and filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

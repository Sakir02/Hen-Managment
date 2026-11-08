import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Shield } from 'lucide-react';

export default function UserFormModal({
  isOpen,
  onClose,
  onSave,
  roles,
  editingUser = null
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'FIELD_OPERATOR',
    status: 'ACTIVE'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
        status: editingUser.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '+91 ',
        role: 'FIELD_OPERATOR',
        status: 'ACTIVE'
      });
    }
    setErrors({});
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 8) errs.phone = 'Valid phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...formData,
      id: editingUser ? editingUser.id : `usr-${Date.now().toString().slice(-4)}`,
      avatar: formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      lastLogin: editingUser ? editingUser.lastLogin : 'Never',
      assignedCustomersCount: editingUser ? editingUser.assignedCustomersCount : 0
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-bar">
          <h2 className="modal-title">
            {editingUser ? 'Edit Staff User' : 'Add New Staff Member'}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '38px' }}
                  placeholder="e.g. Ramesh Patel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <User size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              </div>
              {errors.name && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.name}</span>}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label className="form-label">Email Address (Username)</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="email"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '38px' }}
                  placeholder="ramesh.patel@poultryfarm.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Mail size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              </div>
              {errors.email && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.email}</span>}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label">Mobile Phone Number</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '38px' }}
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Phone size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              </div>
              {errors.phone && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.phone}</span>}
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">Assigned Role</label>
              <select
                className="form-input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <span className="form-hint">
                Determines operational access to customer profiles, rates, and weighing actions.
              </span>
            </div>

            {/* Status Toggle */}
            <div className="form-group">
              <label className="form-label">Account Status</label>
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === 'ACTIVE'}
                    onChange={() => setFormData({ ...formData, status: 'ACTIVE' })}
                    style={{ accentColor: 'var(--success)' }}
                  />
                  <span>Active (Can sign in)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === 'INACTIVE'}
                    onChange={() => setFormData({ ...formData, status: 'INACTIVE' })}
                    style={{ accentColor: 'var(--danger)' }}
                  />
                  <span>Inactive (Suspended)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer-bar">
            <button type="button" className="btn-secondary-cta" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-cta">
              {editingUser ? 'Save Changes' : 'Create User Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

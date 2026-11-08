import React, { useState } from 'react';
import { X, Smartphone, Eye, Lock, EyeOff, ShieldCheck, Check } from 'lucide-react';

export default function RoleSimulatorDrawer({
  isOpen,
  onClose,
  roles,
  fieldPermissions
}) {
  const [selectedRole, setSelectedRole] = useState('FIELD_OPERATOR');

  if (!isOpen) return null;

  // Helper to get rule for a field
  const getRule = (fieldId) => {
    const perm = fieldPermissions.find(p => p.fieldId === fieldId);
    return perm?.rules[selectedRole] || 'read';
  };

  // Sample data to simulate
  const sampleCustomer = {
    name: 'National Poultry Feed & Birds',
    phone: '+91 98234 56781',
    address: 'Shed No. 12, Industrial Area, Mandi Bypass',
    notes: 'Approved credit limit ₹50,000. Frequent payment delays during month-end.'
  };

  const sampleHen = {
    type: 'Marga (Male)',
    weight: '3.620 kg',
    rateApplied: '₹260.00 / kg',
    subtotal: '₹941.20'
  };

  const samplePayment = {
    amount: '₹10,000.00',
    notes: 'NEFT Transfer ref: HDFC928472910'
  };

  const phoneRule = getRule('customer.phone');
  const addressRule = getRule('customer.address');
  const notesRule = getRule('customer.notes');
  const rateRule = getRule('hen.rate_applied');
  const paymentAmountRule = getRule('payment.amount');
  const paymentNotesRule = getRule('payment.notes');

  const renderFieldValue = (value, rule, maskedFormat) => {
    if (rule === 'hidden') {
      return <span className="sim-field-value hidden flex items-center gap-1"><EyeOff className="w-3.5 h-3.5 inline" /> Field Hidden from this Role</span>;
    }
    if (rule === 'masked') {
      return <span className="sim-field-value masked">{maskedFormat || '••••••••••'}</span>;
    }
    return (
      <span className="sim-field-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {value}
        {rule === 'edit' ? (
          <span style={{ fontSize: '10px', color: 'var(--success)', fontWeight: '700' }}>[EDITABLE]</span>
        ) : (
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>[READ ONLY]</span>
        )}
      </span>
    );
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="modal-header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Smartphone size={20} />
            </div>
            <div>
              <h2 className="modal-title">Live Role View Simulator</h2>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Visualizes field masking & permission enforcement
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Role Selector Pill Bar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', backgroundColor: '#FAFAF9' }}>
          <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Simulate View As:
          </label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
            {roles.map(r => (
              <button
                key={r.id}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: selectedRole === r.id ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                  backgroundColor: selectedRole === r.id ? 'var(--primary-light)' : '#FFFFFF',
                  color: selectedRole === r.id ? 'var(--primary-dark)' : 'var(--text-main)',
                  transition: 'all 0.15s ease'
                }}
                onClick={() => setSelectedRole(r.id)}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        {/* Simulator Frame (Simulating Client Screen) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <div className="simulator-frame">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Simulated Screen: Customer Hub
              </div>
              <span style={{
                fontSize: '11px', fontWeight: '700',
                backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
                padding: '2px 8px', borderRadius: '4px'
              }}>
                {selectedRole}
              </span>
            </div>

            {/* Customer Details Section */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--border-light)', padding: '14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                {sampleCustomer.name}
              </div>

              <div className="sim-field-row">
                <span className="sim-field-label">Phone:</span>
                {renderFieldValue(sampleCustomer.phone, phoneRule, '+91 98*** ***81')}
              </div>

              <div className="sim-field-row">
                <span className="sim-field-label">Address:</span>
                {renderFieldValue(sampleCustomer.address, addressRule)}
              </div>

              {notesRule !== 'hidden' ? (
                <div className="sim-field-row" style={{ borderBottom: 'none' }}>
                  <span className="sim-field-label">Notes:</span>
                  {renderFieldValue(sampleCustomer.notes, notesRule)}
                </div>
              ) : (
                <div className="sim-field-row" style={{ borderBottom: 'none' }}>
                  <span className="sim-field-label">Notes:</span>
                  <span className="sim-field-value hidden flex items-center gap-1"><EyeOff className="w-3.5 h-3.5 inline" /> Confidential Notes Hidden</span>
                </div>
              )}
            </div>

            {/* Hen Item Section */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--border-light)', padding: '14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                Hen #01 (Weighed Item)
              </div>
              <div className="sim-field-row">
                <span className="sim-field-label">Type & Weight:</span>
                <span className="sim-field-value">{sampleHen.type} – {sampleHen.weight}</span>
              </div>
              <div className="sim-field-row">
                <span className="sim-field-label">Rate Applied:</span>
                {renderFieldValue(sampleHen.rateApplied, rateRule)}
              </div>
              <div className="sim-field-row" style={{ borderBottom: 'none' }}>
                <span className="sim-field-label">Subtotal:</span>
                <span className="sim-field-value" style={{ color: 'var(--primary)', fontWeight: '700' }}>
                  {sampleHen.subtotal}
                </span>
              </div>
            </div>

            {/* Payment Section */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--border-light)', padding: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                Payment Transaction Receipt
              </div>
              <div className="sim-field-row">
                <span className="sim-field-label">Amount:</span>
                {renderFieldValue(samplePayment.amount, paymentAmountRule)}
              </div>
              <div className="sim-field-row" style={{ borderBottom: 'none' }}>
                <span className="sim-field-label">Memo Note:</span>
                {renderFieldValue(samplePayment.notes, paymentNotesRule)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer-bar">
          <button type="button" className="btn-secondary-cta" onClick={onClose}>
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
}

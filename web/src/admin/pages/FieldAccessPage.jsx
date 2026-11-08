import React from 'react';
import { EyeOff, Smartphone, Shield, Info, Check } from 'lucide-react';

export default function FieldAccessPage({
  fieldPermissions,
  roles,
  onUpdateFieldRule,
  onOpenSimulator
}) {
  const accessModes = [
    { key: 'edit', label: 'Edit', class: 'active-edit', desc: 'Can view and modify' },
    { key: 'read', label: 'Read', class: 'active-read', desc: 'Display only, cannot edit' },
    { key: 'masked', label: 'Mask', class: 'active-masked', desc: 'Partially hidden (e.g. +91 98***)' },
    { key: 'hidden', label: 'Hide', class: 'active-hidden', desc: 'Omitted completely from UI' },
  ];

  return (
    <div className="fade-in">
      {/* Title Bar */}
      <div className="page-title-row">
        <div className="page-title-group">
          <h1>Field-Level Access & Privacy Rules</h1>
          <p>Granular data privacy controls allowing administrators to mask or hide sensitive fields per role.</p>
        </div>
        <button className="btn-primary-cta" onClick={onOpenSimulator}>
          <Smartphone size={16} />
          <span>Launch Live Simulator</span>
        </button>
      </div>

      {/* Info Banner */}
      <div style={{
        backgroundColor: '#F0FDF4',
        border: '1px solid #BBF7D0',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <EyeOff size={20} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
              Compliance & Data Masking Engine
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Configure whether phone numbers, confidential notes, rates, and cash collections are editable, read-only, masked with asterisks, or completely hidden.
            </div>
          </div>
        </div>

        <button className="btn-secondary-cta" onClick={onOpenSimulator}>
          <span>Test in Simulator →</span>
        </button>
      </div>

      {/* Field Privacy Matrix Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '260px' }}>Sensitive Field</th>
              <th style={{ width: '140px' }}>Entity Scope</th>
              {roles.map(r => (
                <th key={r.id} style={{ textAlign: 'center' }}>
                  {r.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fieldPermissions.map((fp) => (
              <tr key={fp.fieldId}>
                {/* Field Details */}
                <td>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>
                    {fp.fieldName}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {fp.description}
                  </div>
                  <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                    {fp.fieldId}
                  </span>
                </td>

                {/* Entity */}
                <td>
                  <span style={{
                    fontSize: '11px', fontWeight: '700',
                    backgroundColor: 'var(--border-subtle)',
                    padding: '3px 8px', borderRadius: '4px'
                  }}>
                    {fp.entity}
                  </span>
                </td>

                {/* Rule Selector per Role */}
                {roles.map((r) => {
                  const currentRule = fp.rules[r.id] || 'read';
                  const isSuperAdmin = r.id === 'SUPER_ADMIN';

                  return (
                    <td key={r.id} style={{ textAlign: 'center' }}>
                      <div className="field-privacy-group" style={{ display: 'inline-flex' }}>
                        {accessModes.map((mode) => {
                          const isSelected = currentRule === mode.key;
                          return (
                            <button
                              key={mode.key}
                              type="button"
                              className={`field-chip ${isSelected ? mode.class : ''}`}
                              disabled={isSuperAdmin}
                              onClick={() => onUpdateFieldRule(fp.fieldId, r.id, mode.key)}
                              title={isSuperAdmin ? 'Super Admin always retains Full Edit' : mode.desc}
                            >
                              {mode.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

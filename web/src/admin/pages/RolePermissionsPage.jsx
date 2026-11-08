import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckSquare, Square, Info, Sparkles } from 'lucide-react';

export default function RolePermissionsPage({
  roles,
  permissionCatalog,
  onUpdateRolePermissions
}) {
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id || 'FARM_MANAGER');
  const [saveToast, setSaveToast] = useState(false);

  const activeRole = roles.find(r => r.id === selectedRoleId) || roles[0];
  const isSystemRole = activeRole.isSystem;

  const handleTogglePermission = (permCode) => {
    if (isSystemRole) return; // Super admin cannot be downgraded

    const hasPerm = activeRole.permissions.includes(permCode);
    const updatedPerms = hasPerm
      ? activeRole.permissions.filter(p => p !== permCode)
      : [...activeRole.permissions, permCode];

    onUpdateRolePermissions(activeRole.id, updatedPerms);
    triggerToast();
  };

  const handleToggleCategory = (categoryItems) => {
    if (isSystemRole) return;

    const categoryCodes = categoryItems.map(i => i.code);
    const allSelected = categoryCodes.every(code => activeRole.permissions.includes(code));

    let updatedPerms;
    if (allSelected) {
      // Uncheck all in this category
      updatedPerms = activeRole.permissions.filter(p => !categoryCodes.includes(p));
    } else {
      // Check all in this category
      const toAdd = categoryCodes.filter(c => !activeRole.permissions.includes(c));
      updatedPerms = [...activeRole.permissions, ...toAdd];
    }

    onUpdateRolePermissions(activeRole.id, updatedPerms);
    triggerToast();
  };

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="fade-in">
      {/* Title Bar */}
      <div className="page-title-row">
        <div className="page-title-group">
          <h1>Role-Based Access Control (RBAC)</h1>
          <p>Define operational capability boundaries across customer, weighing, financial, and audit domains.</p>
        </div>

        {saveToast && (
          <div style={{
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)',
            border: '1px solid #86EFAC',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <ShieldCheck size={16} /> Permissions updated & saved!
          </div>
        )}
      </div>

      {/* Role Selection Tabs */}
      <div className="matrix-role-tabs">
        {roles.map(r => (
          <button
            key={r.id}
            className={`matrix-role-tab ${selectedRoleId === r.id ? 'active' : ''}`}
            onClick={() => setSelectedRoleId(r.id)}
          >
            <ShieldCheck size={16} />
            <span>{r.name}</span>
            <span style={{
              fontSize: '11px',
              backgroundColor: selectedRoleId === r.id ? 'rgba(46, 125, 50, 0.15)' : 'var(--border-subtle)',
              padding: '2px 7px',
              borderRadius: 'var(--radius-full)'
            }}>
              {r.permissions.length} perms
            </span>
          </button>
        ))}
      </div>

      {/* Active Role Meta Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        margin: '20px 0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              {activeRole.name}
            </h2>
            {isSystemRole ? (
              <span style={{
                fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)',
                padding: '3px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                <Lock size={12} /> System Locked
              </span>
            ) : (
              <span style={{
                fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                backgroundColor: '#EFF6FF', color: '#1E40AF',
                padding: '3px 8px', borderRadius: '4px'
              }}>
                Custom Configurable
              </span>
            )}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {activeRole.description}
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Assigned Staff</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)' }}>
            {activeRole.userCount} users
          </div>
        </div>
      </div>

      {isSystemRole && (
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          color: '#92400E',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Info size={18} style={{ flexShrink: 0 }} />
          <span>The Super Administrator role retains all system permissions permanently to prevent lockouts.</span>
        </div>
      )}

      {/* 2D Interactive Permission Matrix by Category */}
      <div className="matrix-container">
        {permissionCatalog.map((cat) => {
          const categoryCodes = cat.items.map(i => i.code);
          const allSelected = categoryCodes.every(code => activeRole.permissions.includes(code));
          const someSelected = categoryCodes.some(code => activeRole.permissions.includes(code));

          return (
            <div key={cat.category} className="matrix-category-card">
              {/* Category Header */}
              <div className="matrix-category-header">
                <span className="category-header-title">{cat.category}</span>
                {!isSystemRole && (
                  <button
                    type="button"
                    style={{
                      fontSize: '12px',
                      color: allSelected ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onClick={() => handleToggleCategory(cat.items)}
                  >
                    {allSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                    <span>{allSelected ? 'Deselect All' : 'Select All'}</span>
                  </button>
                )}
              </div>

              {/* Items Grid */}
              <div className="matrix-items-grid">
                {cat.items.map((item) => {
                  const isChecked = activeRole.permissions.includes(item.code);
                  return (
                    <div
                      key={item.code}
                      className={`matrix-perm-item ${isChecked ? 'checked' : ''}`}
                      onClick={() => handleTogglePermission(item.code)}
                      style={{ cursor: isSystemRole ? 'not-allowed' : 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        className="perm-checkbox"
                        checked={isChecked}
                        disabled={isSystemRole}
                        onChange={() => {}} // handled by parent div
                      />
                      <div className="perm-info">
                        <span className="perm-name">{item.name}</span>
                        <span className="perm-desc">{item.desc}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>
                          {item.code}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

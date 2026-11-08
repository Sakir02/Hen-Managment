import React from 'react';
import { X, ShieldAlert, Monitor, Globe, Clock, User } from 'lucide-react';

export default function DiffViewerModal({
  isOpen,
  onClose,
  logEntry
}) {
  if (!isOpen || !logEntry) return null;

  const oldJson = logEntry.diff?.oldValues
    ? JSON.stringify(logEntry.diff.oldValues, null, 2)
    : '(No previous state / Entity created)';

  const newJson = logEntry.diff?.newValues
    ? JSON.stringify(logEntry.diff.newValues, null, 2)
    : '(Entity deleted)';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog modal-large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              backgroundColor: '#FEF3C7', color: '#B45309',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="modal-title">Forensic Audit Diff Inspector</h2>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Event ID: <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{logEntry.id}</span>
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Metadata Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            backgroundColor: '#F9FAFB',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                Actor
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginTop: '2px' }}>
                {logEntry.actor.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {logEntry.actor.role}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                Action & Entity
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span className={`action-pill action-${logEntry.action.toLowerCase()}`}>
                  {logEntry.action}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{logEntry.entityType}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                {logEntry.entityId}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                Timestamp
              </div>
              <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-main)', marginTop: '2px' }}>
                {logEntry.timestamp}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                Origin & Device
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-main)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Globe size={12} /> {logEntry.ipAddress}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Monitor size={12} /> {logEntry.device}
              </div>
            </div>
          </div>

          {/* Change Description */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Action Summary:
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', lineHeight: 1.4 }}>
              {logEntry.summary}
            </div>
          </div>

          {/* Side-by-Side Diff Box */}
          <div className="diff-card">
            <div className="diff-grid">
              {/* Old State */}
              <div className="diff-pane-old">
                <div className="diff-pane-title">
                  Before Mutation (Old State)
                </div>
                <div className="diff-content-box">
                  {oldJson}
                </div>
              </div>

              {/* New State */}
              <div className="diff-pane-new">
                <div className="diff-pane-title">
                  After Mutation (New State)
                </div>
                <div className="diff-content-box">
                  {newJson}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer-bar">
          <button type="button" className="btn-secondary-cta" onClick={onClose}>
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

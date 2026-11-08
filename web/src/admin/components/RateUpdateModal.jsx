import React, { useState } from 'react';
import { X, TrendingUp, AlertCircle } from 'lucide-react';

export default function RateUpdateModal({
  isOpen,
  onClose,
  currentRates,
  onSaveRates
}) {
  const [margaRate, setMargaRate] = useState(currentRates.MARGA.toString());
  const [margeeRate, setMargeeRate] = useState(currentRates.MARGEE.toString());
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const numMarga = parseFloat(margaRate) || 0;
  const numMargee = parseFloat(margeeRate) || 0;
  const deltaMarga = numMarga - currentRates.MARGA;
  const deltaMargee = numMargee - currentRates.MARGEE;

  const handleSave = (e) => {
    e.preventDefault();
    if (numMarga <= 0 || numMargee <= 0) {
      setError('Rates must be positive numbers greater than zero.');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason for the rate revision for compliance logging.');
      return;
    }

    onSaveRates({
      marga: numMarga,
      margee: numMargee,
      reason: reason.trim()
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <TrendingUp size={20} />
            </div>
            <h2 className="modal-title">Update Standard Hen Rates</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            {/* Impact Notice Banner */}
            <div style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              display: 'flex',
              gap: '12px',
              fontSize: '13px',
              color: '#1E40AF',
              lineHeight: 1.4
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Immutable Historical Snapshot:</strong> Existing recorded hen records retain their original rate. This new rate will immediately apply to all newly added hens across web and mobile clients.
              </div>
            </div>

            {/* Inputs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Marga (Male) Rate (₹ / kg)</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}
                  value={margaRate}
                  onChange={(e) => setMargaRate(e.target.value)}
                />
                <span style={{ fontSize: '11px', color: deltaMarga >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: '600' }}>
                  {deltaMarga >= 0 ? `+₹${deltaMarga.toFixed(2)}` : `-₹${Math.abs(deltaMarga).toFixed(2)}`} from ₹{currentRates.MARGA}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Margee (Female) Rate (₹ / kg)</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}
                  value={margeeRate}
                  onChange={(e) => setMargeeRate(e.target.value)}
                />
                <span style={{ fontSize: '11px', color: deltaMargee >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: '600' }}>
                  {deltaMargee >= 0 ? `+₹${deltaMargee.toFixed(2)}` : `-₹${Math.abs(deltaMargee).toFixed(2)}`} from ₹{currentRates.MARGEE}
                </span>
              </div>
            </div>

            {/* Reason for Change */}
            <div className="form-group">
              <label className="form-label">Reason for Rate Revision (Required)</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="e.g. Mandi auction price escalation or feed logistics change..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <span className="form-hint">This note will be permanently recorded in the system audit timeline.</span>
            </div>

            {error && (
              <div style={{ color: 'var(--danger)', fontSize: '13px', fontWeight: '500' }}>
                {error}
              </div>
            )}
          </div>

          <div className="modal-footer-bar">
            <button type="button" className="btn-secondary-cta" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-cta">
              Publish & Lock New Rates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

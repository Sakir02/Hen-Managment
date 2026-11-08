import React from 'react';
import { TrendingUp, Clock, AlertCircle, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function RateManagementPage({
  rates,
  onOpenRateModal
}) {
  return (
    <div className="fade-in">
      {/* Title Bar */}
      <div className="page-title-row">
        <div className="page-title-group">
          <h1>Live Poultry Rates & Historical Index</h1>
          <p>Configure wholesale live weights for Marga (Male) and Margee (Female) poultry.</p>
        </div>
        <button className="btn-primary-cta" onClick={onOpenRateModal}>
          <TrendingUp size={16} />
          <span>Update Current Rates</span>
        </button>
      </div>

      {/* Hero Rate Cards */}
      <div className="rate-showcase-row">
        {/* Marga (Male) Card */}
        <div className="rate-hero-card">
          <span className="rate-hero-tag">Live Mandi Price</span>
          <div className="rate-type-title">Marga (Male Broiler / Rooster)</div>
          <div className="rate-type-desc">Standard live weight calculation price applied to all male hens.</div>

          <div className="rate-big-price">
            ₹{rates.MARGA.toFixed(2)} <span className="rate-price-unit">/ kg</span>
          </div>

          <div className="rate-meta-updated">
            <Clock size={14} />
            <span>Effective since: {rates.lastUpdated}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Authorized by: <strong>{rates.updatedBy}</strong>
          </div>
        </div>

        {/* Margee (Female) Card */}
        <div className="rate-hero-card hero-margee">
          <span className="rate-hero-tag" style={{ backgroundColor: '#DCFCE7', color: 'var(--success)' }}>
            Live Mandi Price
          </span>
          <div className="rate-type-title">Margee (Female Broiler / Layer)</div>
          <div className="rate-type-desc">Standard live weight calculation price applied to all female hens.</div>

          <div className="rate-big-price">
            ₹{rates.MARGEE.toFixed(2)} <span className="rate-price-unit">/ kg</span>
          </div>

          <div className="rate-meta-updated">
            <Clock size={14} />
            <span>Effective since: {rates.lastUpdated}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Authorized by: <strong>{rates.updatedBy}</strong>
          </div>
        </div>
      </div>

      {/* Financial Protection Notice */}
      <div style={{
        backgroundColor: '#EFF6FF',
        border: '1px solid #BFDBFE',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        fontSize: '13px',
        color: '#1E40AF'
      }}>
        <ShieldCheck size={22} style={{ flexShrink: 0 }} />
        <div>
          <strong>Financial Immutability Guarantee:</strong> Changing the rate here does NOT modify past customer bills or previously weighed hens. Every hen record locks its specific rate at the moment of weighing, preventing retrospective invoice disputes.
        </div>
      </div>

      {/* Historical Timeline Table */}
      <div className="card-box">
        <div className="card-header-bar">
          <div className="card-title-text">Rate Revision Audit Trail</div>
          <span className="card-badge-info">{rates.history.length} Historical Adjustments</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Effective Date & Time</th>
              <th>Hen Category</th>
              <th>Old Price</th>
              <th>New Price</th>
              <th>Adjustment (Delta)</th>
              <th>Reason for Adjustment</th>
              <th>Authorized Admin</th>
            </tr>
          </thead>
          <tbody>
            {rates.history.map((h) => (
              <tr key={h.id}>
                <td style={{ fontWeight: '500' }}>{h.effectiveDate}</td>
                <td>
                  <span style={{
                    fontWeight: '700',
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: h.type === 'MARGA' ? 'var(--primary-light)' : '#E0F2FE',
                    color: h.type === 'MARGA' ? 'var(--primary-dark)' : '#0369A1'
                  }}>
                    {h.type === 'MARGA' ? 'Marga (Male)' : 'Margee (Female)'}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>₹{h.oldRate.toFixed(2)}</td>
                <td style={{ fontWeight: '700', color: 'var(--text-main)' }}>₹{h.newRate.toFixed(2)}</td>
                <td>
                  <span style={{
                    fontWeight: '700',
                    color: h.change.startsWith('+') ? 'var(--success)' : 'var(--danger)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    <ArrowUpRight size={14} /> {h.change}
                  </span>
                </td>
                <td style={{ maxWidth: '280px', color: 'var(--text-secondary)' }}>
                  {h.reason}
                </td>
                <td style={{ fontWeight: '500' }}>{h.updatedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';
import {
  Users,
  ShieldCheck,
  TrendingUp,
  History,
  ArrowUpRight,
  Clock,
  UserPlus,
  Sliders,
  DollarSign
} from 'lucide-react';

export default function AdminDashboardPage({
  data,
  setActiveTab,
  onOpenRateModal,
  onOpenAddUserModal
}) {
  const { users, roles, rates, auditLogs } = data;

  const activeUsersCount = users.filter(u => u.status === 'ACTIVE').length;
  const recentLogs = auditLogs.slice(0, 5);

  return (
    <div className="fade-in">
      {/* Page Title */}
      <div className="page-title-row">
        <div className="page-title-group">
          <h1>Executive Command Center</h1>
          <p>Real-time poultry operations administration, security posture, and rate configurations.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary-cta" onClick={() => setActiveTab('audit-logs')}>
            <History size={16} />
            <span>Audit History</span>
          </button>
          <button className="btn-primary-cta" onClick={onOpenRateModal}>
            <TrendingUp size={16} />
            <span>Adjust Rates</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        {/* Metric 1: Staff Users */}
        <div className="kpi-card" onClick={() => setActiveTab('users')} style={{ cursor: 'pointer' }}>
          <div className="kpi-top-row">
            <div className="kpi-icon-wrap kpi-icon-green">
              <Users size={22} />
            </div>
            <span className="kpi-trend trend-up">
              <ArrowUpRight size={12} /> {activeUsersCount} Active
            </span>
          </div>
          <div className="kpi-label">Staff Accounts</div>
          <div className="kpi-value">{users.length}</div>
          <div className="kpi-subtext">Across {roles.length} configured system roles</div>
        </div>

        {/* Metric 2: Live Marga Rate */}
        <div className="kpi-card" onClick={onOpenRateModal} style={{ cursor: 'pointer' }}>
          <div className="kpi-top-row">
            <div className="kpi-icon-wrap kpi-icon-orange">
              <TrendingUp size={22} />
            </div>
            <span className="kpi-trend trend-up">
              Live Mandi
            </span>
          </div>
          <div className="kpi-label">Marga (Male) Live Rate</div>
          <div className="kpi-value" style={{ color: 'var(--primary)' }}>₹{rates.MARGA.toFixed(2)} <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>/ kg</span></div>
          <div className="kpi-subtext">Updated {rates.lastUpdated.split(' ')[0]}</div>
        </div>

        {/* Metric 3: Live Margee Rate */}
        <div className="kpi-card" onClick={onOpenRateModal} style={{ cursor: 'pointer' }}>
          <div className="kpi-top-row">
            <div className="kpi-icon-wrap kpi-icon-green">
              <TrendingUp size={22} />
            </div>
            <span className="kpi-trend trend-up">
              Live Mandi
            </span>
          </div>
          <div className="kpi-label">Margee (Female) Live Rate</div>
          <div className="kpi-value" style={{ color: 'var(--primary)' }}>₹{rates.MARGEE.toFixed(2)} <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>/ kg</span></div>
          <div className="kpi-subtext">Standard broiler / layer index</div>
        </div>

        {/* Metric 4: Security Events */}
        <div className="kpi-card" onClick={() => setActiveTab('audit-logs')} style={{ cursor: 'pointer' }}>
          <div className="kpi-top-row">
            <div className="kpi-icon-wrap kpi-icon-blue">
              <History size={22} />
            </div>
            <span className="kpi-trend trend-up" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
              Audited
            </span>
          </div>
          <div className="kpi-label">Logged Audit Events</div>
          <div className="kpi-value">{auditLogs.length}</div>
          <div className="kpi-subtext">Immutable temporal records verified</div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="dashboard-columns">
        {/* Left Column: Live Security & Activity Timeline */}
        <div className="card-box">
          <div className="card-header-bar">
            <div className="card-title-text">Recent Operational & Security Activities</div>
            <button
              className="btn-secondary-cta"
              style={{ padding: '4px 10px', fontSize: '12px' }}
              onClick={() => setActiveTab('audit-logs')}
            >
              View All Logs →
            </button>
          </div>

          <div className="activity-stream">
            {recentLogs.map((log) => (
              <div key={log.id} className="activity-item">
                <div className="activity-actor-avatar">
                  {log.actor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="activity-body">
                  <div className="activity-header-line">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="activity-actor-name">{log.actor.name}</span>
                      <span className={`action-pill action-${log.action.toLowerCase()}`}>
                        {log.action}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        {log.entityType}
                      </span>
                    </div>
                    <span className="activity-time">{log.timestamp}</span>
                  </div>
                  <div className="activity-summary">{log.summary}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Role Distribution & Quick Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Actions Panel */}
          <div className="card-box" style={{ padding: '20px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: '700', marginBottom: '14px' }}>
              Administrative Shortcuts
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn-secondary-cta"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
                onClick={onOpenAddUserModal}
              >
                <UserPlus size={16} color="var(--primary)" />
                <span>Onboard New Staff Member</span>
              </button>

              <button
                className="btn-secondary-cta"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
                onClick={() => setActiveTab('roles')}
              >
                <ShieldCheck size={16} color="var(--primary)" />
                <span>Manage Role Permissions (RBAC)</span>
              </button>

              <button
                className="btn-secondary-cta"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
                onClick={() => setActiveTab('field-access')}
              >
                <Sliders size={16} color="var(--secondary)" />
                <span>Configure Field Privacy & Masking</span>
              </button>

              <button
                className="btn-secondary-cta"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
                onClick={onOpenRateModal}
              >
                <DollarSign size={16} color="var(--primary)" />
                <span>Broadcast New Hen Prices</span>
              </button>
            </div>
          </div>

          {/* Role Distribution Card */}
          <div className="card-box" style={{ padding: '20px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: '700', marginBottom: '12px' }}>
              Staff Role Breakdown
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {roles.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{r.name}</span>
                  <span style={{
                    fontWeight: '700',
                    backgroundColor: 'var(--border-subtle)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--text-secondary)'
                  }}>
                    {r.userCount} users
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

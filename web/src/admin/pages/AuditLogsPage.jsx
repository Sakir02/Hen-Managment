import React, { useState } from 'react';
import { Search, History, Eye, Download, ShieldCheck, Filter } from 'lucide-react';

export default function AuditLogsPage({
  auditLogs,
  onInspectLog
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [entityFilter, setEntityFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesEntity = entityFilter === 'ALL' || log.entityType === entityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + ["ID,Timestamp,Actor,Role,Action,Entity,Summary"]
        .concat(filteredLogs.map(l => `"${l.id}","${l.timestamp}","${l.actor.name}","${l.actor.role}","${l.action}","${l.entityType}","${l.summary}"`))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_log_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fade-in">
      {/* Title Bar */}
      <div className="page-title-row">
        <div className="page-title-group">
          <h1>Security & Operational Audit Logs</h1>
          <p>Immutable forensic record of all rate revisions, customer edits, weighing events, and user management.</p>
        </div>
        <button className="btn-secondary-cta" onClick={handleExportCSV}>
          <Download size={16} />
          <span>Export Audit Report (CSV)</span>
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
              placeholder="Search by actor, entity ID, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Action Filter */}
          <select
            className="select-filter-styled"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="ALL">All Actions (Create, Update, Delete)</option>
            <option value="CREATE">CREATE Only</option>
            <option value="UPDATE">UPDATE Only</option>
            <option value="DELETE">DELETE Only</option>
          </select>

          {/* Entity Filter */}
          <select
            className="select-filter-styled"
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
          >
            <option value="ALL">All Entities</option>
            <option value="Customer">Customer</option>
            <option value="Hen">Hen Inventory</option>
            <option value="Payment">Payment</option>
            <option value="RateSetting">Rate Setting</option>
            <option value="User">User</option>
            <option value="Role">Role / RBAC</option>
            <option value="FieldPermission">Field Permission</option>
          </select>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredLogs.length}</strong> of {auditLogs.length} events
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '170px' }}>Timestamp</th>
              <th style={{ width: '180px' }}>Authorized Actor</th>
              <th style={{ width: '100px' }}>Action</th>
              <th style={{ width: '150px' }}>Entity Target</th>
              <th>Change Summary</th>
              <th style={{ width: '130px', textAlign: 'right' }}>Forensics</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                {/* Timestamp */}
                <td style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  {log.timestamp}
                </td>

                {/* Actor */}
                <td>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '13px' }}>
                    {log.actor.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {log.actor.role}
                  </div>
                </td>

                {/* Action */}
                <td>
                  <span className={`action-pill action-${log.action.toLowerCase()}`}>
                    {log.action}
                  </span>
                </td>

                {/* Entity */}
                <td>
                  <div style={{ fontWeight: '600', fontSize: '13px' }}>{log.entityType}</div>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    {log.entityId}
                  </div>
                </td>

                {/* Summary */}
                <td style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {log.summary}
                </td>

                {/* Inspect Diff Button */}
                <td style={{ textAlign: 'right' }}>
                  <button
                    className="table-action-btn btn-inspect"
                    onClick={() => onInspectLog(log)}
                  >
                    <Eye size={13} />
                    <span>Inspect Diff</span>
                  </button>
                </td>
              </tr>
            ))}

            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  No audit trail records found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

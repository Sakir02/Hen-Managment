import React, { useState } from 'react';
import { useData } from '../context/DataContext';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import RolePermissionsPage from './pages/RolePermissionsPage';
import FieldAccessPage from './pages/FieldAccessPage';
import RateManagementPage from './pages/RateManagementPage';
import AuditLogsPage from './pages/AuditLogsPage';
import AdminSettings from './AdminSettings';

// Admin Modals & Drawers
import RateUpdateModal from './components/RateUpdateModal';
import UserFormModal from './components/UserFormModal';
import RoleSimulatorDrawer from './components/RoleSimulatorDrawer';
import DiffViewerModal from './components/DiffViewerModal';

export default function AdminSuite({ activeTab, setActiveTab }) {
  const {
    adminData,
    rates,
    updateStandardRates,
    addStaffUser,
    toggleStaffStatus,
    updateRolePermissions,
    updateFieldRule
  } = useData();

  // Modals state
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [inspectingLog, setInspectingLog] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Helper to map tab navigation from inside dashboard
  const handleDashboardNavigate = (subTab) => {
    if (subTab.startsWith('admin-')) {
      setActiveTab(subTab);
    } else {
      setActiveTab(`admin-${subTab}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Active Admin Page */}
      {activeTab === 'admin-dashboard' && (
        <AdminDashboardPage
          data={adminData}
          setActiveTab={handleDashboardNavigate}
          onOpenRateModal={() => setIsRateModalOpen(true)}
          onOpenAddUserModal={() => {
            setEditingUser(null);
            setIsUserModalOpen(true);
          }}
        />
      )}

      {activeTab === 'admin-users' && (
        <UserManagementPage
          users={adminData.users}
          roles={adminData.roles}
          onOpenAddUserModal={() => {
            setEditingUser(null);
            setIsUserModalOpen(true);
          }}
          onEditUser={(u) => {
            setEditingUser(u);
            setIsUserModalOpen(true);
          }}
          onToggleUserStatus={toggleStaffStatus}
        />
      )}

      {activeTab === 'admin-roles' && (
        <RolePermissionsPage
          roles={adminData.roles}
          permissionCatalog={adminData.permissionCatalog}
          onUpdateRolePermissions={updateRolePermissions}
        />
      )}

      {activeTab === 'admin-field-access' && (
        <FieldAccessPage
          fieldPermissions={adminData.fieldPermissions}
          roles={adminData.roles}
          onUpdateFieldRule={updateFieldRule}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />
      )}

      {activeTab === 'admin-rates' && (
        <RateManagementPage
          rates={rates}
          onOpenRateModal={() => setIsRateModalOpen(true)}
        />
      )}

      {activeTab === 'admin-audit-logs' && (
        <AuditLogsPage
          auditLogs={adminData.auditLogs}
          onInspectLog={(log) => setInspectingLog(log)}
        />
      )}

      {activeTab === 'admin-settings' && <AdminSettings />}

      {/* Global Admin Modals */}
      <RateUpdateModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        currentRates={rates}
        onSaveRates={(ratesObj) => {
          updateStandardRates(ratesObj);
          setIsRateModalOpen(false);
        }}
      />

      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        roles={adminData.roles}
        editingUser={editingUser}
        onSave={(userData) => {
          addStaffUser(userData);
          setIsUserModalOpen(false);
        }}
      />

      <RoleSimulatorDrawer
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        roles={adminData.roles}
        fieldPermissions={adminData.fieldPermissions}
      />

      <DiffViewerModal
        isOpen={!!inspectingLog}
        onClose={() => setInspectingLog(null)}
        logEntry={inspectingLog}
      />
    </div>
  );
}

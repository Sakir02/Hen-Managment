import React, { createContext, useContext, useState, useMemo } from 'react';
import { initialCustomers, initialRates, enterpriseMetrics } from '../data/mockData';
import { initialAdminData } from '../admin/data/initialAdminData';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { currentUser, showToast } = useAuth();

  // Core Data Stores
  const [customers, setCustomers] = useState(initialCustomers);
  const [rates, setRates] = useState(initialRates);
  const [adminData, setAdminData] = useState(initialAdminData);

  // ---------------- CUSTOMER OPERATIONS ----------------
  const addCustomer = (customerData) => {
    const newCust = {
      id: `cust-${Date.now().toString().slice(-4)}`,
      name: customerData.name.trim(),
      phone: customerData.phone.startsWith('+91') ? customerData.phone.trim() : `+91 ${customerData.phone.trim()}`,
      totalHens: 0,
      totalBilled: 0,
      paidAmount: 0,
      payableAmount: 0,
      status: 'SETTLED',
      hens: [],
      payments: []
    };

    setCustomers(prev => [newCust, ...prev]);
    showToast(`Customer "${newCust.name}" registered successfully!`);
    return newCust;
  };

  // ---------------- BATCH HEN INTAKE (ADMIN-ONLY PRICE RULE ENFORCED) ----------------
  const addBatchHens = ({ customerId, margaRows = [], margeeRows = [] }) => {
    // Standard rates strictly enforced from mandi rates (cannot be typed by operator)
    const currentMargaRate = rates.MARGA;
    const currentMargeeRate = rates.MARGEE;

    const newHens = [
      ...margaRows.map((r, i) => {
        const w = parseFloat(r.weight) || 0;
        return {
          id: `h-${Date.now()}-marga-${i}`,
          henNumber: `H00${i + 1}`,
          type: 'MARGA',
          weight: w,
          rateApplied: currentMargaRate, // Derived from standard rate
          amount: w * currentMargaRate
        };
      }),
      ...margeeRows.map((r, i) => {
        const w = parseFloat(r.weight) || 0;
        return {
          id: `h-${Date.now()}-margee-${i}`,
          henNumber: `H00${i + 1 + margaRows.length}`,
          type: 'MARGEE',
          weight: w,
          rateApplied: currentMargeeRate, // Derived from standard rate
          amount: w * currentMargeeRate
        };
      })
    ].filter(h => h.weight > 0);

    if (newHens.length === 0) {
      showToast('No valid hen weights entered.', 'warning');
      return false;
    }

    const addedTotal = newHens.reduce((sum, h) => sum + h.amount, 0);

    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId) {
          const nextBilled = c.totalBilled + addedTotal;
          const nextPayable = Math.max(0, nextBilled - c.paidAmount);
          return {
            ...c,
            totalHens: c.totalHens + newHens.length,
            totalBilled: nextBilled,
            payableAmount: nextPayable,
            status: nextPayable > 0 ? 'DUE' : 'SETTLED',
            hens: [...newHens, ...(c.hens || [])]
          };
        }
        return c;
      })
    );

    showToast(`Recorded intake of ${newHens.length} hens (₹${addedTotal.toFixed(2)})`);
    return true;
  };

  // ---------------- PAYMENT OPERATIONS ----------------
  const addPayment = ({ customerId, amount, date, method, notes }) => {
    const numAmt = parseFloat(amount) || 0;
    if (numAmt <= 0) {
      showToast('Enter a valid payment amount.', 'warning');
      return false;
    }

    const newPay = {
      id: `pay-${Date.now().toString().slice(-4)}`,
      amount: numAmt,
      date: date || new Date().toISOString().split('T')[0],
      method: method || 'UPI / QR',
      notes: notes || '',
      status: 'PAID'
    };

    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId) {
          const nextPaid = c.paidAmount + numAmt;
          const nextPayable = Math.max(0, c.totalBilled - nextPaid);
          return {
            ...c,
            paidAmount: nextPaid,
            payableAmount: nextPayable,
            status: nextPayable === 0 ? 'SETTLED' : 'DUE',
            payments: [newPay, ...(c.payments || [])]
          };
        }
        return c;
      })
    );

    showToast(`Payment of ₹${numAmt.toLocaleString('en-IN')} confirmed!`);
    return true;
  };

  // ---------------- RATE OPERATIONS (ADMIN GUARD) ----------------
  const updateStandardRates = ({ marga, margee, reason }) => {
    const nextMarga = parseFloat(marga) || rates.MARGA;
    const nextMargee = parseFloat(margee) || rates.MARGEE;

    const updatedRates = {
      MARGA: nextMarga,
      MARGEE: nextMargee,
      lastUpdated: 'Just now',
      updatedBy: `${currentUser?.name || 'Administrator'} (Authorized)`
    };

    setRates(updatedRates);

    // Sync to adminData
    setAdminData(prev => ({
      ...prev,
      rates: updatedRates,
      auditLogs: [
        {
          id: `aud-${Date.now().toString().slice(-4)}`,
          timestamp: 'Just now',
          actor: {
            name: currentUser?.name || 'Admin',
            role: currentUser?.role || 'Super Admin',
            avatar: currentUser?.avatar || 'SK'
          },
          action: 'RATE_UPDATE',
          entityType: 'Mandi Rates',
          entityId: 'RATE-CONFIG',
          summary: `Updated wholesale rates: Marga ₹${nextMarga}/kg, Margee ₹${nextMargee}/kg (${reason || 'Mandi adjustment'})`,
          status: 'COMMITTED',
          diff: {
            oldValues: { MARGA: rates.MARGA, MARGEE: rates.MARGEE },
            newValues: { MARGA: nextMarga, MARGEE: nextMargee, reason }
          }
        },
        ...(prev.auditLogs || [])
      ]
    }));

    showToast('Mandi rates updated and broadcast to all operator handhelds!');
    return true;
  };

  // ---------------- ADMIN DATA MANIPULATION ----------------
  const addStaffUser = (userData) => {
    const newUser = {
      id: `usr-${Date.now().toString().slice(-3)}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role || 'FIELD_OPERATOR',
      status: userData.status || 'ACTIVE',
      avatar: userData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      lastLogin: 'Never',
      assignedCustomersCount: 0
    };

    setAdminData(prev => ({
      ...prev,
      users: [newUser, ...prev.users],
      auditLogs: [
        {
          id: `aud-${Date.now().toString().slice(-4)}`,
          timestamp: 'Just now',
          actor: {
            name: currentUser?.name || 'Admin',
            role: currentUser?.role || 'Super Admin',
            avatar: currentUser?.avatar || 'SK'
          },
          action: 'USER_CREATE',
          entityType: 'Staff Account',
          entityId: newUser.id,
          summary: `Created staff profile for ${newUser.name} with role ${newUser.role}`,
          status: 'COMMITTED'
        },
        ...prev.auditLogs
      ]
    }));

    showToast(`Staff member "${newUser.name}" added successfully!`);
    return newUser;
  };

  const toggleStaffStatus = (userId) => {
    setAdminData(prev => ({
      ...prev,
      users: prev.users.map(u => {
        if (u.id === userId) {
          const nextStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          showToast(`${u.name} is now ${nextStatus}`, nextStatus === 'ACTIVE' ? 'success' : 'warning');
          return { ...u, status: nextStatus };
        }
        return u;
      })
    }));
  };

  const updateRolePermissions = (roleId, newPermissions) => {
    setAdminData(prev => ({
      ...prev,
      roles: prev.roles.map(r => {
        if (r.id === roleId) {
          return { ...r, permissions: newPermissions };
        }
        return r;
      }),
      auditLogs: [
        {
          id: `aud-${Date.now().toString().slice(-4)}`,
          timestamp: 'Just now',
          actor: {
            name: currentUser?.name || 'Admin',
            role: currentUser?.role || 'Super Admin',
            avatar: currentUser?.avatar || 'SK'
          },
          action: 'ROLE_UPDATE',
          entityType: 'Role Policy',
          entityId: roleId,
          summary: `Modified permission matrix for ${roleId} (${newPermissions.length} active rights)`,
          status: 'COMMITTED'
        },
        ...prev.auditLogs
      ]
    }));
    showToast('Role permissions updated successfully!');
  };

  const updateFieldRule = (fieldId, roleId, newRule) => {
    setAdminData(prev => ({
      ...prev,
      fieldPermissions: prev.fieldPermissions.map(f => {
        if (f.fieldId === fieldId) {
          return {
            ...f,
            rules: {
              ...f.rules,
              [roleId]: newRule
            }
          };
        }
        return f;
      })
    }));
    showToast(`Updated field rule for ${fieldId} (${roleId} → ${newRule})`);
  };

  // ---------------- DYNAMIC METRICS ----------------
  const metrics = useMemo(() => {
    let totalHens = 0;
    let totalWeightKg = 0;
    let totalBilled = 0;
    let totalPaid = 0;
    let totalPayable = 0;
    let dueCustomersCount = 0;

    customers.forEach(c => {
      totalHens += c.totalHens || (c.hens ? c.hens.length : 0);
      totalBilled += c.totalBilled || 0;
      totalPaid += c.paidAmount || 0;
      totalPayable += c.payableAmount || 0;
      if (c.payableAmount > 0) dueCustomersCount++;

      if (c.hens) {
        c.hens.forEach(h => {
          totalWeightKg += h.weight || 0;
        });
      }
    });

    return {
      totalCustomers: customers.length,
      dueCustomersCount,
      totalHens,
      totalWeightKg: totalWeightKg.toFixed(2),
      totalBilled,
      totalPaid,
      outstandingAmount: totalPayable,
      activeUsers: adminData.users.filter(u => u.status === 'ACTIVE').length,
      userCount: adminData.users.length,
      roleCount: adminData.roles.length,
      logCount: adminData.auditLogs.length
    };
  }, [customers, adminData]);

  return (
    <DataContext.Provider
      value={{
        customers,
        rates,
        adminData,
        metrics,
        addCustomer,
        addBatchHens,
        addPayment,
        updateStandardRates,
        addStaffUser,
        toggleStaffStatus,
        updateRolePermissions,
        updateFieldRule
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

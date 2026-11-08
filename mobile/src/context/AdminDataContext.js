import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  initialCustomers,
  initialRates,
  initialStaffUsers,
  initialRoles,
  initialAuditLogs,
  initialAdminProfile
} from '../data/initialData';
import { calculateCustomerFinancials } from '../utils/calculations';

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {
  // Session authentication state - null means unauthenticated (shows login screen)
  const [currentUser, setCurrentUser] = useState(null);
  const [portalMode, setPortalMode] = useState('user'); // 'user' | 'admin'

  // Core reactive data stores
  const [customers, setCustomers] = useState(initialCustomers);
  const [rates, setRates] = useState(initialRates);
  const [staffUsers, setStaffUsers] = useState(initialStaffUsers);
  const [roles, setRoles] = useState(initialRoles);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [adminProfile, setAdminProfile] = useState(initialAdminProfile);

  // Global Toast notification state (Spec Section 20 & 21)
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' // 'success' | 'warning' | 'error' | 'info'
  });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3200);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  // Helper to append audit logs
  const logAudit = (action, entity, summary, diff = null) => {
    const newEntry = {
      id: `aud-${Date.now().toString().slice(-5)}`,
      actor: currentUser ? currentUser.name : 'System Admin',
      actorRole: currentUser ? currentUser.role : 'Super Admin',
      action,
      entity,
      timestamp: 'Just now',
      summary,
      status: 'COMMITTED',
      diff
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // ---------------- AUTH ACTIONS ----------------
  const login = (emailOrPhone, _password) => {
    const matched = staffUsers.find(
      u => u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone.includes(emailOrPhone)
    ) || staffUsers[0];

    setCurrentUser(matched);
    showToast(`Welcome back, ${matched.name}!`, 'success');
    logAudit('LOGIN', 'Admin Session', `Admin session started for ${matched.name}`);
    return true;
  };

  const logout = () => {
    if (currentUser) {
      logAudit('LOGOUT', 'Admin Session', `Session closed for ${currentUser.name}`);
    }
    setCurrentUser(null);
    showToast('You have been logged out securely.', 'info');
  };

  // ---------------- CUSTOMER ACTIONS ----------------
  const addCustomer = (customerData) => {
    const newId = `cust-${Date.now().toString().slice(-4)}`;
    const newRecord = {
      id: newId,
      name: customerData.name.trim(),
      phone: customerData.phone.trim(),
      address: customerData.address?.trim() || '',
      notes: customerData.notes?.trim() || '',
      createdAt: new Date().toISOString(),
      hens: [],
      payments: []
    };

    setCustomers(prev => [newRecord, ...prev]);
    logAudit('CREATE', 'Customer Ledger', `Created customer account for "${newRecord.name}"`);
    showToast(`Customer "${newRecord.name}" added successfully!`, 'success');
    return newRecord;
  };

  const updateCustomer = (customerId, updatedFields) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId) {
          const updated = { ...c, ...updatedFields };
          logAudit('UPDATE', 'Customer Profile', `Updated contact details for "${updated.name}"`);
          return updated;
        }
        return c;
      })
    );
    showToast('Customer profile updated.', 'success');
  };

  const deleteCustomer = (customerId) => {
    const target = customers.find(c => c.id === customerId);
    if (!target) return;

    setCustomers(prev => prev.filter(c => c.id !== customerId));
    logAudit('DELETE', 'Customer Account', `Removed ledger for "${target.name}"`);
    showToast(`Customer "${target.name}" deleted.`, 'warning');
  };

  // ---------------- HEN ACTIONS ----------------
  const addHenToCustomer = (customerId, henData) => {
    const standardRate = henData.type === 'MARGA' ? rates.MARGA : rates.MARGEE;
    const newHen = {
      id: `h-${Date.now().toString().slice(-4)}`,
      henNumber: henData.henNumber || `H-${Math.floor(Math.random() * 900 + 100)}`,
      type: henData.type, // 'MARGA' | 'MARGEE'
      weight: parseFloat(henData.weight) || 0,
      rateApplied: standardRate,
      notes: henData.notes?.trim() || '',
      photoUri: henData.photoUri || null,
      createdAt: new Date().toISOString()
    };

    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId) {
          return {
            ...c,
            hens: [newHen, ...c.hens]
          };
        }
        return c;
      })
    );

    const targetCustomer = customers.find(c => c.id === customerId);
    const amount = (newHen.weight * newHen.rateApplied).toFixed(2);
    logAudit(
      'CREATE',
      'Hen Entry',
      `Added ${newHen.type} (#${newHen.henNumber}, ${newHen.weight}kg @ ₹${newHen.rateApplied}) for ${targetCustomer?.name || 'Customer'}`
    );
    showToast(`Hen #${newHen.henNumber} (₹${amount}) added to ledger!`, 'success');
  };

  const addHensBatchToCustomer = (customerId, hensArray) => {
    if (!hensArray || hensArray.length === 0) return [];

    const totalExistingHens = customers.reduce((sum, c) => sum + (c.hens?.length || 0), 0);

    const createdHens = hensArray.map((h, idx) => {
      const seq = totalExistingHens + idx + 1;
      const henNumber = `HN-${String(seq).padStart(6, '0')}`;
      const type = h.type; // 'MARGA' or 'MARGEE'
      const weight = parseFloat(h.weight) || 0;
      const rateApplied = type === 'MARGA' ? rates.MARGA : rates.MARGEE;

      return {
        id: `h-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        henNumber,
        type,
        weight,
        rateApplied,
        photoUri: h.photoUri || null,
        notes: h.notes?.trim() || '',
        createdAt: new Date().toISOString()
      };
    });

    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId) {
          return {
            ...c,
            hens: [...createdHens, ...(c.hens || [])]
          };
        }
        return c;
      })
    );

    const targetCustomer = customers.find(c => c.id === customerId);
    const margaCount = createdHens.filter(h => h.type === 'MARGA').length;
    const margeeCount = createdHens.filter(h => h.type === 'MARGEE').length;
    const batchTotalAmount = createdHens.reduce((sum, h) => sum + (h.weight * h.rateApplied), 0);

    logAudit(
      'CREATE',
      'Batch Hen Intake',
      `Recorded batch intake of ${createdHens.length} birds (${margaCount} Marga, ${margeeCount} Margee = ₹${batchTotalAmount.toFixed(2)}) for ${targetCustomer?.name || 'Customer'}`
    );
    showToast(`Saved ${createdHens.length} hens (₹${batchTotalAmount.toFixed(2)}) to ledger!`, 'success');
    return createdHens;
  };

  const deleteHenFromCustomer = (customerId, henId) => {
    let deletedHen = null;
    let customerName = '';

    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId) {
          customerName = c.name;
          const found = c.hens.find(h => h.id === henId);
          if (found) deletedHen = found;
          return {
            ...c,
            hens: c.hens.filter(h => h.id !== henId)
          };
        }
        return c;
      })
    );

    if (deletedHen) {
      logAudit(
        'DELETE',
        'Hen Record',
        `Removed hen #${deletedHen.henNumber} (${deletedHen.weight}kg) from ${customerName}`,
        { before: deletedHen, after: null }
      );
      showToast(`Hen #${deletedHen.henNumber} removed. Totals recalculated.`, 'warning');
    }
  };

  // ---------------- PAYMENT ACTIONS ----------------
  const addPaymentToCustomer = (customerId, paymentData) => {
    const amount = parseFloat(paymentData.amount) || 0;
    if (amount <= 0) {
      showToast('Please enter a valid payment amount.', 'error');
      return false;
    }

    const newPayment = {
      id: `pay-${Date.now().toString().slice(-4)}`,
      amount,
      date: paymentData.date || new Date().toISOString().split('T')[0],
      method: paymentData.method || 'Cash',
      notes: paymentData.notes?.trim() || '',
      recordedAt: new Date().toISOString()
    };

    let custName = '';
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId) {
          custName = c.name;
          return {
            ...c,
            payments: [newPayment, ...c.payments]
          };
        }
        return c;
      })
    );

    logAudit(
      'CREATE',
      `Payment (${newPayment.method})`,
      `Collected ₹${amount.toLocaleString('en-IN')} from ${custName}`
    );
    showToast(`Payment of ₹${amount.toLocaleString('en-IN')} confirmed!`, 'success');
    return true;
  };

  // ---------------- RATES ACTIONS ----------------
  const updateStandardRates = (newRates) => {
    const role = currentUser?.role?.toLowerCase() || '';
    if (role && !role.includes('admin') && !role.includes('manager')) {
      showToast('Unauthorized: Only Admin can update standard Mandi rates.', 'error');
      return false;
    }

    const oldMarga = rates.MARGA;
    const oldMargee = rates.MARGEE;
    const updated = {
      MARGA: parseFloat(newRates.MARGA) || rates.MARGA,
      MARGEE: parseFloat(newRates.MARGEE) || rates.MARGEE,
      lastUpdated: 'Just now',
      updatedBy: `${currentUser?.name || 'Admin'} (${currentUser?.role || 'Admin'})`
    };

    setRates(updated);
    logAudit(
      'UPDATE',
      'Mandi Rates',
      `Updated standard rates: Marga ₹${updated.MARGA}/kg, Margee ₹${updated.MARGEE}/kg`,
      {
        before: { Marga: `₹${oldMarga}/kg`, Margee: `₹${oldMargee}/kg` },
        after: { Marga: `₹${updated.MARGA}/kg`, Margee: `₹${updated.MARGEE}/kg` }
      }
    );
    showToast('Daily Mandi Rates updated successfully!', 'success');
    return true;
  };

  // ---------------- STAFF USER ACTIONS ----------------
  const addStaffUser = (userData) => {
    const newUser = {
      id: `usr-${Date.now().toString().slice(-3)}`,
      name: userData.name.trim(),
      email: userData.email.trim(),
      phone: userData.phone.trim(),
      role: userData.role || 'Field Operator',
      status: userData.status || 'ACTIVE',
      avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      joinedDate: 'Today',
      permissionsCount: userData.role === 'Super Admin' ? 24 : userData.role === 'Farm Manager' ? 18 : 11
    };

    setStaffUsers(prev => [newUser, ...prev]);
    logAudit('CREATE', 'Staff Account', `Created staff profile for "${newUser.name}" (${newUser.role})`);
    showToast(`Staff member "${newUser.name}" registered!`, 'success');
    return newUser;
  };

  const updateStaffUser = (userId, updatedFields) => {
    setStaffUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const updated = { ...u, ...updatedFields };
          logAudit('UPDATE', 'Staff Profile', `Updated profile for "${updated.name}"`);
          return updated;
        }
        return u;
      })
    );
    showToast('Staff user profile updated.', 'success');
  };

  const toggleStaffStatus = (userId) => {
    setStaffUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const nextStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          logAudit('UPDATE', 'User Status', `Changed ${u.name} status to ${nextStatus}`);
          showToast(`${u.name} is now ${nextStatus}`, nextStatus === 'ACTIVE' ? 'success' : 'warning');
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  // ---------------- ROLES & PERMISSIONS ----------------
  const updateRolePermissions = (roleId, updatedPermissions) => {
    setRoles(prev =>
      prev.map(r => {
        if (r.id === roleId) {
          const updated = { ...r, permissions: updatedPermissions };
          logAudit('SECURITY', 'Role Permissions', `Modified access policy for "${r.name}" (${updatedPermissions.length} rules)`);
          return updated;
        }
        return r;
      })
    );
    showToast('Role permissions updated & active.', 'success');
  };

  // ---------------- METRICS (DYNAMIC AGGREGATION) ----------------
  const systemMetrics = useMemo(() => {
    let totalHens = 0;
    let totalWeight = 0;
    let totalBilled = 0;
    let totalPaid = 0;
    let totalOutstanding = 0;
    let dueCustomersCount = 0;
    const allHens = [];
    const allPayments = [];

    customers.forEach(customer => {
      const {
        totalHens: hCount,
        totalWeightKg: wKg,
        totalBilled: billed,
        totalPaid: paid,
        payableAmount: due
      } = calculateCustomerFinancials(customer);

      totalHens += hCount;
      totalWeight += wKg;
      totalBilled += billed;
      totalPaid += paid;
      totalOutstanding += due;
      if (due > 0) dueCustomersCount++;

      if (customer.hens && Array.isArray(customer.hens)) {
        customer.hens.forEach(h => {
          allHens.push({
            ...h,
            customerId: customer.id,
            customerName: customer.name
          });
        });
      }

      if (customer.payments && Array.isArray(customer.payments)) {
        customer.payments.forEach(p => {
          allPayments.push({
            ...p,
            customerId: customer.id,
            customerName: customer.name
          });
        });
      }
    });

    return {
      totalCustomers: customers.length,
      dueCustomersCount,
      totalHens,
      totalWeight: totalWeight.toFixed(2),
      totalWeightKg: totalWeight,
      grossBill: totalBilled,
      totalBilled,
      totalPaid,
      totalPayable: totalOutstanding,
      totalOutstanding,
      allHens,
      allPayments,
      recentPayments: allPayments.slice(0, 5),
      totalStaff: staffUsers.length,
      activeStaff: staffUsers.filter(u => u.status === 'ACTIVE').length,
      activeStaffCount: staffUsers.filter(u => u.status === 'ACTIVE').length,
      auditLogCount: auditLogs.length,
    };
  }, [customers, staffUsers, auditLogs]);

  return (
    <AdminDataContext.Provider
      value={{
        currentUser,
        portalMode,
        setPortalMode,
        login,
        logout,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addHenToCustomer,
        addHensBatchToCustomer,
        deleteHenFromCustomer,
        addPaymentToCustomer,
        rates,
        updateStandardRates,
        staffUsers,
        addStaffUser,
        updateStaffUser,
        toggleStaffStatus,
        roles,
        updateRolePermissions,
        auditLogs,
        adminProfile,
        systemMetrics,
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
}

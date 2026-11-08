export const initialAdminData = {
  users: [
    {
      id: 'usr-101',
      name: 'Sakir Khan',
      email: 'sakir.khan@henoperations.com',
      phone: '+91 98765 43210',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      avatar: 'SK',
      lastLogin: '2026-09-26 09:42 AM',
      assignedCustomersCount: 14,
    },
    {
      id: 'usr-102',
      name: 'Ramesh Patel',
      email: 'ramesh.patel@poultryfarm.in',
      phone: '+91 98234 56781',
      role: 'FARM_MANAGER',
      status: 'ACTIVE',
      avatar: 'RP',
      lastLogin: '2026-09-26 08:15 AM',
      assignedCustomersCount: 38,
    },
    {
      id: 'usr-103',
      name: 'Vikram Singh',
      email: 'vikram.singh@poultryfarm.in',
      phone: '+91 97123 45672',
      role: 'FIELD_OPERATOR',
      status: 'ACTIVE',
      avatar: 'VS',
      lastLogin: '2026-09-25 04:30 PM',
      assignedCustomersCount: 22,
    },
    {
      id: 'usr-104',
      name: 'Pooja Sharma',
      email: 'pooja.sharma@poultryfarm.in',
      phone: '+91 96543 21098',
      role: 'BILLING_AUDITOR',
      status: 'ACTIVE',
      avatar: 'PS',
      lastLogin: '2026-09-26 10:02 AM',
      assignedCustomersCount: 0,
    },
    {
      id: 'usr-105',
      name: 'Amit Verma',
      email: 'amit.verma@poultryfarm.in',
      phone: '+91 95432 10987',
      role: 'FIELD_OPERATOR',
      status: 'INACTIVE',
      avatar: 'AV',
      lastLogin: '2026-09-18 11:20 AM',
      assignedCustomersCount: 9,
    },
    {
      id: 'usr-106',
      name: 'Suresh Kumar',
      email: 'suresh.kumar@poultryfarm.in',
      phone: '+91 94321 09876',
      role: 'FARM_MANAGER',
      status: 'ACTIVE',
      avatar: 'SK',
      lastLogin: '2026-09-25 06:14 PM',
      assignedCustomersCount: 19,
    },
  ],

  roles: [
    {
      id: 'SUPER_ADMIN',
      name: 'Super Administrator',
      description: 'Unrestricted master access to all system modules, configurations, audit trails, and staff accounts.',
      userCount: 1,
      isSystem: true,
      permissions: [
        'CUSTOMER_VIEW_ALL', 'CUSTOMER_CREATE', 'CUSTOMER_UPDATE', 'CUSTOMER_DELETE',
        'HEN_VIEW', 'HEN_CREATE', 'HEN_UPDATE', 'HEN_DELETE', 'HEN_PHOTO_UPLOAD',
        'PAYMENT_VIEW', 'PAYMENT_CREATE', 'PAYMENT_UPDATE', 'PAYMENT_DELETE',
        'RATE_VIEW', 'RATE_UPDATE',
        'AUDIT_VIEW', 'AUDIT_EXPORT',
        'ROLE_MANAGE', 'USER_MANAGE', 'FIELD_PERMISSION_MANAGE'
      ]
    },
    {
      id: 'FARM_MANAGER',
      name: 'Farm Operations Manager',
      description: 'Manages customer onboarding, hen inventory verification, ledger reconciliation, and staff assignments.',
      userCount: 2,
      isSystem: false,
      permissions: [
        'CUSTOMER_VIEW_ALL', 'CUSTOMER_CREATE', 'CUSTOMER_UPDATE',
        'HEN_VIEW', 'HEN_CREATE', 'HEN_UPDATE', 'HEN_PHOTO_UPLOAD',
        'PAYMENT_VIEW', 'PAYMENT_CREATE',
        'RATE_VIEW',
        'AUDIT_VIEW'
      ]
    },
    {
      id: 'FIELD_OPERATOR',
      name: 'Field Weighing Operator',
      description: 'On-ground weighing operations, taking hen photos, creating customer profiles, and collecting instant payments.',
      userCount: 2,
      isSystem: false,
      permissions: [
        'CUSTOMER_VIEW_ALL', 'CUSTOMER_CREATE',
        'HEN_VIEW', 'HEN_CREATE', 'HEN_PHOTO_UPLOAD',
        'PAYMENT_VIEW', 'PAYMENT_CREATE',
        'RATE_VIEW'
      ]
    },
    {
      id: 'BILLING_AUDITOR',
      name: 'Compliance & Billing Auditor',
      description: 'Read-only financial ledger access and forensic inspection of system audit logs and change histories.',
      userCount: 1,
      isSystem: false,
      permissions: [
        'CUSTOMER_VIEW_ALL',
        'HEN_VIEW',
        'PAYMENT_VIEW',
        'RATE_VIEW',
        'AUDIT_VIEW', 'AUDIT_EXPORT'
      ]
    }
  ],

  permissionCatalog: [
    {
      category: 'Customer Operations',
      items: [
        { code: 'CUSTOMER_VIEW_ALL', name: 'View All Customers', desc: 'Allows seeing every registered customer' },
        { code: 'CUSTOMER_CREATE', name: 'Create Customer', desc: 'Register new customers into the database' },
        { code: 'CUSTOMER_UPDATE', name: 'Edit Customer Profile', desc: 'Modify phone, address, and notes' },
        { code: 'CUSTOMER_DELETE', name: 'Delete Customer', desc: 'Soft-delete or deactivate customer accounts' },
      ]
    },
    {
      category: 'Hen & Weighing Operations',
      items: [
        { code: 'HEN_VIEW', name: 'View Hen Inventory', desc: 'Inspect individual hen records and weights' },
        { code: 'HEN_CREATE', name: 'Add Hen Entry', desc: 'Record new hen weighing (Marga / Margee)' },
        { code: 'HEN_UPDATE', name: 'Edit Hen Weight & Details', desc: 'Adjust weight post-recording (logged in audit)' },
        { code: 'HEN_DELETE', name: 'Delete Hen Record', desc: 'Remove accidentally entered hen weighings' },
        { code: 'HEN_PHOTO_UPLOAD', name: 'Capture & Upload Photos', desc: 'Attach photos from camera or gallery' },
      ]
    },
    {
      category: 'Payment & Ledger Controls',
      items: [
        { code: 'PAYMENT_VIEW', name: 'View Payment Ledger', desc: 'Access historical transaction receipts' },
        { code: 'PAYMENT_CREATE', name: 'Record Collection', desc: 'Log cash/UPI received from customers' },
        { code: 'PAYMENT_UPDATE', name: 'Modify Payment Note/Date', desc: 'Correct receipt information' },
        { code: 'PAYMENT_DELETE', name: 'Void Payment Transaction', desc: 'Reverse an erroneous collection' },
      ]
    },
    {
      category: 'Pricing & Rates',
      items: [
        { code: 'RATE_VIEW', name: 'View Configured Rates', desc: 'See current ₹/kg for Marga & Margee' },
        { code: 'RATE_UPDATE', name: 'Update Standard Rates', desc: 'Change market ₹/kg for new weighings' },
      ]
    },
    {
      category: 'Audit & Compliance',
      items: [
        { code: 'AUDIT_VIEW', name: 'View Security Audit Logs', desc: 'Inspect chronological system activity feed' },
        { code: 'AUDIT_EXPORT', name: 'Export Audit Diffs', desc: 'Download CSV/JSON reports of tamper trails' },
      ]
    },
    {
      category: 'Administrative & Security',
      items: [
        { code: 'USER_MANAGE', name: 'Manage Staff Users', desc: 'Invite, edit, or deactivate user accounts' },
        { code: 'ROLE_MANAGE', name: 'Configure Roles & RBAC', desc: 'Create custom roles and alter permission sets' },
        { code: 'FIELD_PERMISSION_MANAGE', name: 'Field-Level Data Privacy', desc: 'Mask or hide sensitive fields per role' },
      ]
    }
  ],

  fieldPermissions: [
    {
      fieldId: 'customer.phone',
      fieldName: 'Customer Phone Number',
      entity: 'Customer Profile',
      description: 'Sensitive contact information for registered customer.',
      rules: {
        SUPER_ADMIN: 'edit',
        FARM_MANAGER: 'edit',
        FIELD_OPERATOR: 'read',
        BILLING_AUDITOR: 'masked',
      }
    },
    {
      fieldId: 'customer.address',
      fieldName: 'Customer Physical Address',
      entity: 'Customer Profile',
      description: 'Farm location or delivery address.',
      rules: {
        SUPER_ADMIN: 'edit',
        FARM_MANAGER: 'edit',
        FIELD_OPERATOR: 'read',
        BILLING_AUDITOR: 'read',
      }
    },
    {
      fieldId: 'customer.notes',
      fieldName: 'Internal Operational Notes',
      entity: 'Customer Profile',
      description: 'Confidential background credit or behavior notes.',
      rules: {
        SUPER_ADMIN: 'edit',
        FARM_MANAGER: 'edit',
        FIELD_OPERATOR: 'hidden',
        BILLING_AUDITOR: 'hidden',
      }
    },
    {
      fieldId: 'hen.rate_applied',
      fieldName: 'Hen Applied Rate (₹/kg)',
      entity: 'Hen Record',
      description: 'Locked price snapshot applied when hen was weighed.',
      rules: {
        SUPER_ADMIN: 'edit',
        FARM_MANAGER: 'read',
        FIELD_OPERATOR: 'read',
        BILLING_AUDITOR: 'read',
      }
    },
    {
      fieldId: 'payment.amount',
      fieldName: 'Payment Received Amount',
      entity: 'Payment Transaction',
      description: 'Amount in Rupees collected from the customer.',
      rules: {
        SUPER_ADMIN: 'edit',
        FARM_MANAGER: 'read',
        FIELD_OPERATOR: 'read',
        BILLING_AUDITOR: 'read',
      }
    },
    {
      fieldId: 'payment.notes',
      fieldName: 'Payment Settlement Notes',
      entity: 'Payment Transaction',
      description: 'Bank reference / UPI UTR / Cash denomination memo.',
      rules: {
        SUPER_ADMIN: 'edit',
        FARM_MANAGER: 'edit',
        FIELD_OPERATOR: 'read',
        BILLING_AUDITOR: 'read',
      }
    }
  ],

  rates: {
    MARGA: 260.00,
    MARGEE: 240.00,
    lastUpdated: '2026-09-24 10:45 PM',
    updatedBy: 'Sakir Khan (Super Admin)',
    history: [
      {
        id: 'rh-001',
        effectiveDate: '2026-09-24 10:45 PM',
        type: 'MARGA',
        oldRate: 250.00,
        newRate: 260.00,
        change: '+₹10/kg',
        reason: 'Wholesale mandi price increased due to festive demand surge.',
        updatedBy: 'Sakir Khan',
      },
      {
        id: 'rh-002',
        effectiveDate: '2026-09-24 10:45 PM',
        type: 'MARGEE',
        oldRate: 235.00,
        newRate: 240.00,
        change: '+₹5/kg',
        reason: 'Adjusted with market baseline index.',
        updatedBy: 'Sakir Khan',
      },
      {
        id: 'rh-003',
        effectiveDate: '2026-09-15 09:00 AM',
        type: 'MARGA',
        oldRate: 255.00,
        newRate: 250.00,
        change: '-₹5/kg',
        reason: 'Feed cost stabilization.',
        updatedBy: 'Ramesh Patel',
      },
      {
        id: 'rh-004',
        effectiveDate: '2026-09-01 08:30 AM',
        type: 'MARGEE',
        oldRate: 230.00,
        newRate: 235.00,
        change: '+₹5/kg',
        reason: 'Monthly revision based on regional feed tariffs.',
        updatedBy: 'Sakir Khan',
      }
    ]
  },

  auditLogs: [
    {
      id: 'aud-9801',
      timestamp: '2026-09-26 10:11:42 AM',
      actor: { name: 'Sakir Khan', role: 'Super Administrator', email: 'sakir.khan@henoperations.com' },
      action: 'UPDATE',
      entityType: 'RateSetting',
      entityId: 'RATE-MARGA',
      summary: 'Adjusted standard live rate for Marga (Male) from ₹250.00 to ₹260.00 / kg',
      ipAddress: '192.168.1.42',
      device: 'Chrome on Windows 11',
      diff: {
        oldValues: { rate_marga: 250.00, reason: 'Previous feed baseline' },
        newValues: { rate_marga: 260.00, reason: 'Wholesale mandi surge' }
      }
    },
    {
      id: 'aud-9802',
      timestamp: '2026-09-26 09:35:10 AM',
      actor: { name: 'Vikram Singh', role: 'Field Weighing Operator', email: 'vikram.singh@poultryfarm.in' },
      action: 'CREATE',
      entityType: 'Hen',
      entityId: 'HEN-104-03',
      summary: 'Recorded new Marga hen weighing 3.450 kg for customer "Ramesh Poultry Traders"',
      ipAddress: '10.0.4.88',
      device: 'Expo Android Mobile Client',
      diff: {
        oldValues: null,
        newValues: {
          customer_id: 'cust-104',
          hen_number: 'HEN-03',
          type: 'MARGA',
          weight: 3.450,
          rate_applied: 260.00,
          subtotal: 897.00,
          images_count: 2
        }
      }
    },
    {
      id: 'aud-9803',
      timestamp: '2026-09-26 09:12:05 AM',
      actor: { name: 'Vikram Singh', role: 'Field Weighing Operator', email: 'vikram.singh@poultryfarm.in' },
      action: 'CREATE',
      entityType: 'Payment',
      entityId: 'PAY-8821',
      summary: 'Collected ₹5,000.00 payment from "Ramesh Poultry Traders" via UPI',
      ipAddress: '10.0.4.88',
      device: 'Expo Android Mobile Client',
      diff: {
        oldValues: null,
        newValues: {
          customer_id: 'cust-104',
          amount: 5000.00,
          payment_mode: 'UPI',
          transaction_ref: 'UPI/928374829',
          notes: 'Advance part settlement'
        }
      }
    },
    {
      id: 'aud-9804',
      timestamp: '2026-09-25 05:40:19 PM',
      actor: { name: 'Ramesh Patel', role: 'Farm Operations Manager', email: 'ramesh.patel@poultryfarm.in' },
      action: 'UPDATE',
      entityType: 'Customer',
      entityId: 'CUST-102',
      summary: 'Updated contact phone number for customer "National Farm Fresh"',
      ipAddress: '192.168.1.18',
      device: 'Firefox on macOS',
      diff: {
        oldValues: { phone: '+91 98111 22233', address: 'Old Mandi Road' },
        newValues: { phone: '+91 98111 99944', address: 'New Industrial Area, Shed 4' }
      }
    },
    {
      id: 'aud-9805',
      timestamp: '2026-09-25 02:18:33 PM',
      actor: { name: 'Sakir Khan', role: 'Super Administrator', email: 'sakir.khan@henoperations.com' },
      action: 'UPDATE',
      entityType: 'FieldPermission',
      entityId: 'FIELD-CUSTOMER-PHONE',
      summary: 'Changed Field Permission for "customer.phone" on BILLING_AUDITOR from "read" to "masked"',
      ipAddress: '192.168.1.42',
      device: 'Chrome on Windows 11',
      diff: {
        oldValues: { role: 'BILLING_AUDITOR', access_level: 'read' },
        newValues: { role: 'BILLING_AUDITOR', access_level: 'masked' }
      }
    },
    {
      id: 'aud-9806',
      timestamp: '2026-09-24 11:20:00 PM',
      actor: { name: 'Sakir Khan', role: 'Super Administrator', email: 'sakir.khan@henoperations.com' },
      action: 'CREATE',
      entityType: 'User',
      entityId: 'USR-106',
      summary: 'Created new staff account for Suresh Kumar with role "Farm Operations Manager"',
      ipAddress: '192.168.1.42',
      device: 'Chrome on Windows 11',
      diff: {
        oldValues: null,
        newValues: {
          name: 'Suresh Kumar',
          email: 'suresh.kumar@poultryfarm.in',
          role: 'FARM_MANAGER',
          status: 'ACTIVE'
        }
      }
    },
    {
      id: 'aud-9807',
      timestamp: '2026-09-24 04:15:22 PM',
      actor: { name: 'Sakir Khan', role: 'Super Administrator', email: 'sakir.khan@henoperations.com' },
      action: 'DELETE',
      entityType: 'Role',
      entityId: 'ROLE-INTERN',
      summary: 'Removed deprecated role "Trainee Assistant" from RBAC matrix',
      ipAddress: '192.168.1.42',
      device: 'Chrome on Windows 11',
      diff: {
        oldValues: { role_code: 'TRAINEE_INTERN', assigned_users_count: 0 },
        newValues: null
      }
    }
  ]
};

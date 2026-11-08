export const initialRates = {
  MARGA: 300.00, // ₹ per kg for Male (Marga)
  MARGEE: 250.00, // ₹ per kg for Female (Margee)
  lastUpdated: 'Today at 06:30 AM',
  updatedBy: 'Rahul Kumar (Operator)'
};

export const initialEnterpriseMetrics = {
  totalCustomers: 248,
  totalHens: 1284,
  outstandingAmount: 45000,
};

export const initialStaffUsers = [
  {
    id: 'usr-1',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@henoperations.com',
    phone: '+91 98765 43210',
    role: 'Field Operator',
    status: 'ACTIVE',
    avatar: 'RK',
    joinedDate: '15 Jan 2025',
    permissionsCount: 24
  },
  {
    id: 'usr-2',
    name: 'Mahesh Patel',
    email: 'mahesh.patel@henoperations.com',
    phone: '+91 98234 56781',
    role: 'Farm Manager',
    status: 'ACTIVE',
    avatar: 'MP',
    joinedDate: '02 Mar 2025',
    permissionsCount: 18
  },
  {
    id: 'usr-3',
    name: 'Suresh Kumar',
    email: 'suresh.kumar@henoperations.com',
    phone: '+91 97123 45672',
    role: 'Field Operator',
    status: 'ACTIVE',
    avatar: 'SK',
    joinedDate: '10 May 2025',
    permissionsCount: 11
  },
  {
    id: 'usr-4',
    name: 'Priya Shah',
    email: 'priya.shah@henoperations.com',
    phone: '+91 96543 21098',
    role: 'Billing Auditor',
    status: 'ACTIVE',
    avatar: 'PS',
    joinedDate: '22 Aug 2025',
    permissionsCount: 14
  },
  {
    id: 'usr-5',
    name: 'Amit Singh',
    email: 'amit.singh@henoperations.com',
    phone: '+91 95432 10987',
    role: 'Field Operator',
    status: 'ACTIVE',
    avatar: 'AS',
    joinedDate: '05 Sep 2025',
    permissionsCount: 8
  }
];

export const initialRoles = [
  {
    id: 'role-super-admin',
    name: 'Super Admin',
    description: 'Full unconstrained system authority over all operations, users, financial rates and audit logs.',
    userCount: 1,
    badgeColor: '#2E7D32',
    permissions: {
      'Customer Management': [
        { id: 'cust_view', label: 'View Customer Ledgers', enabled: true },
        { id: 'cust_create', label: 'Create New Customers', enabled: true },
        { id: 'cust_edit', label: 'Edit Customer Profiles', enabled: true },
        { id: 'cust_delete', label: 'Delete Customer Accounts', enabled: true },
      ],
      'Hen Operations': [
        { id: 'hen_add', label: 'Add / Record New Hens', enabled: true },
        { id: 'hen_edit', label: 'Edit Hen Weight & Rate', enabled: true },
        { id: 'hen_delete', label: 'Delete Hen Records', enabled: true },
        { id: 'hen_export', label: 'Export Hen Stock Lists', enabled: true },
      ],
      'Payments & Billing': [
        { id: 'pay_record', label: 'Record Received Payments', enabled: true },
        { id: 'pay_edit', label: 'Modify Payment Records', enabled: true },
        { id: 'pay_receipt', label: 'Generate & Share Receipts', enabled: true },
        { id: 'pay_discount', label: 'Apply Special Waivers', enabled: true },
      ],
      'Mandi Rates': [
        { id: 'rate_view', label: 'View Live Market Rates', enabled: true },
        { id: 'rate_edit', label: 'Update Daily Standard Rates', enabled: true },
      ],
      'User Administration': [
        { id: 'user_view', label: 'View Staff Directory', enabled: true },
        { id: 'user_create', label: 'Create Staff Accounts', enabled: true },
        { id: 'user_status', label: 'Activate/Deactivate Accounts', enabled: true },
        { id: 'user_roles', label: 'Edit Roles & Permissions', enabled: true },
      ],
      'Audit & Security': [
        { id: 'audit_view', label: 'View Audit Logs & Diffs', enabled: true },
        { id: 'audit_export', label: 'Export System Audit Trail', enabled: true },
      ]
    }
  },
  {
    id: 'role-farm-manager',
    name: 'Farm Manager',
    description: 'Manages day-to-day farm intake, customer accounts, hen stock, and field supervisor assignments.',
    userCount: 1,
    badgeColor: '#16A34A',
    permissions: {
      'Customer Management': [
        { id: 'cust_view', label: 'View Customer Ledgers', enabled: true },
        { id: 'cust_create', label: 'Create New Customers', enabled: true },
        { id: 'cust_edit', label: 'Edit Customer Profiles', enabled: true },
        { id: 'cust_delete', label: 'Delete Customer Accounts', enabled: false },
      ],
      'Hen Operations': [
        { id: 'hen_add', label: 'Add / Record New Hens', enabled: true },
        { id: 'hen_edit', label: 'Edit Hen Weight & Rate', enabled: true },
        { id: 'hen_delete', label: 'Delete Hen Records', enabled: true },
        { id: 'hen_export', label: 'Export Hen Stock Lists', enabled: true },
      ],
      'Payments & Billing': [
        { id: 'pay_record', label: 'Record Received Payments', enabled: true },
        { id: 'pay_edit', label: 'Modify Payment Records', enabled: false },
        { id: 'pay_receipt', label: 'Generate & Share Receipts', enabled: true },
        { id: 'pay_discount', label: 'Apply Special Waivers', enabled: false },
      ],
      'Mandi Rates': [
        { id: 'rate_view', label: 'View Live Market Rates', enabled: true },
        { id: 'rate_edit', label: 'Update Daily Standard Rates', enabled: true },
      ],
      'User Administration': [
        { id: 'user_view', label: 'View Staff Directory', enabled: true },
        { id: 'user_create', label: 'Create Staff Accounts', enabled: false },
        { id: 'user_status', label: 'Activate/Deactivate Accounts', enabled: false },
        { id: 'user_roles', label: 'Edit Roles & Permissions', enabled: false },
      ],
      'Audit & Security': [
        { id: 'audit_view', label: 'View Audit Logs & Diffs', enabled: true },
        { id: 'audit_export', label: 'Export System Audit Trail', enabled: false },
      ]
    }
  },
  {
    id: 'role-field-operator',
    name: 'Field Operator',
    description: 'Weighs birds, logs daily intake, tags customer batches, and collects cash/UPI tokens.',
    userCount: 2,
    badgeColor: '#F57C00',
    permissions: {
      'Customer Management': [
        { id: 'cust_view', label: 'View Customer Ledgers', enabled: true },
        { id: 'cust_create', label: 'Create New Customers', enabled: true },
        { id: 'cust_edit', label: 'Edit Customer Profiles', enabled: false },
        { id: 'cust_delete', label: 'Delete Customer Accounts', enabled: false },
      ],
      'Hen Operations': [
        { id: 'hen_add', label: 'Add / Record New Hens', enabled: true },
        { id: 'hen_edit', label: 'Edit Hen Weight & Rate', enabled: false },
        { id: 'hen_delete', label: 'Delete Hen Records', enabled: false },
        { id: 'hen_export', label: 'Export Hen Stock Lists', enabled: false },
      ],
      'Payments & Billing': [
        { id: 'pay_record', label: 'Record Received Payments', enabled: true },
        { id: 'pay_edit', label: 'Modify Payment Records', enabled: false },
        { id: 'pay_receipt', label: 'Generate & Share Receipts', enabled: true },
        { id: 'pay_discount', label: 'Apply Special Waivers', enabled: false },
      ],
      'Mandi Rates': [
        { id: 'rate_view', label: 'View Live Market Rates', enabled: true },
        { id: 'rate_edit', label: 'Update Daily Standard Rates', enabled: false },
      ],
      'User Administration': [
        { id: 'user_view', label: 'View Staff Directory', enabled: false },
        { id: 'user_create', label: 'Create Staff Accounts', enabled: false },
        { id: 'user_status', label: 'Activate/Deactivate Accounts', enabled: false },
        { id: 'user_roles', label: 'Edit Roles & Permissions', enabled: false },
      ],
      'Audit & Security': [
        { id: 'audit_view', label: 'View Audit Logs & Diffs', enabled: false },
        { id: 'audit_export', label: 'Export System Audit Trail', enabled: false },
      ]
    }
  },
  {
    id: 'role-billing-auditor',
    name: 'Billing Auditor',
    description: 'Audits cash flows, verifies bank reconciliation, checks mandi rate variations, and views logs.',
    userCount: 1,
    badgeColor: '#6B7280',
    permissions: {
      'Customer Management': [
        { id: 'cust_view', label: 'View Customer Ledgers', enabled: true },
        { id: 'cust_create', label: 'Create New Customers', enabled: false },
        { id: 'cust_edit', label: 'Edit Customer Profiles', enabled: false },
        { id: 'cust_delete', label: 'Delete Customer Accounts', enabled: false },
      ],
      'Hen Operations': [
        { id: 'hen_add', label: 'Add / Record New Hens', enabled: false },
        { id: 'hen_edit', label: 'Edit Hen Weight & Rate', enabled: false },
        { id: 'hen_delete', label: 'Delete Hen Records', enabled: false },
        { id: 'hen_export', label: 'Export Hen Stock Lists', enabled: true },
      ],
      'Payments & Billing': [
        { id: 'pay_record', label: 'Record Received Payments', enabled: true },
        { id: 'pay_edit', label: 'Modify Payment Records', enabled: true },
        { id: 'pay_receipt', label: 'Generate & Share Receipts', enabled: true },
        { id: 'pay_discount', label: 'Apply Special Waivers', enabled: true },
      ],
      'Mandi Rates': [
        { id: 'rate_view', label: 'View Live Market Rates', enabled: true },
        { id: 'rate_edit', label: 'Update Daily Standard Rates', enabled: false },
      ],
      'User Administration': [
        { id: 'user_view', label: 'View Staff Directory', enabled: true },
        { id: 'user_create', label: 'Create Staff Accounts', enabled: false },
        { id: 'user_status', label: 'Activate/Deactivate Accounts', enabled: false },
        { id: 'user_roles', label: 'Edit Roles & Permissions', enabled: false },
      ],
      'Audit & Security': [
        { id: 'audit_view', label: 'View Audit Logs & Diffs', enabled: true },
        { id: 'audit_export', label: 'Export System Audit Trail', enabled: true },
      ]
    }
  }
];

export const initialAuditLogs = [
  {
    id: 'aud-101',
    actor: 'Sakir Khan',
    actorRole: 'Super Admin',
    action: 'UPDATE',
    entity: 'Mandi Rates',
    timestamp: 'Today, 10:45 AM',
    summary: 'Adjusted Marga base rate from ₹255.00 to ₹260.00/kg',
    status: 'COMMITTED',
    diff: {
      before: { 'Marga (Male)': '₹255.00/kg', 'Margee (Female)': '₹240.00/kg' },
      after: { 'Marga (Male)': '₹260.00/kg', 'Margee (Female)': '₹240.00/kg' }
    }
  },
  {
    id: 'aud-102',
    actor: 'Vikram Singh',
    actorRole: 'Field Operator',
    action: 'CREATE',
    entity: 'Payment (UPI)',
    timestamp: 'Today, 09:12 AM',
    summary: 'Recorded ₹1,000.00 payment from Ramesh Poultry Farm',
    status: 'COMMITTED',
    diff: {
      before: { 'Paid Total': '₹1,500.00', 'Payable Balance': '₹1,842.00' },
      after: { 'Paid Total': '₹2,500.00', 'Payable Balance': '₹842.00' }
    }
  },
  {
    id: 'aud-103',
    actor: 'Vikram Singh',
    actorRole: 'Field Operator',
    action: 'CREATE',
    entity: 'Hen Entry',
    timestamp: 'Yesterday, 04:30 PM',
    summary: 'Added 3.100 kg Marga (#H-05) for Ramesh Poultry Farm',
    status: 'COMMITTED',
    diff: {
      before: { 'Total Hens': '4 Birds', 'Customer Total': '₹2,536.00' },
      after: { 'Total Hens': '5 Birds', 'Customer Total': '₹3,342.00' }
    }
  },
  {
    id: 'aud-104',
    actor: 'Sakir Khan',
    actorRole: 'Super Admin',
    action: 'CREATE',
    entity: 'Staff Account',
    timestamp: '25 Sep, 02:15 PM',
    summary: 'Created new operator profile for Suresh Kumar',
    status: 'COMMITTED',
    diff: {
      before: null,
      after: { 'Name': 'Suresh Kumar', 'Role': 'Field Operator', 'Status': 'INACTIVE' }
    }
  },
  {
    id: 'aud-105',
    actor: 'Ramesh Patel',
    actorRole: 'Farm Manager',
    action: 'DELETE',
    entity: 'Hen Record',
    timestamp: '24 Sep, 11:20 AM',
    summary: 'Removed duplicate entry (#H-99) weighing 2.100 kg',
    status: 'COMMITTED',
    diff: {
      before: { 'Hen ID': 'H-99', 'Weight': '2.100 kg', 'Amount': '₹504.00' },
      after: { 'Status': 'Deleted from batch' }
    }
  }
];

export const initialCustomers = [
  {
    id: 'cust-1',
    name: 'Rahul Patel',
    phone: '+91 98765 43210',
    address: 'Survey 42, Mandi Bypass, Nashik',
    notes: 'Primary ledger partner, prompt weekly payments',
    createdAt: '2025-09-20T10:00:00Z',
    hens: [
      { id: 'h-101', henNumber: 'H001', type: 'MARGA', weight: 2.50, rateApplied: 300.00, notes: 'Prime male stock', createdAt: '2025-09-27' },
      { id: 'h-102', henNumber: 'H002', type: 'MARGA', weight: 2.30, rateApplied: 300.00, notes: 'Standard cage delivery', createdAt: '2025-09-27' },
      { id: 'h-103', henNumber: 'H003', type: 'MARGEE', weight: 1.80, rateApplied: 250.00, notes: 'Prime layer grade', createdAt: '2025-09-27' },
      { id: 'h-104', henNumber: 'H004', type: 'MARGEE', weight: 1.95, rateApplied: 250.00, notes: 'Medium layer size', createdAt: '2025-09-27' },
      { id: 'h-105', henNumber: 'H005', type: 'MARGA', weight: 2.60, rateApplied: 300.00, notes: 'Batch male bird', createdAt: '2025-09-27' },
      { id: 'h-106', henNumber: 'H006', type: 'MARGEE', weight: 2.20, rateApplied: 250.00, notes: 'Selected layer bird', createdAt: '2025-09-27' },
      { id: 'h-107', henNumber: 'H007', type: 'MARGA', weight: 6.00, rateApplied: 300.00, notes: 'Heavy crate male bird', createdAt: '2025-09-27' },
      { id: 'h-108', henNumber: 'H008', type: 'MARGEE', weight: 9.97, rateApplied: 250.00, notes: 'High yield stock', createdAt: '2025-09-27' }
    ],
    // Total billing = 750 + 690 + 450 + 487.5 + 780 + 550 + 1800 + 2492.5 = 8000.00
    // Paid = 3000.00, Payable = 5000.00
    payments: [
      { id: 'pay-1', amount: 3000.00, date: '2025-09-27', method: 'UPI / QR', notes: 'Advance payment received' }
    ]
  },
  {
    id: 'cust-2',
    name: 'Mahesh Patel',
    phone: '+91 98234 56781',
    address: 'Shop 12, APMC Market Yard, Pune',
    notes: 'Daily pickup partner',
    createdAt: '2025-09-22T14:30:00Z',
    hens: [
      { id: 'h-201', henNumber: 'H009', type: 'MARGA', weight: 4.00, rateApplied: 300.00, notes: 'Grade A', createdAt: '2025-09-26' },
      { id: 'h-202', henNumber: 'H010', type: 'MARGEE', weight: 4.00, rateApplied: 250.00, notes: 'Grade A', createdAt: '2025-09-26' },
      { id: 'h-203', henNumber: 'H011', type: 'MARGA', weight: 3.50, rateApplied: 300.00, notes: 'Grade A', createdAt: '2025-09-26' },
      { id: 'h-204', henNumber: 'H012', type: 'MARGEE', weight: 5.00, rateApplied: 250.00, notes: 'Grade B', createdAt: '2025-09-26' },
      { id: 'h-205', henNumber: 'H013', type: 'MARGA', weight: 3.333, rateApplied: 300.00, notes: 'Standard', createdAt: '2025-09-26' }
    ],
    // Total = 1200 + 1000 + 1050 + 1250 + 1000 = 5500.00, Payable = 5500.00
    payments: []
  },
  {
    id: 'cust-3',
    name: 'Suresh Kumar',
    phone: '+91 94231 87654',
    address: 'APMC Market Sector 2, Vashi',
    notes: 'Bulk weekend supply',
    createdAt: '2025-09-23T09:15:00Z',
    hens: [
      { id: 'h-301', henNumber: 'H014', type: 'MARGA', weight: 5.00, rateApplied: 300.00, notes: '', createdAt: '2025-09-25' },
      { id: 'h-302', henNumber: 'H015', type: 'MARGEE', weight: 5.00, rateApplied: 250.00, notes: '', createdAt: '2025-09-25' },
      { id: 'h-303', henNumber: 'H016', type: 'MARGA', weight: 5.00, rateApplied: 300.00, notes: '', createdAt: '2025-09-25' },
      { id: 'h-304', henNumber: 'H017', type: 'MARGEE', weight: 5.00, rateApplied: 250.00, notes: '', createdAt: '2025-09-25' },
      { id: 'h-305', henNumber: 'H018', type: 'MARGA', weight: 5.00, rateApplied: 300.00, notes: '', createdAt: '2025-09-25' },
      { id: 'h-306', henNumber: 'H019', type: 'MARGEE', weight: 5.00, rateApplied: 250.00, notes: '', createdAt: '2025-09-25' },
      { id: 'h-307', henNumber: 'H020', type: 'MARGA', weight: 5.00, rateApplied: 300.00, notes: '', createdAt: '2025-09-25' },
      { id: 'h-308', henNumber: 'H021', type: 'MARGEE', weight: 5.00, rateApplied: 250.00, notes: '', createdAt: '2025-09-25' },
      { id: 'h-309', henNumber: 'H022', type: 'MARGA', weight: 5.00, rateApplied: 300.00, notes: '', createdAt: '2025-09-25' },
      { id: 'h-310', henNumber: 'H023', type: 'MARGEE', weight: 5.00, rateApplied: 250.00, notes: '', createdAt: '2025-09-25' },
      { id: 'h-311', henNumber: 'H024', type: 'MARGA', weight: 4.00, rateApplied: 300.00, notes: '', createdAt: '2025-09-25' },
      { id: 'h-312', henNumber: 'H025', type: 'MARGEE', weight: 3.20, rateApplied: 250.00, notes: '', createdAt: '2025-09-25' }
    ],
    // Total = 13,000.00, Payable = 13,000.00
    payments: []
  },
  {
    id: 'cust-4',
    name: 'Priya Shah',
    phone: '+91 91234 56789',
    address: 'Station Road, Kalyan West',
    notes: 'Bi-weekly pickup',
    createdAt: '2025-09-24T11:00:00Z',
    hens: [
      { id: 'h-401', henNumber: 'H026', type: 'MARGA', weight: 4.00, rateApplied: 300.00, notes: '', createdAt: '2025-09-26' },
      { id: 'h-402', henNumber: 'H027', type: 'MARGEE', weight: 4.00, rateApplied: 250.00, notes: '', createdAt: '2025-09-26' },
      { id: 'h-403', henNumber: 'H028', type: 'MARGA', weight: 4.00, rateApplied: 300.00, notes: '', createdAt: '2025-09-26' },
      { id: 'h-404', henNumber: 'H029', type: 'MARGEE', weight: 4.00, rateApplied: 250.00, notes: '', createdAt: '2025-09-26' },
      { id: 'h-405', henNumber: 'H030', type: 'MARGA', weight: 4.00, rateApplied: 300.00, notes: '', createdAt: '2025-09-26' },
      { id: 'h-406', henNumber: 'H031', type: 'MARGEE', weight: 3.60, rateApplied: 250.00, notes: '', createdAt: '2025-09-26' }
    ],
    // Total = 6,500.00, Payable = 6,500.00
    payments: []
  },
  {
    id: 'cust-5',
    name: 'Rakesh Yadav',
    phone: '+91 98220 11223',
    address: 'GIDC Market Sector 4, Thane',
    notes: 'Direct counter settlement',
    createdAt: '2025-09-25T12:00:00Z',
    hens: [
      { id: 'h-501', henNumber: 'H032', type: 'MARGA', weight: 4.00, rateApplied: 300.00, notes: '', createdAt: '2025-09-26' },
      { id: 'h-502', henNumber: 'H033', type: 'MARGEE', weight: 4.00, rateApplied: 250.00, notes: '', createdAt: '2025-09-26' },
      { id: 'h-503', henNumber: 'H034', type: 'MARGA', weight: 4.00, rateApplied: 300.00, notes: '', createdAt: '2025-09-26' },
      { id: 'h-504', henNumber: 'H035', type: 'MARGEE', weight: 5.60, rateApplied: 250.00, notes: '', createdAt: '2025-09-26' }
    ],
    // Total = 4,800.00, Payable = 4,800.00
    payments: []
  },
  {
    id: 'cust-6',
    name: 'Amit Singh',
    phone: '+91 98111 22334',
    address: 'Pune Highway, Hadapsar',
    notes: 'Regular batch partner',
    createdAt: '2025-09-25T13:00:00Z',
    hens: [
      { id: 'h-601', henNumber: 'H036', type: 'MARGA', weight: 4.00, rateApplied: 300.00, notes: '', createdAt: '2025-09-27' },
      { id: 'h-602', henNumber: 'H037', type: 'MARGEE', weight: 4.00, rateApplied: 250.00, notes: '', createdAt: '2025-09-27' },
      { id: 'h-603', henNumber: 'H038', type: 'MARGA', weight: 4.00, rateApplied: 300.00, notes: '', createdAt: '2025-09-27' },
      { id: 'h-604', henNumber: 'H039', type: 'MARGEE', weight: 4.00, rateApplied: 250.00, notes: '', createdAt: '2025-09-27' },
      { id: 'h-605', henNumber: 'H040', type: 'MARGA', weight: 4.00, rateApplied: 300.00, notes: '', createdAt: '2025-09-27' },
      { id: 'h-606', henNumber: 'H041', type: 'MARGEE', weight: 4.00, rateApplied: 250.00, notes: '', createdAt: '2025-09-27' },
      { id: 'h-607', henNumber: 'H042', type: 'MARGA', weight: 4.00, rateApplied: 300.00, notes: '', createdAt: '2025-09-27' },
      { id: 'h-608', henNumber: 'H043', type: 'MARGEE', weight: 4.00, rateApplied: 250.00, notes: '', createdAt: '2025-09-27' },
      { id: 'h-609', henNumber: 'H044', type: 'MARGA', weight: 3.333, rateApplied: 300.00, notes: '', createdAt: '2025-09-27' }
    ],
    // Total = 9,200.00, Payable = 9,200.00
    payments: []
  },
  {
    id: 'cust-7',
    name: 'Karan Mehra',
    phone: '+91 98222 33445',
    address: 'APMC Gate 3, Vashi',
    notes: 'Prompt pay customer',
    createdAt: '2025-09-25T14:00:00Z',
    hens: [
      { id: 'h-701', henNumber: 'H045', type: 'MARGA', weight: 2.00, rateApplied: 300.00, notes: '', createdAt: '2025-09-25' },
      { id: 'h-702', henNumber: 'H046', type: 'MARGEE', weight: 1.60, rateApplied: 250.00, notes: '', createdAt: '2025-09-25' }
    ],
    // Total = 1,000, Payable = 1,000 (Sum of all 7 dues = 5000+5500+13000+6500+4800+9200+1000 = 45,000.00 exact!)
    payments: []
  }
];

export const initialAdminProfile = {
  name: 'Sakir Khan',
  role: 'Super Admin',
  email: 'sakir.khan@henoperations.com',
  phone: '+91 98765 43210',
  farmName: 'Al-Farooq Hen Operations & Mandi',
  appVersion: '1.0.0 (Admin Mobile)',
  notificationsEnabled: true,
  smsReceiptsEnabled: true,
  autoBackupEnabled: true,
  currency: '₹',
  weightUnit: 'kg'
};

export const initialRates = {
  MARGA: 300.00,
  MARGEE: 250.00,
  lastUpdated: 'Today at 06:30 AM',
  updatedBy: 'Rahul Kumar (Operator)'
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
    joinedDate: '15 Jan 2025'
  },
  {
    id: 'usr-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@henoperations.com',
    phone: '+91 96543 21098',
    role: 'Admin',
    status: 'ACTIVE',
    avatar: 'PS',
    joinedDate: '22 Aug 2025'
  },
  {
    id: 'usr-3',
    name: 'Amit Singh',
    email: 'amit.singh@henoperations.com',
    phone: '+91 95432 10987',
    role: 'Admin / Billing',
    status: 'ACTIVE',
    avatar: 'AS',
    joinedDate: '05 Sep 2025'
  },
  {
    id: 'usr-4',
    name: 'Neha Patel',
    email: 'neha.patel@henoperations.com',
    phone: '+91 98234 56781',
    role: 'User / Operator',
    status: 'ACTIVE',
    avatar: 'NP',
    joinedDate: '02 Mar 2025'
  }
];

export const initialCustomers = [
  {
    id: 'cust-1',
    name: 'Rahul Patel',
    phone: '+91 98765 43210',
    totalHens: 8,
    totalBilled: 8000,
    paidAmount: 3000,
    payableAmount: 5000,
    status: 'DUE',
    hens: [
      { id: 'h-101', henNumber: 'H001', type: 'MARGA', weight: 2.50, rateApplied: 300.00, amount: 750 },
      { id: 'h-102', henNumber: 'H002', type: 'MARGA', weight: 2.30, rateApplied: 300.00, amount: 690 },
      { id: 'h-103', henNumber: 'H003', type: 'MARGEE', weight: 1.80, rateApplied: 250.00, amount: 450 },
      { id: 'h-104', henNumber: 'H004', type: 'MARGEE', weight: 1.95, rateApplied: 250.00, amount: 487.50 },
      { id: 'h-105', henNumber: 'H005', type: 'MARGA', weight: 2.60, rateApplied: 300.00, amount: 780 }
    ],
    payments: [
      { id: 'pay-1', amount: 3000, date: '27 Sep 2025', method: 'UPI / QR', status: 'PAID' }
    ]
  },
  {
    id: 'cust-2',
    name: 'Mahesh Patel',
    phone: '+91 98234 56781',
    totalHens: 5,
    totalBilled: 5500,
    paidAmount: 0,
    payableAmount: 5500,
    status: 'DUE',
    hens: [
      { id: 'h-201', henNumber: 'H006', type: 'MARGA', weight: 4.00, rateApplied: 300.00, amount: 1200 },
      { id: 'h-202', henNumber: 'H007', type: 'MARGEE', weight: 4.00, rateApplied: 250.00, amount: 1000 }
    ],
    payments: []
  },
  {
    id: 'cust-3',
    name: 'Suresh Kumar',
    phone: '+91 94231 87654',
    totalHens: 12,
    totalBilled: 13000,
    paidAmount: 0,
    payableAmount: 13000,
    status: 'DUE',
    hens: [],
    payments: []
  },
  {
    id: 'cust-4',
    name: 'Priya Shah',
    phone: '+91 91234 56789',
    totalHens: 6,
    totalBilled: 6500,
    paidAmount: 0,
    payableAmount: 6500,
    status: 'DUE',
    hens: [],
    payments: []
  },
  {
    id: 'cust-5',
    name: 'Rakesh Yadav',
    phone: '+91 98220 11223',
    totalHens: 4,
    totalBilled: 4800,
    paidAmount: 0,
    payableAmount: 4800,
    status: 'DUE',
    hens: [],
    payments: []
  },
  {
    id: 'cust-6',
    name: 'Amit Singh',
    phone: '+91 98111 22334',
    totalHens: 9,
    totalBilled: 9200,
    paidAmount: 0,
    payableAmount: 9200,
    status: 'DUE',
    hens: [],
    payments: []
  }
];

export const enterpriseMetrics = {
  totalCustomers: 248,
  totalHens: 1284,
  outstandingAmount: 45000,
  monthlyRevenue: 342500,
  settledToday: 38500
};

export function formatINR(val) {
  const num = parseFloat(val) || 0;
  return `₹ ${num.toLocaleString('en-IN')}`;
}

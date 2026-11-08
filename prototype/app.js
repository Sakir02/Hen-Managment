/**
 * Hen Management Mobile Prototype Controller
 * Faithful simulation of React Native App & Approved JV Brand Design Tokens
 */

const STATE = {
  currentRole: 'admin', // 'admin' | 'user'
  currentTab: 'home',
  theme: 'light',
  device: 'oppo-reno',
  
  // Daily Mandi Rates (Locked standard benchmark rates)
  rates: {
    marga: 142.00,  // Male / Blue
    margee: 128.50  // Female / Teal
  },

  metrics: {
    todayIntakeKg: 1450.5,
    todayBirds: 620,
    marketTurnover: 198420,
    outstandingDue: 45200,
    todayCollections: 82400
  },

  customers: [
    { id: 'c1', name: 'Al-Madina Poultry Traders', phone: '+91 98234 56789', due: 18500, status: 'due', lastActive: 'Today, 09:30 AM' },
    { id: 'c2', name: 'Royal Chicken Mandi', phone: '+91 97123 45678', due: 0, status: 'settled', lastActive: 'Today, 08:15 AM' },
    { id: 'c3', name: 'Star Broiler Supplier', phone: '+91 99876 54321', due: 26700, status: 'due', lastActive: 'Yesterday' },
    { id: 'c4', name: 'Bismillah Chicken Center', phone: '+91 98450 11223', due: 0, status: 'settled', lastActive: '2 days ago' }
  ],

  hensBatches: [
    { id: 'b-101', customerName: 'Al-Madina Poultry Traders', type: 'MARGA', birds: 120, grossKg: 285.4, tareKg: 25.2, netKg: 260.2, rate: 142.00, amount: 36948.40, time: '10:45 AM' },
    { id: 'b-102', customerName: 'Royal Chicken Mandi', type: 'MARGEE', birds: 85, grossKg: 192.0, tareKg: 16.8, netKg: 175.2, rate: 128.50, amount: 22513.20, time: '09:15 AM' },
    { id: 'b-103', customerName: 'Star Broiler Supplier', type: 'MARGA', birds: 150, grossKg: 340.0, tareKg: 31.5, netKg: 308.5, rate: 142.00, amount: 43807.00, time: '08:00 AM' }
  ],

  payments: [
    { id: 'p-501', customerName: 'Royal Chicken Mandi', amount: 22500, mode: 'UPI', ref: 'UPI/4098234891', time: '10:15 AM' },
    { id: 'p-502', customerName: 'Al-Madina Poultry Traders', amount: 20000, mode: 'Cash', ref: 'Mandi Receipt #882', time: '09:30 AM' },
    { id: 'p-503', customerName: 'Bismillah Chicken Center', amount: 39900, mode: 'Bank Transfer', ref: 'IMPS/99214782', time: 'Yesterday' }
  ],

  chatMessages: [
    { id: 'm1', text: 'Mandi operations started for the morning shift.', sender: 'other', time: '08:00 AM', type: 'text' },
    { id: 'm2', text: 'Please confirm today’s Marga and Margee standard rates.', sender: 'me', time: '08:05 AM', type: 'text' },
    { id: 'm3', text: 'Marga is ₹142/kg, Margee is ₹128.50/kg. Standard rates are locked.', sender: 'other', time: '08:06 AM', type: 'text' },
    { id: 'm4', text: 'Voice note recorded: Gate 2 intake verified (12 crates).', sender: 'me', time: '09:20 AM', type: 'voice', duration: '0:14' }
  ],

  auditLogs: [
    { id: 'a-1', user: 'Vikram Singh (Admin)', action: 'UPDATE_RATES', details: 'Marga set to ₹142.00, Margee set to ₹128.50', time: '07:30 AM' },
    { id: 'a-2', user: 'Field Operator 1', action: 'BATCH_INTAKE', details: 'Added 120 birds for Al-Madina (Net 260.2 kg)', time: '10:45 AM' },
    { id: 'a-3', user: 'Cashier / Billing', action: 'PAYMENT_RECEIVED', details: 'Received ₹22,500 via UPI from Royal Chicken', time: '10:15 AM' }
  ]
};

// UI Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderAll();
  initClock();
  setupEventListeners();
  calculateBatchTotals();
});

function formatINR(val) {
  return '₹' + Number(val || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

function renderAll() {
  renderRateRibbon();
  renderMetrics();
  renderHensList();
  renderCustomersList();
  renderPaymentsList();
  renderChatMessages();
  renderAuditLogs();
  updateCustomerSelectOptions();
}

function initClock() {
  const update = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const timeStr = `${displayHours}:${minutes} ${ampm}`;
    const clockEl = document.getElementById('phone-clock');
    if (clockEl) clockEl.textContent = timeStr;
  };
  update();
  setInterval(update, 30000);
}

// Rate Ribbon
function renderRateRibbon() {
  const margaEl = document.getElementById('val-rate-marga');
  const margeeEl = document.getElementById('val-rate-margee');
  if (margaEl) margaEl.innerHTML = `₹${STATE.rates.marga.toFixed(2)} <span>/kg</span>`;
  if (margeeEl) margeeEl.innerHTML = `₹${STATE.rates.margee.toFixed(2)} <span>/kg</span>`;
  
  // Also update batch modal read-only rate
  const batchType = document.getElementById('batch-type')?.value || 'MARGA';
  const activeRate = batchType === 'MARGA' ? STATE.rates.marga : STATE.rates.margee;
  const lockedRateInput = document.getElementById('batch-locked-rate');
  if (lockedRateInput) lockedRateInput.value = `₹${activeRate.toFixed(2)} /kg (Locked Standard)`;
}

// Metrics
function renderMetrics() {
  const elIntake = document.getElementById('kpi-intake');
  const elBirds = document.getElementById('kpi-birds');
  const elTurnover = document.getElementById('kpi-turnover');
  const elDue = document.getElementById('kpi-due');

  if (elIntake) elIntake.textContent = `${STATE.metrics.todayIntakeKg.toLocaleString('en-IN')} kg`;
  if (elBirds) elBirds.textContent = `${STATE.metrics.todayBirds} birds`;
  if (elTurnover) elTurnover.textContent = formatINR(STATE.metrics.marketTurnover);
  if (elDue) elDue.textContent = formatINR(STATE.metrics.outstandingDue);
}

// Hens List
function renderHensList() {
  const container = document.getElementById('recent-hens-list');
  const globalContainer = document.getElementById('global-hens-list');
  if (!container && !globalContainer) return;

  const html = STATE.hensBatches.map(item => `
    <div class="list-card">
      <div class="list-card-left">
        <div class="list-avatar ${item.type === 'MARGA' ? 'avatar-blue' : 'avatar-teal'}">
          ${item.type === 'MARGA' ? 'M' : 'F'}
        </div>
        <div class="list-info">
          <h4>${item.customerName}</h4>
          <p>${item.birds} birds • Net ${item.netKg.toFixed(1)} kg • ${item.time}</p>
        </div>
      </div>
      <div class="list-card-right">
        <div class="list-amount">${formatINR(item.amount)}</div>
        <span class="badge ${item.type === 'MARGA' ? 'badge-marga' : 'badge-margee'}">${item.type}</span>
      </div>
    </div>
  `).join('');

  if (container) container.innerHTML = html;
  if (globalContainer) globalContainer.innerHTML = html;
}

// Customers List
function renderCustomersList() {
  const container = document.getElementById('customers-list');
  if (!container) return;

  const filter = document.getElementById('customer-filter-mode')?.value || 'all';
  const search = (document.getElementById('customer-search-input')?.value || '').toLowerCase();

  const filtered = STATE.customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search) || c.phone.includes(search);
    if (!matchSearch) return false;
    if (filter === 'due') return c.due > 0;
    if (filter === 'settled') return c.due === 0;
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:30px 0; color:var(--color-text-muted); font-size:12px;">No customers found matching filter.</div>`;
    return;
  }

  container.innerHTML = filtered.map(c => `
    <div class="list-card" onclick="openCustomerDetail('${c.id}')">
      <div class="list-card-left">
        <div class="list-avatar avatar-blue">
          ${c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div class="list-info">
          <h4>${c.name}</h4>
          <p>${c.phone} • ${c.lastActive}</p>
        </div>
      </div>
      <div class="list-card-right">
        <div class="list-amount" style="color: ${c.due > 0 ? '#B45309' : 'var(--color-success)'}">
          ${c.due > 0 ? formatINR(c.due) : 'Settled'}
        </div>
        <span class="badge ${c.due > 0 ? 'badge-due' : 'badge-settled'}">
          ${c.due > 0 ? 'DUE' : 'CLEARED'}
        </span>
      </div>
    </div>
  `).join('');
}

// Payments List
function renderPaymentsList() {
  const container = document.getElementById('payments-list');
  if (!container) return;

  container.innerHTML = STATE.payments.map(p => `
    <div class="list-card">
      <div class="list-card-left">
        <div class="list-avatar avatar-teal">₹</div>
        <div class="list-info">
          <h4>${p.customerName}</h4>
          <p>${p.mode} • Ref: ${p.ref} • ${p.time}</p>
        </div>
      </div>
      <div class="list-card-right">
        <div class="list-amount" style="color:var(--color-success)">+${formatINR(p.amount)}</div>
        <span class="badge badge-settled">VERIFIED</span>
      </div>
    </div>
  `).join('');
}

// Chat Messages
function renderChatMessages() {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;

  container.innerHTML = STATE.chatMessages.map(m => {
    if (m.type === 'voice') {
      return `
        <div class="chat-bubble ${m.sender}">
          <div class="voice-bubble">
            <div class="voice-play-btn" onclick="togglePlayVoice('${m.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <div class="voice-waveform">
              <div class="waveform-bar" style="height:6px"></div>
              <div class="waveform-bar" style="height:14px"></div>
              <div class="waveform-bar" style="height:18px"></div>
              <div class="waveform-bar" style="height:10px"></div>
              <div class="waveform-bar" style="height:16px"></div>
              <div class="waveform-bar" style="height:8px"></div>
            </div>
            <span style="font-size:11px; font-weight:600;">${m.duration || '0:12'}</span>
          </div>
          <span class="chat-time">${m.time}</span>
        </div>
      `;
    }
    return `
      <div class="chat-bubble ${m.sender}">
        ${m.text}
        <span class="chat-time">${m.time}</span>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

// Audit Logs
function renderAuditLogs() {
  const container = document.getElementById('audit-logs-list');
  if (!container) return;

  container.innerHTML = STATE.auditLogs.map(a => `
    <div class="list-card" style="cursor:default;">
      <div class="list-card-left">
        <div class="list-avatar avatar-blue">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <div class="list-info">
          <h4>${a.action}</h4>
          <p>${a.details}</p>
          <span style="font-size:10px; color:var(--color-text-muted);">${a.user} • ${a.time}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function updateCustomerSelectOptions() {
  const selects = ['batch-customer-select', 'payment-customer-select'];
  selects.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = STATE.customers.map(c => 
      `<option value="${c.name}">${c.name} (${c.due > 0 ? `Due ${formatINR(c.due)}` : 'Cleared'})</option>`
    ).join('');
  });
}

// Batch Weighing Calculations
function calculateBatchTotals() {
  const batchType = document.getElementById('batch-type')?.value || 'MARGA';
  const gross = parseFloat(document.getElementById('batch-gross-weight')?.value) || 0;
  const crates = parseFloat(document.getElementById('batch-crates')?.value) || 0;
  const crateTare = parseFloat(document.getElementById('batch-crate-tare')?.value) || 2.1;

  const totalTare = crates * crateTare;
  const netWeight = Math.max(0, gross - totalTare);
  const activeRate = batchType === 'MARGA' ? STATE.rates.marga : STATE.rates.margee;
  const totalAmount = netWeight * activeRate;

  const tareDisplay = document.getElementById('batch-total-tare-display');
  const netDisplay = document.getElementById('batch-net-weight-display');
  const amountDisplay = document.getElementById('batch-total-amount-display');

  if (tareDisplay) tareDisplay.textContent = `${totalTare.toFixed(1)} kg`;
  if (netDisplay) netDisplay.textContent = `${netWeight.toFixed(1)} kg`;
  if (amountDisplay) amountDisplay.textContent = formatINR(totalAmount);
}

// Navigation
function switchTab(tabId) {
  STATE.currentTab = tabId;
  document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

  const screen = document.getElementById(`screen-${tabId}`);
  if (screen) screen.classList.add('active');

  const navBtn = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
  if (navBtn) navBtn.classList.add('active');

  // Update header title
  const titleEl = document.getElementById('header-title');
  if (titleEl) {
    const titles = {
      home: 'Mandi Command Center',
      hens: 'Hens Intake & Weigh-in',
      customers: 'Customer Khata Ledger',
      payments: 'Payments & Settlement',
      chat: 'Direct Supervisor Chat',
      more: 'System & Audit Suite'
    };
    titleEl.textContent = titles[tabId] || 'Hen Management';
  }
}

// Modals
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

// Toast notification
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

// Event Listeners
function setupEventListeners() {
  // Tabs
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // Batch Calculation inputs
  ['batch-type', 'batch-gross-weight', 'batch-crates', 'batch-crate-tare'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', calculateBatchTotals);
      el.addEventListener('change', () => {
        calculateBatchTotals();
        renderRateRibbon();
      });
    }
  });

  // Add Batch Form Submit
  const batchForm = document.getElementById('form-add-batch');
  if (batchForm) {
    batchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const customer = document.getElementById('batch-customer-select').value;
      const type = document.getElementById('batch-type').value;
      const birds = parseInt(document.getElementById('batch-birds').value) || 0;
      const gross = parseFloat(document.getElementById('batch-gross-weight').value) || 0;
      const crates = parseFloat(document.getElementById('batch-crates').value) || 0;
      const crateTare = parseFloat(document.getElementById('batch-crate-tare').value) || 2.1;
      const totalTare = crates * crateTare;
      const netKg = Math.max(0, gross - totalTare);
      const activeRate = type === 'MARGA' ? STATE.rates.marga : STATE.rates.margee;
      const amount = netKg * activeRate;

      const newBatch = {
        id: `b-${Date.now().toString().slice(-4)}`,
        customerName: customer,
        type,
        birds,
        grossKg: gross,
        tareKg: totalTare,
        netKg,
        rate: activeRate,
        amount,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      STATE.hensBatches.unshift(newBatch);
      STATE.metrics.todayIntakeKg += netKg;
      STATE.metrics.todayBirds += birds;
      STATE.metrics.marketTurnover += amount;

      // Update customer due
      const custObj = STATE.customers.find(c => c.name === customer);
      if (custObj) {
        custObj.due += amount;
        custObj.status = 'due';
        STATE.metrics.outstandingDue += amount;
      }

      renderAll();
      closeModal('modal-batch-add');
      batchForm.reset();
      calculateBatchTotals();
      showToast(`Batch added: ${birds} ${type} birds (Net ${netKg.toFixed(1)} kg)`);
    });
  }

  // Add Customer Form Submit (Strictly NO address field!)
  const customerForm = document.getElementById('form-add-customer');
  if (customerForm) {
    customerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cust-name').value.trim();
      const phone = document.getElementById('cust-phone').value.trim();
      const balance = parseFloat(document.getElementById('cust-balance').value) || 0;

      if (!name || !phone) return;

      const newCust = {
        id: `c-${Date.now().toString().slice(-3)}`,
        name,
        phone,
        due: balance,
        status: balance > 0 ? 'due' : 'settled',
        lastActive: 'Just now'
      };

      STATE.customers.unshift(newCust);
      if (balance > 0) STATE.metrics.outstandingDue += balance;

      renderAll();
      closeModal('modal-add-customer');
      customerForm.reset();
      showToast(`Customer "${name}" created successfully`);
    });
  }

  // Record Payment Form Submit
  const paymentForm = document.getElementById('form-record-payment');
  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const customer = document.getElementById('payment-customer-select').value;
      const amount = parseFloat(document.getElementById('payment-amount').value) || 0;
      const mode = document.getElementById('payment-mode').value;
      const ref = document.getElementById('payment-ref').value || 'Cash Verified';

      if (amount <= 0) return;

      const newPayment = {
        id: `p-${Date.now().toString().slice(-3)}`,
        customerName: customer,
        amount,
        mode,
        ref,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      STATE.payments.unshift(newPayment);
      STATE.metrics.todayCollections += amount;

      const custObj = STATE.customers.find(c => c.name === customer);
      if (custObj) {
        custObj.due = Math.max(0, custObj.due - amount);
        if (custObj.due === 0) custObj.status = 'settled';
        STATE.metrics.outstandingDue = Math.max(0, STATE.metrics.outstandingDue - amount);
      }

      renderAll();
      closeModal('modal-record-payment');
      paymentForm.reset();
      showToast(`Payment of ${formatINR(amount)} recorded via ${mode}`);
    });
  }

  // Update Mandi Rates Submit
  const rateForm = document.getElementById('form-update-rates');
  if (rateForm) {
    rateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newMarga = parseFloat(document.getElementById('input-rate-marga').value);
      const newMargee = parseFloat(document.getElementById('input-rate-margee').value);

      if (newMarga > 0) STATE.rates.marga = newMarga;
      if (newMargee > 0) STATE.rates.margee = newMargee;

      STATE.auditLogs.unshift({
        id: `a-${Date.now().toString().slice(-4)}`,
        user: 'Vikram Singh (Admin)',
        action: 'UPDATE_RATES',
        details: `Standard rates updated: Marga ₹${STATE.rates.marga.toFixed(2)}, Margee ₹${STATE.rates.margee.toFixed(2)}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      renderAll();
      closeModal('modal-update-rates');
      showToast('Live Mandi Rates Updated & Locked');
    });
  }

  // Send Chat message
  const chatInput = document.getElementById('chat-input-text');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const send = () => {
    const text = chatInput.value.trim();
    if (!text) return;

    STATE.chatMessages.push({
      id: `m-${Date.now()}`,
      text,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    });

    chatInput.value = '';
    renderChatMessages();

    // Auto reply simulation after 1.5s
    setTimeout(() => {
      STATE.chatMessages.push({
        id: `m-reply-${Date.now()}`,
        text: 'Received and confirmed. Ledger entry synchronized.',
        sender: 'other',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      });
      renderChatMessages();
    }, 1500);
  };

  if (chatSendBtn) chatSendBtn.addEventListener('click', send);
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') send();
    });
  }

  // Audio recording simulation
  const micBtn = document.getElementById('chat-mic-btn');
  if (micBtn) {
    let recording = false;
    let recTimer = null;
    let recSeconds = 0;

    micBtn.addEventListener('click', () => {
      recording = !recording;
      if (recording) {
        micBtn.classList.add('recording');
        recSeconds = 0;
        showToast('Recording voice note...', 'info');
        recTimer = setInterval(() => {
          recSeconds++;
        }, 1000);
      } else {
        micBtn.classList.remove('recording');
        clearInterval(recTimer);
        const duration = `0:${String(recSeconds).padStart(2, '0')}`;
        STATE.chatMessages.push({
          id: `m-voice-${Date.now()}`,
          sender: 'me',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'voice',
          duration: recSeconds > 0 ? duration : '0:06'
        });
        renderChatMessages();
        showToast(`Voice note sent (${duration})`);
      }
    });
  }
}

// Device Switcher
window.setDevice = function(type) {
  STATE.device = type;
  const chassis = document.getElementById('device-chassis');
  document.querySelectorAll('.btn-device-switch').forEach(b => b.classList.remove('active'));

  chassis.className = '';
  if (type === 'oppo-reno') {
    chassis.classList.add('device-oppo-reno');
  } else if (type === 'iphone') {
    chassis.classList.add('device-iphone');
  } else if (type === 'fullscreen') {
    chassis.classList.add('device-fullscreen');
  }

  const activeBtn = document.querySelector(`.btn-device-switch[data-device="${type}"]`);
  if (activeBtn) activeBtn.classList.add('active');
};

// Role Switcher (Admin vs Operator)
window.setRole = function(role) {
  STATE.currentRole = role;
  document.querySelectorAll('.btn-role-switch').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.btn-role-switch[data-role="${role}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  const bannerRole = document.getElementById('header-user-role');
  if (bannerRole) bannerRole.textContent = role === 'admin' ? 'Super Admin' : 'Field Operator';

  showToast(`Switched view to ${role === 'admin' ? 'Super Admin' : 'Field Operator'} mode`, 'info');
};

// Theme Switcher
window.toggleTheme = function() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  STATE.theme = next;
  showToast(`Switched to ${next} theme`);
};

// Quick chat play simulator
window.togglePlayVoice = function(id) {
  showToast('Playing voice message...', 'info');
};


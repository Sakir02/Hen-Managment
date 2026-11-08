import { apiRequest } from './apiClient';
import { authStorage } from './authStorage';

/**
 * Customer Service
 * Handles customer ledgers according to JV Hen Management specifications.
 * (Name & Phone only; no Address field in creation payload).
 */
export const customerService = {
  async getCustomers() {
    return apiRequest('/customers/');
  },

  async getCustomerDetails(customerId) {
    return apiRequest(`/customers/${customerId}/`);
  },

  async createCustomer(customerData) {
    // Strictly Name & Phone (optional notes)
    return apiRequest('/customers/', {
      method: 'POST',
      body: JSON.stringify({
        name: customerData.name.trim(),
        phone: customerData.phone.trim(),
        notes: customerData.notes?.trim() || '',
      })
    });
  },

  async updateCustomer(customerId, customerData) {
    return apiRequest(`/customers/${customerId}/`, {
      method: 'PATCH',
      body: JSON.stringify(customerData)
    });
  },

  async deleteCustomer(customerId) {
    return apiRequest(`/customers/${customerId}/`, {
      method: 'DELETE'
    });
  }
};

/**
 * Hen Service
 * Handles batch hen intake for Marga & Margee hens with automatic sequential ID generation.
 * Photo selection is strictly absent.
 */
export const henService = {
  async getCustomerHens(customerId) {
    return apiRequest(`/customers/${customerId}/hens/`);
  },

  async saveBatchHens(customerId, hensArray) {
    // Maps rows for backend batch intake
    return apiRequest(`/customers/${customerId}/hens/batch/`, {
      method: 'POST',
      body: JSON.stringify({
        hens: hensArray.map(h => ({
          type: h.type, // 'MARGA' | 'MARGEE'
          weight: parseFloat(h.weight),
          rate_applied: parseFloat(h.rateApplied),
          notes: h.notes?.trim() || ''
        }))
      })
    });
  },

  async deleteHen(customerId, henId) {
    return apiRequest(`/customers/${customerId}/hens/${henId}/`, {
      method: 'DELETE'
    });
  }
};

/**
 * Payment Service
 * Records customer payments and triggers balance recalculations.
 */
export const paymentService = {
  async recordPayment(customerId, paymentData) {
    return apiRequest(`/customers/${customerId}/payments/`, {
      method: 'POST',
      body: JSON.stringify({
        amount: parseFloat(paymentData.amount),
        date: paymentData.date,
        method: paymentData.method,
        notes: paymentData.notes?.trim() || ''
      })
    });
  },

  async getCustomerPayments(customerId) {
    return apiRequest(`/customers/${customerId}/payments/`);
  }
};

/**
 * Mandi Rates Service
 */
export const rateService = {
  async getRates() {
    return apiRequest('/rates/');
  },

  async updateRates(rates) {
    return apiRequest('/rates/', {
      method: 'POST',
      body: JSON.stringify(rates)
    });
  }
};

/**
 * Authentication Service
 */
export const authService = {
  async login(identifier, password) {
    const data = await apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username: identifier, password })
    });
    if (data?.tokens) {
      await authStorage.setSession(data.tokens, data.user);
    }
    return data;
  },

  async verifyOtp(phone, otpCode) {
    const data = await apiRequest('/auth/otp/verify/', {
      method: 'POST',
      body: JSON.stringify({ phone, otp: otpCode })
    });
    if (data?.tokens) {
      await authStorage.setSession(data.tokens, data.user);
    }
    return data;
  },

  async logout() {
    await authStorage.clearSession();
    return true;
  }
};

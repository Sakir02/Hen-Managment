import { Platform } from 'react-native';
import { authStorage } from './authStorage';

/**
 * Derives the active Django REST API base URL.
 * Supports EXPO_PUBLIC_API_URL, platform-aware defaults (10.0.2.2 for Android emulator),
 * and dynamic runtime configuration.
 */
const getDefaultApiBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (typeof process !== 'undefined' && process.env?.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  // Android emulator loops back to development workstation on 10.0.2.2
  if (Platform && Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api';
  }
  return 'http://127.0.0.1:8000/api';
};

let currentApiBaseUrl = getDefaultApiBaseUrl();

export const setApiBaseUrl = (newUrl) => {
  if (newUrl && typeof newUrl === 'string') {
    currentApiBaseUrl = newUrl.replace(/\/+$/, '');
  }
};

export const getApiBaseUrl = () => currentApiBaseUrl;

/**
 * Common API Client with standard error interception and JWT Bearer token attachment.
 */
export async function apiRequest(endpoint, options = {}) {
  const token = await authStorage.getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
  };

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Parse JSON
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(
        data?.detail || data?.message || data?.error || `Request failed with status ${response.status}`
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutError = new Error('Network request timed out. Please check your connection.');
      timeoutError.isTimeout = true;
      throw timeoutError;
    }
    throw err;
  }
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Custom API error with HTTP status and i18n key for friendly UI messages.
 */
export class ApiError extends Error {
  constructor(message, status, errorKey) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorKey = errorKey; // translation key for LanguageContext
  }
}

/**
 * Map an HTTP status code + endpoint context to a translation key.
 * Falls back to generic keys so every error has a human-readable message.
 *
 * @param {number} status - HTTP response status code
 * @param {string} endpoint - The API endpoint string (e.g. '/auth/login')
 * @returns {string} - A key present in LanguageContext translations
 */
export const getErrorKey = (status, endpoint = '') => {
  // Auth-specific errors
  if (endpoint.includes('/auth/login')) {
    if (status === 401 || status === 400) return 'error_invalid_credentials';
    if (status === 404) return 'error_account_not_found';
    if (status === 429) return 'error_too_many_requests';
  }
  if (endpoint.includes('/auth/register')) {
    if (status === 409 || status === 400) return 'error_email_already_exists';
    if (status === 422) return 'error_invalid_input';
    if (status === 429) return 'error_too_many_requests';
  }
  // Session errors
  if (endpoint.includes('/study-sessions')) {
    if (status === 409) return 'error_session_already_active';
    if (status === 404) return 'error_session_not_found';
  }
  // Generic status-based fallbacks
  if (status === 400) return 'error_bad_request';
  if (status === 401) return 'error_unauthorized';
  if (status === 403) return 'error_forbidden';
  if (status === 404) return 'error_not_found';
  if (status === 429) return 'error_too_many_requests';
  if (status >= 500) return 'error_server';
  return 'error_unknown';
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

let serverClientOffset = 0;

export const getServerClientOffset = () => serverClientOffset;

export const apiCall = async (endpoint, options = {}) => {
  const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${cleanBaseUrl}${cleanEndpoint}`;
  const headers = { ...getHeaders(), ...options.headers };
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Extract server date header for clock synchronization to resolve timezone/clock drift
  const serverDate = response.headers.get('Date');
  if (serverDate) {
    try {
      const serverTime = new Date(serverDate).getTime();
      const clientTime = Date.now();
      if (!isNaN(serverTime)) {
        serverClientOffset = clientTime - serverTime;
      }
    } catch (e) {
      console.warn('Failed to parse server Date header:', e);
    }
  }

  if (!response.ok) {
    if (response.status === 403) {
      // Auto logout on token expiration
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-expired'));
    }
    const errorData = await response.json().catch(() => ({}));
    const errorKey = getErrorKey(response.status, endpoint);
    throw new ApiError(
      errorData.message || `API error: ${response.status}`,
      response.status,
      errorKey
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const authApi = {
  register: (email, password, displayName) => 
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    }),
  login: (email, password) => 
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

export const userApi = {
  getMe: () => apiCall('/users/me'),
  getOnline: () => apiCall('/users/online'),
};

export const sessionApi = {
  start: (subject) => 
    apiCall('/study-sessions/start', {
      method: 'POST',
      body: JSON.stringify({ subject }),
    }),
  stop: (id) => 
    apiCall(`/study-sessions/${id}/stop`, {
      method: 'POST',
    }),
  createManual: (subject, durationSeconds, startedAt) => 
    apiCall('/study-sessions/manual', {
      method: 'POST',
      body: JSON.stringify({ subject, durationSeconds, startedAt }),
    }),
  getActive: () => apiCall('/study-sessions/active'),
  getHistory: () => apiCall('/study-sessions'),
};

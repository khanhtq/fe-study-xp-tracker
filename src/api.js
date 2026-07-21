const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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
  const url = `${BASE_URL}${endpoint}`;
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
    throw new Error(errorData.message || `API error: ${response.status}`);
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

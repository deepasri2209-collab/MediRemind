// ─── Axios API Client (Experiment 7) ─────────────────────────────────────────
import axios from 'axios';

// Change this to your backend URL when Experiment 9/10/12 backend is running
export const BASE_URL = 'http://10.0.2.2:5000/api'; // Android emulator → localhost

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token from AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

apiClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor: handle 401
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  },
);

// ─── Medicine API calls ───────────────────────────────────────────────────────
export const medicineAPI = {
  getAll:    ()        => apiClient.get('/medicines'),
  getById:   (id: string)     => apiClient.get(`/medicines/${id}`),
  create:    (data: any)      => apiClient.post('/medicines', data),
  update:    (id: string, data: any) => apiClient.put(`/medicines/${id}`, data),
  delete:    (id: string)     => apiClient.delete(`/medicines/${id}`),
};

// ─── Reminder API calls ───────────────────────────────────────────────────────
export const reminderAPI = {
  getAll:    ()        => apiClient.get('/reminders'),
  create:    (data: any)      => apiClient.post('/reminders', data),
  updateStatus: (id: string, status: string) => apiClient.patch(`/reminders/${id}/status`, { status }),
};

// ─── User API calls ───────────────────────────────────────────────────────────
export const userAPI = {
  register:   (data: any)      => apiClient.post('/users/register', data),
  login:      (email: string, password: string) => apiClient.post('/users/login', { email, password }),
  getProfile: ()               => apiClient.get('/users/profile'),
  updateProfile: (data: any)   => apiClient.put('/users/profile', data),
};

// ─── Category (Fetch API) ─────────────────────────────────────────────────────
export const fetchCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export default apiClient;

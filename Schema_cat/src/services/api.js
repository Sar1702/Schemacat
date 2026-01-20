const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(email, password, name) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    
    if (data.data?.token) {
      this.setToken(data.data.token);
    }
    
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.data?.token) {
      this.setToken(data.data.token);
    }
    
    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // Database endpoints
  async connectDatabase(mongoUri, dbName) {
    return this.request('/db/connect', {
      method: 'POST',
      body: JSON.stringify({ mongoUri, dbName }),
    });
  }

  async getSchema() {
    return this.request('/db/schema');
  }

  // Chat endpoint
  async sendMessage(message, collectionName = null) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, collectionName }),
    });
  }

  // Health check
  async health() {
    return this.request('/health');
  }
}

const api = new ApiService();

export default api;

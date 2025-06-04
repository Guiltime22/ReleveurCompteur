import { DEVICE_CONFIG, API_ENDPOINTS } from '../Utils/constants';
import mockApiService from './mockApiService';

const USE_MOCK = true;

class ApiService {
  constructor() {
    this.baseUrl = DEVICE_CONFIG.DEFAULT_IP;
    this.timeout = DEVICE_CONFIG.TIMEOUT;
  }

  async request(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Timeout de connexion');
      }
      throw error;
    }
  }

  async detectDevice() {
    if (USE_MOCK) return mockApiService.detectDevice();

    return await this.request(API_ENDPOINTS.DEVICE_INFO);
  }

  async authenticate(password) {
    if (USE_MOCK) return mockApiService.authenticate(password);

    return await this.request(API_ENDPOINTS.AUTH, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  async getMeterData() {
    if (USE_MOCK) return mockApiService.getMeterData();

    return await this.request(API_ENDPOINTS.METRICS);
  }

  async togglePower(state) {
    if (USE_MOCK) return mockApiService.togglePower(state);

    return await this.request(API_ENDPOINTS.POWER, {
      method: 'POST',
      body: JSON.stringify({ state }),
    });
  }

  async getSecurityStatus() {
    if (USE_MOCK) return mockApiService.getSecurityStatus();
    
    return await this.request(API_ENDPOINTS.SECURITY);
  }
}

export default new ApiService();

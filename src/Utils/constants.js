export const DEVICE_CONFIG = {
  DEFAULT_IP: 'http://192.168.4.1',
  TIMEOUT: 5000,
  RETRY_ATTEMPTS: 3,
  SCAN_RANGE: {
    START: 1,
    END: 10,
  },
};

export const API_ENDPOINTS = {
  DEVICE_INFO: '/api/device/info',
  AUTH: '/api/auth',
  METRICS: '/api/metrics',
  POWER: '/api/power',
  SECURITY: '/api/security',
};

export const STORAGE_KEYS = {
  CREDENTIALS: 'device_credentials',
  DEVICE_HISTORY: 'device_history',
  METER_DATA: 'meter_data_',
  USER_SETTINGS: 'user_settings',
};

export const REFRESH_INTERVALS = {
  FAST: 2000,
  NORMAL: 5000,
  SLOW: 10000,
};

export const MOCK_PASSWORDS = ['test123', 'admin', 'password'];

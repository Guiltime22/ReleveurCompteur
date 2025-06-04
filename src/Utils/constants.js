export const DEVICE_CONFIG = {
  DEFAULT_IP: 'http://192.168.4.1',
  TIMEOUT: 5000,
  RETRY_ATTEMPTS: 3,
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
  METER_DATA: 'meter_data_cache',
  SETTINGS: 'app_settings',
};

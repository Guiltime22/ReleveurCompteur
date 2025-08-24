import {
  ESP32_BASE_IP,
  ESP32_TIMEOUT,
  ESP32_DATA_ENDPOINT,
  ESP32_CONTROL_ENDPOINT,
  ESP32_INFO_ENDPOINT,
  AUTO_REFRESH_INTERVAL,
  ENABLE_CONSOLE_LOGS,
  SHOW_DEV_INDICATOR
} from '@env';

export const APP_CONFIG = {
  USE_MOCK_DATA: false,
  
  ESP32_CONFIG: {
      BASE_IP: ESP32_BASE_IP,
      TIMEOUT: parseInt(ESP32_TIMEOUT),
      SCAN_RANGE: [1],
      ENDPOINTS: {
          DATA: ESP32_DATA_ENDPOINT,
          CONTROL: ESP32_CONTROL_ENDPOINT,
          INFO: ESP32_INFO_ENDPOINT || '/',
      },
      AP_CONFIG: {
          SSID: 'enerflow',
          DEFAULT_IP: '192.168.4.1'
      }
  },
  
  DEV_CONFIG: {
    AUTO_REFRESH_INTERVAL: parseInt(AUTO_REFRESH_INTERVAL) || 3000,
    ENABLE_CONSOLE_LOGS: ENABLE_CONSOLE_LOGS === 'true',
    SHOW_DEV_INDICATOR: SHOW_DEV_INDICATOR === 'true',
    ENABLE_CONNECTION_LOGS: true,
    ENABLE_DATA_LOGS: true,
    ENABLE_API_LOGS: true,
    ENABLE_SCAN_LOGS: true,
    ENABLE_STORAGE_LOGS: true,
  }
};

export const toggleMockMode = () => {
  APP_CONFIG.USE_MOCK_DATA = !APP_CONFIG.USE_MOCK_DATA;
  console.log(`🔄 Mode basculé vers: ${APP_CONFIG.USE_MOCK_DATA ? 'MOCK' : 'ESP32'}`);
  return APP_CONFIG.USE_MOCK_DATA;
};

export const devLog = (category, message, data = null) => {
  if (!APP_CONFIG.DEV_CONFIG.ENABLE_CONSOLE_LOGS) return;
  
  const categoryConfig = {
    'CONNECTION': APP_CONFIG.DEV_CONFIG.ENABLE_CONNECTION_LOGS,
    'DATA': APP_CONFIG.DEV_CONFIG.ENABLE_DATA_LOGS,
    'API': APP_CONFIG.DEV_CONFIG.ENABLE_API_LOGS,
    'SCAN': APP_CONFIG.DEV_CONFIG.ENABLE_SCAN_LOGS,
    'STORAGE': APP_CONFIG.DEV_CONFIG.ENABLE_STORAGE_LOGS,
    'MODE': true,
    'INIT': true,
  };
  
  if (categoryConfig[category] === false) return;
  
  const timestamp = new Date().toLocaleTimeString();
  const emoji = {
    'CONNECTION': '🔌',
    'DATA': '📊',
    'API': '📡',
    'SCAN': '🔍',
    'STORAGE': '💾',
    'MODE': '🔄',
    'INIT': '🚀',
  };
  
  const prefix = `[${timestamp}] ${emoji[category] || '📝'} ${category}:`;
  
  if (data) {
    console.log(prefix, message, data);
  } else {
    console.log(prefix, message);
  }
};

export const connectionLog = (message, data) => devLog('CONNECTION', message, data);
export const dataLog = (message, data) => devLog('DATA', message, data);
export const apiLog = (message, data) => devLog('API', message, data);
export const scanLog = (message, data) => devLog('SCAN', message, data);
export const storageLog = (message, data) => devLog('STORAGE', message, data);

export const toggleAllLogs = (enabled) => {
  APP_CONFIG.DEV_CONFIG.ENABLE_CONSOLE_LOGS = enabled;
  console.log(`🔄 Logs ${enabled ? 'activés' : 'désactivés'}`);
};

export const toggleCategoryLogs = (category, enabled) => {
  const key = `ENABLE_${category.toUpperCase()}_LOGS`;
  if (APP_CONFIG.DEV_CONFIG[key] !== undefined) {
    APP_CONFIG.DEV_CONFIG[key] = enabled;
    console.log(`🔄 Logs ${category} ${enabled ? 'activés' : 'désactivés'}`);
  }
};
export const APP_CONFIG = {
  USE_MOCK_DATA: true,

  ESP32_CONFIG: {
    BASE_URL: 'http://192.168.4.1',
    TIMEOUT: 5000,
    SCAN_RANGE: [1, 2, 3, 4, 5],
    ENDPOINTS: {
      DATA: '/xml',
      CONTROL: '/genericArgs',
      INFO: '/',
    }
  },
  
  DEV_CONFIG: {
    AUTO_REFRESH_INTERVAL: 5000,
    ENABLE_CONSOLE_LOGS: true,
    MOCK_DELAY: 600,
    SHOW_DEV_INDICATOR: true,
  }
};

export const toggleMockMode = () => {
  APP_CONFIG.USE_MOCK_DATA = !APP_CONFIG.USE_MOCK_DATA;
  console.log(`🔄 Mode basculé vers: ${APP_CONFIG.USE_MOCK_DATA ? 'MOCK' : 'ESP32'}`);
  return APP_CONFIG.USE_MOCK_DATA;
};

export const devLog = (message, data = null) => {
  if (APP_CONFIG.DEV_CONFIG.ENABLE_CONSOLE_LOGS) {
    console.log(message, data || '');
  }
};

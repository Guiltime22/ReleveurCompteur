import { APP_CONFIG, devLog } from '../config/appConfig';
import mockApiService from './mockApiService';
import esp32ApiService from './esp32ApiService';

class UnifiedApiService {
  constructor() {
    this.mockService = mockApiService;
    this.realService = esp32ApiService;
    
    devLog('🔧 UnifiedApiService initialisé');
  }

  get currentService() {
    const service = APP_CONFIG.USE_MOCK_DATA ? this.mockService : this.realService;
    return service;
  }

  get currentMode() {
    return APP_CONFIG.USE_MOCK_DATA ? 'MOCK' : 'ESP32';
  }

  async connectToDevice(device, password) {
    const service = this.currentService;
    devLog(`🔌 Connexion via ${this.currentMode}`);
    
    try {
      const result = await service.connectToDevice(device, password);
      devLog(`✅ Connexion ${this.currentMode} réussie`);
      return result;
    } catch (error) {
      devLog(`❌ Erreur connexion ${this.currentMode}`, error.message);
      throw error;
    }
  }

  async getMeterData() {
    const service = this.currentService;
    
    try {
      const data = await service.getMeterData();
      devLog(`📊 Données ${this.currentMode} récupérées`, {
        voltage: data.voltage,
        current: data.current,
        powerState: data.powerState
      });
      return data;
    } catch (error) {
      devLog(`❌ Erreur données ${this.currentMode}`, error.message);
      throw error;
    }
  }

  async togglePower(state) {
    const service = this.currentService;
    devLog(`🔌 Toggle ${this.currentMode}: ${state ? 'ON' : 'OFF'}`);
    
    try {
      const result = await service.togglePower(state);
      devLog(`✅ Toggle ${this.currentMode} réussi`);
      return result;
    } catch (error) {
      devLog(`❌ Erreur toggle ${this.currentMode}`, error.message);
      throw error;
    }
  }

  async scanNetwork() {
    const service = this.currentService;
    devLog(`🔍 Scan ${this.currentMode}...`);
    
    try {
      const devices = await service.scanNetwork();
      devLog(`✅ Scan ${this.currentMode}: ${devices.length} équipement(s)`);
      return devices;
    } catch (error) {
      devLog(`❌ Erreur scan ${this.currentMode}`, error.message);
      throw error;
    }
  }

  disconnect() {
    const service = this.currentService;
    devLog(`🔌 Déconnexion ${this.currentMode}`);
    return service.disconnect();
  }

  get isConnected() {
    return this.currentService.isConnected;
  }

  get connectedDevice() {
    return this.currentService.connectedDevice;
  }


  toggleMode() {
    const oldMode = this.currentMode;
    APP_CONFIG.USE_MOCK_DATA = !APP_CONFIG.USE_MOCK_DATA;
    const newMode = this.currentMode;
    
    devLog(`🔄 Mode basculé: ${oldMode} → ${newMode}`);
    
    if (this.isConnected) {
      this.disconnect();
      devLog('⚠️ Déconnexion automatique lors du changement de mode');
    }
    
    return newMode;
  }
}

export default new UnifiedApiService();

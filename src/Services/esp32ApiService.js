import { APP_CONFIG, connectionLog, devLog, dataLog } from '../config/appConfig';

class ESP32ApiService {
  constructor() {
    this.isConnected = false;
    this.connectedDevice = null;
    this.baseURL = `http://${APP_CONFIG.ESP32_CONFIG.BASE_IP}`;
    this.timeout = APP_CONFIG.ESP32_CONFIG.TIMEOUT;
    
    devLog('API', 'ESP32ApiService initialisé avec nouveau firmware');
  }

  async connectToDevice(device, password = null) {
    try {
      connectionLog(`ESP32: Connexion directe à ${device.ip} (firmware 4.0 - aucun mot de passe requis)`);
      this.baseURL = device.ip.startsWith('http') ? device.ip : `http://${device.ip}`;
      console.log(`🔍 baseURL configuré: ${this.baseURL}`);
      
      const response = await this.makeRequest('GET', '/');
      console.log(`🔍 Réponse de connexion reçue`);
      
      if (response) {
        this.isConnected = true;
        this.connectedDevice = device;
        connectionLog('ESP32: Connexion établie (aucune authentification nécessaire)');
        return true;
      }
      
      throw new Error('Impossible de se connecter au compteur');
    } catch (error) {
      console.log(`❌ Erreur détaillée:`, error.message);
      connectionLog('ESP32: Erreur connexion', error);
      throw new Error('Connexion échouée: ' + error.message);
    }
  }

  async getMeterData() {
    if (!this.isConnected) {
      throw new Error('Non connecté au compteur');
    }

    try {
      const jsonData = await this.makeRequest('GET', APP_CONFIG.ESP32_CONFIG.ENDPOINTS.DATA);
      
      if (!jsonData) {
        throw new Error('Aucune donnée reçue');
      }

      const parsedData = this.parseJSONResponse(jsonData);
      devLog('DATA', 'Données reçues du nouveau firmware', parsedData);
      return parsedData;
      
    } catch (error) {
      devLog('DATA', 'Erreur récupération données', error.message);
      throw new Error('Impossible de récupérer les données: ' + error.message);
    }
  }

  async togglePower(state) {
    if (!this.isConnected) {
      throw new Error('Non connecté au compteur');
    }

    try {
      const command = state ? 'ON' : 'OFF';
      const endpoint = `${APP_CONFIG.ESP32_CONFIG.ENDPOINTS.CONTROL}?arg=${command}`;
      await this.makeRequest('GET', endpoint);
      
      connectionLog(`ESP32: Commande ${command} envoyée au nouveau firmware`);

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { success: true };
      
    } catch (error) {
      connectionLog('ESP32: Erreur contrôle relais', error);
      throw new Error('Impossible de contrôler le relais: ' + error.message);
    }
  }

  async makeRequest(method, endpoint, body = null) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const options = {
        method,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json, text/html, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      if (body && method !== 'GET') {
        options.body = body;
      }

      devLog('API', `${method} ${url}`);
      
      const response = await fetch(url, options);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Timeout de connexion');
      }
      
      throw error;
    }
  }

  parseJSONResponse(jsonString) {
    try {
      dataLog('Données JSON brutes reçues du firmware', jsonString);
      
      const data = JSON.parse(jsonString);

      const parsedData = {
        aEnergy: parseFloat(data.aEnergy) || 0,
        rEnergy: parseFloat(data.rEnergy) || 0,
        powerF: parseFloat(data.powerF) || 0,
        frequency: parseFloat(data.frequency) || 0,
        voltage: parseFloat(data.voltage) || 0,
        current: parseFloat(data.current) || 0,

        d_time_v: parseFloat(data.d_time_v) || 0,
        d_time_i: parseFloat(data.d_time_i) || 0,
        sum_v2: parseFloat(data.sum_v2) || 0,
        sum_i2: parseFloat(data.sum_i2) || 0,
        delta_t: parseFloat(data.delta_t) || 0,
        max_i: parseFloat(data.max_i) || 0,

        powerState: true,
        fraudState: data.open === 'Fraud Alert',
        
        timestamp: new Date().toISOString(),
      };

      Object.keys(parsedData).forEach(key => {
        if (typeof parsedData[key] === 'number' && key !== 'powerState' && key !== 'fraudState') {
          parsedData[key] = parseFloat(parsedData[key].toFixed(2));
        }
      });

      dataLog('Données parsées du nouveau firmware', parsedData);
      return parsedData;

    } catch (error) {
      dataLog('Erreur parsing JSON du nouveau firmware', error.message);
      throw new Error('Format de données JSON invalide: ' + error.message);
    }
  }

  async scanNetwork() {
    const devices = [];
    
    devLog('SCAN', 'Scan réseau pour nouveau firmware Arduino...');

    const ip = APP_CONFIG.ESP32_CONFIG.BASE_IP;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`http://${ip}/`, {
        signal: controller.signal,
        method: 'HEAD',
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        devices.push({
          ip,
          serialNumber: `ENERGYRIA_${Date.now().toString().slice(-6)}`,
          deviceType: 'ELECTRIC_METER',
          version: '4.0.0',
          manufacturer: 'EnerGyria',
          signalStrength: 95,
        });
      }
      
    } catch (error) {
      devLog('SCAN', `${ip} non accessible - Vérifiez la connexion au WiFi "${APP_CONFIG.ESP32_CONFIG.AP_CONFIG.SSID}"`);
    }

    devLog('SCAN', `✅ Nouveau firmware: ${devices.length} équipement(s) détecté(s)`);
    return devices;
  }

  disconnect() {
    this.isConnected = false;
    this.connectedDevice = null;
    devLog('CONNECTION', 'Déconnexion du nouveau firmware');
  }
}

export default new ESP32ApiService();

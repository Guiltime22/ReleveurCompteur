import { APP_CONFIG, devLog } from '../config/appConfig';

class ESP32ApiService {
  constructor() {
    this.isConnected = false;
    this.connectedDevice = null;
    this.baseURL = APP_CONFIG.ESP32_CONFIG.BASE_URL;
    this.timeout = APP_CONFIG.ESP32_CONFIG.TIMEOUT;
    
    devLog('📡 ESP32ApiService initialisé');
  }

  async connectToDevice(device, password) {
    try {
      console.log(`📡 ESP32: Connexion à ${device.ip} (pas de mot de passe requis)`);

      const response = await this.makeRequest('GET', '/');
      
      if (response) {
        this.isConnected = true;
        this.connectedDevice = device;
        this.baseURL = `http://${device.ip}`;
        console.log('✅ ESP32: Connexion établie');
        return true;
      }
      
      throw new Error('Impossible de se connecter à l\'ESP32');
    } catch (error) {
      console.error('❌ ESP32: Erreur connexion:', error);
      throw new Error('Connexion échouée: ' + error.message);
    }
  }

  async getMeterData() {
    if (!this.isConnected) {
      throw new Error('Non connecté à l\'ESP32');
    }

    try {
      const xmlData = await this.makeRequest('GET', APP_CONFIG.ESP32_CONFIG.ENDPOINTS.DATA);
      
      if (!xmlData) {
        throw new Error('Aucune donnée reçue');
      }

      const parsedData = this.parseXMLResponse(xmlData);
      devLog('ESP32: Données reçues', parsedData);
      return parsedData;
      
    } catch (error) {
      devLog('ESP32: Erreur récupération données', error.message);
      throw new Error('Impossible de récupérer les données');
    }
  }

  async togglePower(state) {
    if (!this.isConnected) {
      throw new Error('Non connecté à l\'ESP32');
    }

    try {
      const command = state ? 'ON' : 'OFF';
      const endpoint = `${APP_CONFIG.ESP32_CONFIG.ENDPOINTS.CONTROL}?arg=${command}`;
      await this.makeRequest('GET', endpoint);
      
      console.log(`🔌 ESP32: Commande ${command} envoyée`);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ ESP32: Erreur contrôle relais:', error.message);
      throw new Error('Impossible de contrôler le relais');
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
          'Accept': 'application/xml, text/xml, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      if (body && method !== 'GET') {
        options.body = body;
      }

      devLog(`📡 ESP32: ${method} ${url}`);
      
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

  parseXMLResponse(xmlString) {
    try {
      console.log('📄 XML brut reçu de l\'ESP32:', xmlString);
      
      const extractValue = (tag) => {
        const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, 'i');
        const match = xmlString.match(regex);
        const value = match ? match[1] : null;
        console.log(`🔍 Tag ${tag}: "${value}"`);
        return value;
      };

      const data = {
        aEnergy: parseFloat(extractValue('aenergy')) || 0,
        rEnergy: parseFloat(extractValue('renergy')) || 0,
        voltage: parseFloat(extractValue('voltage')) || 0,
        current: parseFloat(extractValue('current')) || 0,
        powerF: parseFloat(extractValue('powerF')) || 0,
        frequency: parseFloat(extractValue('frequency')) || 0,
        powerState: extractValue('relay') === '1',
        fraudState: extractValue('open') === 'Fraud Alert',
        timestamp: new Date().toISOString(),
      };

      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'number' && key !== 'powerState') {
          data[key] = parseFloat(data[key].toFixed(2));
        }
      });

      console.log('📊 Données ESP32 parsées:', data);
      return data;

    } catch (error) {
      console.error('❌ ESP32: Erreur parsing XML:', error.message);
      throw new Error('Format de données invalide: ' + error.message);
    }
  }

  async scanNetwork() {
    const devices = [];
    const baseIP = '192.168.4.';
    
    devLog('🔍 ESP32: Scan réseau...');
    
    const scanPromises = APP_CONFIG.ESP32_CONFIG.SCAN_RANGE.map(async (lastOctet) => {
      const ip = `${baseIP}${lastOctet}`;
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch(`http://${ip}/`, {
          signal: controller.signal,
          method: 'HEAD',
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          devices.push({
            ip,
            serialNumber: `ESP32_${ip.split('.').pop()}`,
            deviceType: 'ELECTRIC_METER',
            version: '1.0.0',
            manufacturer: 'ESP32',
            signalStrength: Math.floor(Math.random() * 40) + 60,
          });
        }
        
      } catch (error) {
        devLog(`❌ ESP32: ${ip} non accessible`);
      }
    });

    await Promise.all(scanPromises);
    
    devLog(`✅ ESP32: ${devices.length} équipement(s) détecté(s)`);
    return devices;
  }

  disconnect() {
    this.isConnected = false;
    this.connectedDevice = null;
    devLog('🔌 ESP32: Déconnexion');
  }
}

export default new ESP32ApiService();

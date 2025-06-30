import { connectionLog, dataLog, devLog, scanLog } from "../config/appConfig";

class MockApiService {
  constructor() {
    this.devices = {
      '192.168.4.1': {
        deviceType: "ELECTRIC_METER",
        serialNumber: "CM-2024-001",
        version: "2.1.0",
        manufacturer: "TechMeter Pro"
      },
      '192.168.4.3': {
        deviceType: "ELECTRIC_METER", 
        serialNumber: "CM-2024-002",
        version: "2.0.5",
        manufacturer: "TechMeter Pro"
      }
    };
    this.isConnected = false;
    this.powerState = true;
    this.fraudState = false;
    
    devLog('INIT', 'MockApiService initialisé');
  }

  async scanNetwork() {
    scanLog('MOCK: Scan réseau...');
    const devices = [];

    for (const ip of Object.keys(this.devices)) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const device = await this.detectDevice(ip);
      if (device) {
        devices.push({
          ip,
          ...device,
          signalStrength: Math.floor(Math.random() * 40) + 60,
        });
      }
    }
    
    scanLog(`MOCK: ${devices.length} équipement(s) détecté(s)`);
    return devices;
  }

  async connectToDevice(device, password) {
    connectionLog(`MOCK: Connexion à ${device.ip} avec mot de passe: [MASQUÉ]`);
    
    if (!this.devices[device.ip]) {
      throw new Error('Device non trouvé');
    }

    // ✅ Vérifier les mots de passe valides pour le mock
    if (!['test123', 'admin'].includes(password)) {
      connectionLog('MOCK: Mot de passe incorrect');
      throw new Error('Mot de passe incorrect. Utilisez "test123" ou "admin"');
    }

    this.isConnected = true;
    this.connectedDevice = { ...device, ...this.devices[device.ip] };
    connectionLog('MOCK: Connexion établie');
    return true;
  }

  async detectDevice(ip) {
    scanLog(`Scan device à ${ip}`);

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
    
    if (this.devices[ip]) {
      scanLog(`Device trouvé à ${ip}: ${this.devices[ip].serialNumber}`);
      return this.devices[ip];
    }
    
    scanLog(`Aucun device à ${ip}`);
    return null;
  }

  async authenticate(password) {
    connectionLog('MOCK: Authentification avec: [MASQUÉ]');
    
    if (['test123', 'admin'].includes(password)) {
      return { success: true };
    } else {
      return { success: false, error: 'Mot de passe incorrect' };
    }
  }

  async getMeterData() {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (!this.isConnected) {
      throw new Error('Non connecté');
    }

    const baseData = {
      aEnergy: 1247.5,
      rEnergy: 89.2,
      voltage: 230,
      current: 12.2,
      powerF: 0.95,
      frequency: 50,
    };

    if (Math.random() < 0.05) {
      this.fraudState = !this.fraudState;
    }

     const data = {
      ...baseData,
      aEnergy: parseFloat((baseData.aEnergy + (Math.random() - 0.5) * 0.1).toFixed(2)),
      rEnergy: parseFloat((baseData.rEnergy + (Math.random() - 0.5) * 2).toFixed(2)),
      voltage: parseFloat((baseData.voltage + (Math.random() - 0.5) * 5).toFixed(2)),
      current: parseFloat((Math.max(0, baseData.current + (Math.random() - 0.5) * 2)).toFixed(2)),
      powerF: parseFloat((Math.max(0, Math.min(1, baseData.powerF + (Math.random() - 0.5) * 0.05))).toFixed(2)),
      frequency: parseFloat((baseData.frequency + (Math.random() - 0.5) * 0.2).toFixed(2)),
      
      powerState: this.powerState,
      fraudState: this.fraudState,
      timestamp: new Date().toISOString(),
    };

    dataLog('Données réelles récupérées', {
      aEnergy: data.aEnergy.toFixed(1),
      rEnergy: data.rEnergy.toFixed(1),
      voltage: data.voltage.toFixed(1),
      current: data.current.toFixed(2),
      powerF: data.powerF.toFixed(3),
      frequency: data.frequency.toFixed(1),
      fraudState: data.fraudState
    });
    
    return data;
  }

  async togglePower(state) {
    connectionLog(`MOCK: Toggle power: ${state ? 'ON' : 'OFF'}`);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    this.powerState = state;
    
    connectionLog('MOCK: État changé avec succès');
    return { success: true };
  }

  async simulateFraud() {
    dataLog('MOCK: Simulation de fraude');
    this.fraudState = true;
    return { success: true };
  }

  async clearFraud() {
    dataLog('MOCK: Effacement alerte fraude');
    this.fraudState = false;
    return { success: true };
  }


  async getSecurityStatus() {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const hasAlert = Math.random() < 0.05;
    
    return {
      status: hasAlert ? 'alert' : 'secure',
      message: hasAlert ? 'Tentative de manipulation détectée' : 'Système sécurisé',
      lastCheck: new Date().toISOString(),
    };
  }
}

export default new MockApiService();

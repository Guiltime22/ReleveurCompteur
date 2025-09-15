import { connectionLog, dataLog, devLog, scanLog } from "../config/appConfig";

class MockApiService {
  constructor() {
    this.devices = {
      '192.168.4.1': {
        deviceType: "ELECTRIC_METER",
        serialNumber: "ENERGYRIA-001",
        version: "4.0.0",
        manufacturer: "EnerGyria"
      }
    };
    this.isConnected = false;
    this.powerState = true;
    this.fraudState = false;
    
    devLog('INIT', 'MockApiService initialisé pour nouveau firmware');
  }

  async scanNetwork() {
    scanLog('MOCK: Scan réseau nouveau firmware...');
    const devices = [];

    const ip = '192.168.4.1';
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const device = await this.detectDevice(ip);
    if (device) {
      devices.push({
        ip,
        ...device,
        signalStrength: 95,
      });
    }

    scanLog(`MOCK: ${devices.length} équipement(s) détecté(s) (nouveau firmware)`);
    return devices;
  }

  async connectToDevice(device, password = null) {
    connectionLog(`MOCK: Connexion directe nouveau firmware à ${device.ip}`);
    
    if (!this.devices[device.ip]) {
      throw new Error('Équipement non trouvé');
    }

    this.isConnected = true;
    this.connectedDevice = { ...device, ...this.devices[device.ip] };
    connectionLog('MOCK: Connexion établie (aucune authentification nécessaire)');
    return true;
  }

  async detectDevice(ip) {
    scanLog(`MOCK: Scan device nouveau firmware à ${ip}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (this.devices[ip]) {
      scanLog(`MOCK: Device trouvé à ${ip}: ${this.devices[ip].serialNumber}`);
      return this.devices[ip];
    }
    
    scanLog(`MOCK: Aucun device à ${ip}`);
    return null;
  }

  async getMeterData() {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (!this.isConnected) {
      throw new Error('Non connecté');
    }

    const baseData = {
      aEnergy: 1247.5,
      rEnergy: 89.2,
      aPower: 1500.25,
      rPower: 450.75,       
      voltage: 230,
      current: 12.2,
      powerF: 0.95,
      frequency: 50,
      phase: 0.87,
    };

    if (Math.random() < 0.05) {
      this.fraudState = !this.fraudState;
    }

    const data = {
      ...baseData,
      aEnergy: parseFloat((baseData.aEnergy + (Math.random() - 0.5) * 0.1).toFixed(2)),
      rEnergy: parseFloat((baseData.rEnergy + (Math.random() - 0.5) * 2).toFixed(2)),
      aPower: parseFloat((baseData.aPower + (Math.random() - 0.5) * 50).toFixed(2)),
      rPower: parseFloat((baseData.rPower + (Math.random() - 0.5) * 20).toFixed(2)),
      voltage: parseFloat((baseData.voltage + (Math.random() - 0.5) * 5).toFixed(2)),
      current: parseFloat((Math.max(0, baseData.current + (Math.random() - 0.5) * 2)).toFixed(2)),
      powerF: parseFloat((Math.max(0, Math.min(1, baseData.powerF + (Math.random() - 0.5) * 0.05))).toFixed(2)),
      frequency: parseFloat((baseData.frequency + (Math.random() - 0.5) * 0.2).toFixed(2)),
      phase: parseFloat((baseData.phase + (Math.random() - 0.5) * 0.1).toFixed(2)),

      serialNumber: "ENERGYRIA-001",
      dateTime: new Date().toISOString(),
      fraudAlertDateTime: this.fraudState ? new Date().toISOString() : null,
      
      powerState: this.powerState,
      fraudState: this.fraudState,
      timestamp: new Date().toISOString(),
    };

    dataLog('MOCK: Données simulées nouveau firmware', {
      aEnergy: data.aEnergy.toFixed(1),
      voltage: data.voltage.toFixed(1),
      current: data.current.toFixed(2),
      powerState: data.powerState,
      fraudState: data.fraudState
    });

    return data;
  }

  async togglePower(state) {
    connectionLog(`MOCK: Toggle power nouveau firmware: ${state ? 'ON' : 'OFF'}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    this.powerState = state;
    connectionLog('MOCK: État relais changé avec succès (nouveau firmware)');
    return { success: true };
  }

  async simulateFraud() {
    dataLog('MOCK: Simulation de fraude nouveau firmware');
    this.fraudState = true;
    return { success: true };
  }

  async clearFraud() {
    dataLog('MOCK: Effacement alerte fraude nouveau firmware');
    this.fraudState = false;
    return { success: true };
  }

  disconnect() {
    this.isConnected = false;
    this.connectedDevice = null;
    devLog('CONNECTION', 'Déconnexion MOCK nouveau firmware');
  }
}

export default new MockApiService();

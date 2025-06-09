// src/services/mockApiService.js
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
    
    console.log('🔧 MockApiService initialisé');
  }

  async detectDevice(ip) {
    console.log(`🔍 Scan device à ${ip}`);
    
    // Simule un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
    
    // Retourne un device seulement pour certaines IPs
    if (this.devices[ip]) {
      console.log(`✅ Device trouvé à ${ip}:`, this.devices[ip].serialNumber);
      return this.devices[ip];
    }
    
    console.log(`❌ Aucun device à ${ip}`);
    return null;
  }

  async authenticate(password) {
    console.log(`🔐 Tentative d'authentification avec: ${password}`);
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    if (password === "test123" || password === "admin") {
      this.isConnected = true;
      console.log('✅ Authentification réussie');
      return { success: true };
    }
    
    console.log('❌ Authentification échouée');
    throw new Error('Mot de passe incorrect');
  }

  async getMeterData() {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (!this.isConnected) {
      throw new Error('Non connecté');
    }

    // Données réalistes qui varient légèrement
    const baseData = {
      power: 2.8,
      voltage: 230,
      current: 12.2,
      powerFactor: 0.95,
      frequency: 50,
      energy: 1247.5,
      dailyConsumption: 18.4,
      monthlyCost: 89.50,
      temperature: 24,
    };

    const data = {
      ...baseData,
      power: Math.max(0, baseData.power + (Math.random() - 0.5) * 0.8),
      current: Math.max(0, baseData.current + (Math.random() - 0.5) * 2),
      powerState: this.powerState,
      timestamp: new Date().toISOString(),
    };

    console.log('📊 Données récupérées:', { 
      power: data.power.toFixed(2), 
      powerState: data.powerState 
    });
    
    return data;
  }

  async togglePower(state) {
    console.log(`🔌 Toggle power: ${state ? 'ON' : 'OFF'}`);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    this.powerState = state;
    
    console.log('✅ État changé avec succès');
    return { success: true };
  }

  async getSecurityStatus() {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const hasAlert = Math.random() < 0.05; // 5% de chance d'alerte
    
    return {
      status: hasAlert ? 'alert' : 'secure',
      message: hasAlert ? 'Tentative de manipulation détectée' : 'Système sécurisé',
      lastCheck: new Date().toISOString(),
    };
  }
}

export default new MockApiService();

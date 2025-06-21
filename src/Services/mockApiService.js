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

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
    
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

    const baseData = {
      aEnergy: 1247.5,
      rEnergy: 89.2,
      voltage: 230,
      current: 12.2,
      powerF: 0.95,
      frequency: 50,
    };

     const data = {
      ...baseData,
      aEnergy: parseFloat((baseData.aEnergy + (Math.random() - 0.5) * 0.1).toFixed(2)),
      rEnergy: parseFloat((baseData.rEnergy + (Math.random() - 0.5) * 2).toFixed(2)),
      voltage: parseFloat((baseData.voltage + (Math.random() - 0.5) * 5).toFixed(2)),
      current: parseFloat((Math.max(0, baseData.current + (Math.random() - 0.5) * 2)).toFixed(2)),
      powerF: parseFloat((Math.max(0, Math.min(1, baseData.powerF + (Math.random() - 0.5) * 0.05))).toFixed(2)),
      frequency: parseFloat((baseData.frequency + (Math.random() - 0.5) * 0.2).toFixed(2)),
      
      powerState: this.powerState,
      timestamp: new Date().toISOString(),
    };

    console.log('📊 Données réelles récupérées:', {
      aEnergy: data.aEnergy.toFixed(1),
      rEnergy: data.rEnergy.toFixed(1),
      voltage: data.voltage.toFixed(1),
      current: data.current.toFixed(2),
      powerF: data.powerF.toFixed(3),
      frequency: data.frequency.toFixed(1) 
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
    
    const hasAlert = Math.random() < 0.05;
    
    return {
      status: hasAlert ? 'alert' : 'secure',
      message: hasAlert ? 'Tentative de manipulation détectée' : 'Système sécurisé',
      lastCheck: new Date().toISOString(),
    };
  }
}

export default new MockApiService();

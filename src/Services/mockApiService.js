class MockApiService {
  constructor() {
    this.isConnected = false;
    this.powerState = false;
    this.mockData = {
      power: 2.5,
      voltage: 230,
      current: 10.8,
      powerFactor: 0.95,
      dailyConsumption: 15.2,
      dailyCost: 2.28,
      activeTime: 8.5,
      peakPower: 3.2,
    };
  }

  async detectDevice() {
    // Simule un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      deviceType: "ELECTRIC_METER",
      serialNumber: "CM-TEST-001",
      version: "1.0.0",
      status: "ready"
    };
  }

  async authenticate(password) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (password === "test123") {
      this.isConnected = true;
      return { success: true };
    }
    throw new Error('Mot de passe incorrect');
  }

  async getMeterData() {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!this.isConnected) {
      throw new Error('Non connecté');
    }

    // Simule des données qui changent légèrement
    return {
      ...this.mockData,
      power: this.mockData.power + (Math.random() - 0.5) * 0.5,
      current: this.mockData.current + (Math.random() - 0.5) * 2,
      powerState: this.powerState,
    };
  }

  async togglePower(state) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    this.powerState = state;
    return { success: true };
  }

  async getSecurityStatus() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simule parfois une alerte
    const hasAlert = Math.random() < 0.1; // 10% de chance d'alerte
    
    return {
      alert: hasAlert,
      message: hasAlert ? "Tentative d'ouverture détectée" : "Système sécurisé",
      details: hasAlert ? "Contactez le service technique" : null,
    };
  }
}

export default new MockApiService();

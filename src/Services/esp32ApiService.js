import { APP_CONFIG, connectionLog, devLog, dataLog } from '../config/appConfig';

class ESP32ApiService {
    constructor() {
        this.isConnected = false;
        this.connectedDevice = null;
        this.baseURL = `http://${APP_CONFIG.ESP32_CONFIG.BASE_IP}`;
        this.timeout = APP_CONFIG.ESP32_CONFIG.TIMEOUT;
        this.isAuthenticated = false;
        devLog('API', 'ESP32ApiService initialisé - Compatible firmware client 5.3');
    }

    // ✅ AUTHENTIFICATION adaptée au format du client {"message":"OK"}
    async authenticate(password) {
        if (!this.isConnected) {
            throw new Error('Non connecté au compteur');
        }

        try {
            connectionLog(`ESP32: Tentative d'authentification avec "${password}"`);
            const response = await this.makeRequest('GET', `/access?password=${password}`);
            
            if (!response) {
                throw new Error('Pas de réponse du serveur');
            }
            
            const responseText = response.trim();
            devLog('AUTH', `Réponse serveur brute: "${responseText}"`);
            
            try {
                const data = JSON.parse(responseText);
                devLog('AUTH', 'Réponse JSON parsée:', data);
                
                // ✅ FORMAT DU CLIENT: {"message":"OK"} ou {"message":"Incorrecte"}
                if (data.message === "OK") {
                    this.isAuthenticated = true;
                    connectionLog('ESP32: ✅ Authentification réussie');
                    return { success: true, access: true, message: 'Authentification réussie' };
                } else if (data.message === "Incorrecte") {
                    this.isAuthenticated = false;
                    connectionLog('ESP32: ❌ Mot de passe incorrect');
                    throw new Error('Mot de passe incorrect');
                } else {
                    this.isAuthenticated = false;
                    const errorMsg = `Réponse inattendue: ${data.message}`;
                    connectionLog(`ESP32: ❌ ${errorMsg}`);
                    throw new Error(errorMsg);
                }
            } catch (parseError) {
                this.isAuthenticated = false;
                const errorMsg = `Erreur parsing JSON: "${responseText}"`;
                connectionLog(`ESP32: ❌ ${errorMsg}`);
                throw new Error('Réponse serveur invalide');
            }
        } catch (error) {
            connectionLog('ESP32: Erreur authentification', error.message);
            this.isAuthenticated = false;
            throw error;
        }
    }

    // ✅ TOGGLE POWER adapté au format {"message":"OK"} du client
    async togglePower(state) {
        if (!this.isConnected || !this.isAuthenticated) {
            throw new Error('Non connecté ou non authentifié');
        }

        try {
            const command = state ? 'ON' : 'OFF';
            const endpoint = `/relay?state=${command}`;
            connectionLog(`ESP32: Envoi commande relais ${command}`);
            
            // ✅ CORRECTION: Timeout plus long pour OFF→ON
            const timeoutMs = (!state && command === 'ON') ? 8000 : 5000; // 8s pour OFF→ON, 5s pour OFF←ON
            
            const response = await this.makeRequestWithTimeout(endpoint, timeoutMs);
            
            if (!response) {
                throw new Error('Pas de réponse du serveur pour le relais');
            }

            const responseText = response.trim();
            devLog('RELAY', `Réponse relais brute: "${responseText}"`);
            
            try {
                const result = JSON.parse(responseText);
                devLog('RELAY', 'Réponse relais JSON:', result);
                
                // ✅ FORMAT DU CLIENT: {"message":"OK"}
                if (result.message === "OK") {
                    connectionLog(`ESP32: ✅ Commande ${command} confirmée`);
                    return { success: true, message: `Relais ${command} avec succès` };
                } else {
                    throw new Error(`Commande relais échouée: ${result.message}`);
                }
            } catch (parseError) {
                // Fallback si pas JSON
                devLog('RELAY', 'Pas du JSON, analyse texte...', parseError);
                if (responseText.includes('OK') || responseText.includes('success')) {
                    connectionLog(`ESP32: ✅ Commande ${command} confirmée (texte)`);
                    return { success: true, message: `Relais ${command} avec succès` };
                } else {
                    throw new Error('Réponse relais inattendue');
                }
            }
        } catch (error) {
            connectionLog('ESP32: Erreur contrôle relais', error.message);
            throw error;
        }
    }

    // ✅ NOUVELLE MÉTHODE - Request avec timeout custom
    async makeRequestWithTimeout(endpoint, timeoutMs = 5000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const url = `${this.baseURL}${endpoint}`;
            const options = {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json, text/html, */*',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            };

            devLog('API', `GET ${url} (timeout: ${timeoutMs}ms)`);
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

    // ✅ MÉTHODE SPÉCIALE pour le relais avec timeout court
    async makeRequestWithShortTimeout(endpoint, timeoutMs = 2000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const url = `${this.baseURL}${endpoint}`;
            const options = {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json, text/html, */*',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            };

            devLog('API', `GET ${url} (timeout: ${timeoutMs}ms)`);
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

    async connectToDevice(device, password = null) {
        try {
            connectionLog(`ESP32: Connexion à ${device.ip} (firmware client 5.3)`);
            this.baseURL = device.ip.startsWith('http') ? device.ip : `http://${device.ip}`;
            
            const response = await this.makeRequest('GET', '/');
            
            if (response) {
                this.isConnected = true;
                this.connectedDevice = device;
                connectionLog('ESP32: ✅ Connexion réseau établie');
                
                // Si un mot de passe est fourni, authentifier automatiquement
                if (password) {
                    await this.authenticate(password);
                }
                
                return true;
            }
            
            throw new Error('Impossible de se connecter au compteur');
        } catch (error) {
            connectionLog('ESP32: Erreur connexion', error.message);
            throw error;
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
            
            // ✅ CORRECTION: Vérifier l'état d'authentification depuis les données
            const accessState = parsedData.accessState;
            if (this.isAuthenticated && !accessState) {
                connectionLog('ESP32: Session expirée côté serveur');
                this.isAuthenticated = false;
            }
            
            devLog('DATA', 'Données reçues firmware client 5.3', parsedData);
            return parsedData;
        } catch (error) {
            devLog('DATA', 'Erreur récupération données', error.message);
            throw error;
        }
    }

    // ✅ DISCONNECT adapté (son handleDisconnect ne retourne rien)
    async disconnect() {
        if (this.isConnected) {
            try {
                // ✅ ADAPTATION: Utiliser timeout court car pas de réponse attendue
                await this.makeRequestWithShortTimeout('/disconnect', 1000);
                connectionLog('ESP32: Déconnexion envoyée');
            } catch (error) {
                // ✅ Ignorer les timeouts (normal avec son code)
                if (error.message.includes('Timeout') || error.message.includes('timeout')) {
                    connectionLog('ESP32: Déconnexion envoyée (timeout attendu)');
                } else {
                    devLog('API', 'Erreur déconnexion (ignorée)', error.message);
                }
            }
        }
        
        this.isAuthenticated = false;
        this.isConnected = false;
        this.connectedDevice = null;
        devLog('CONNECTION', 'Déconnexion complète firmware client 5.3');
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
            dataLog('Données JSON brutes reçues firmware client 5.3', jsonString);
            const toBool = (v) => v === true || v === 1 || v === '1' || v === 'true' || v === 'on' || v === 'ON';
            const data = JSON.parse(jsonString);

            const parsedData = {
                aEnergy: parseFloat(data.aEnergy) || 0,
                rEnergy: parseFloat(data.rEnergy) || 0,
                powerF: parseFloat(data.powerF) || 0,
                frequency: parseFloat(data.frequency) || 0,
                voltage: parseFloat(data.voltage) || 0,
                current: parseFloat(data.current) || 0,
                aPower: parseFloat(data.aPower) || 0,
                rPower: parseFloat(data.rPower) || 0,
                phase: parseFloat(data.phase) || 0,
                serialNumber: data.num || 'UNKNOWN',
                dateTime: data.DateTime || null,
                fraudAlertDateTime: data.fAlertDateTime || null,
                powerState: toBool(data.relay),
                fraudState: toBool(data.fAlert),
                accessState: toBool(data.access), // État d'authentification
                timestamp: new Date().toISOString(),
            };

            Object.keys(parsedData).forEach(key => {
                if (typeof parsedData[key] === 'number' && !['powerState', 'fraudState', 'accessState'].includes(key)) {
                    parsedData[key] = parseFloat(parsedData[key].toFixed(2));
                }
            });

            dataLog('Données parsées firmware client 5.3', {
                powerState: `${parsedData.powerState} (${typeof parsedData.powerState})`,
                fraudState: `${parsedData.fraudState} (${typeof parsedData.fraudState})`,
                accessState: `${parsedData.accessState} (${typeof parsedData.accessState})`
            });

            return parsedData;
        } catch (error) {
            dataLog('Erreur parsing JSON firmware client 5.3', error.message);
            throw new Error('Format de données JSON invalide: ' + error.message);
        }
    }

    async scanNetwork() {
        const devices = [];
        let scanStatus = null;
        devLog('SCAN', 'Scan réseau firmware client 5.3...');

        const ip = APP_CONFIG.ESP32_CONFIG.BASE_IP;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`http://${ip}/data`, {
                signal: controller.signal,
                method: 'GET',
            });

            clearTimeout(timeoutId);
            scanStatus = response.status;

            if (response.status === 200) {
                devices.push({
                    ip,
                    serialNumber: `ENERGYRIA_${Date.now().toString().slice(-6)}`,
                    deviceType: 'ELECTRIC_METER',
                    version: '5.3.0', // ✅ Version client
                    manufacturer: 'EnerGyria',
                    signalStrength: 95,
                });
            }

        } catch (error) {
            scanStatus = `${error}`;
            devLog('SCAN', `${ip} non accessible - Vérifiez la connexion au WiFi "${APP_CONFIG.ESP32_CONFIG.AP_CONFIG.SSID}"`);
        }

        devLog('SCAN', `✅ Firmware client 5.3: ${devices.length} équipement(s) détecté(s)`);
        return { devices, scanStatus, ip };
    }

    // Getters
    get authenticated() {
        return this.isAuthenticated;
    }
}

export default new ESP32ApiService();

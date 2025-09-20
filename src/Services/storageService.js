import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageLog } from '../config/appConfig';

class StorageService {
    KEYS = {
        CREDENTIALS: 'device_credentials',
        DEVICE_HISTORY: 'device_history',
        METER_DATA: 'meter_data_',
        USER_SETTINGS: 'user_settings',
        CONNECTED_DEVICE: 'connected_device', // ✅ AJOUTÉ
    };

    // ✅ MÉTHODE MANQUANTE - Sauvegarder device connecté
    async saveConnectedDevice(device) {
        try {
            if (!device || !device.ip || !device.serialNumber) {
                storageLog('Device invalide pour la sauvegarde de connexion', device);
                return;
            }

            const deviceData = {
                ...device,
                lastConnected: new Date().toISOString(),
            };

            await AsyncStorage.setItem(this.KEYS.CONNECTED_DEVICE, JSON.stringify(deviceData));
            storageLog('Device connecté sauvegardé', device.ip);
        } catch (error) {
            storageLog('Erreur sauvegarde device connecté', error);
        }
    }

    // ✅ MÉTHODE MANQUANTE - Récupérer device connecté
    async getConnectedDevice() {
        try {
            const deviceData = await AsyncStorage.getItem(this.KEYS.CONNECTED_DEVICE);
            if (deviceData) {
                const device = JSON.parse(deviceData);
                storageLog('Device connecté récupéré', device.ip);
                return device;
            }
            return null;
        } catch (error) {
            storageLog('Erreur récupération device connecté', error);
            return null;
        }
    }

    // ✅ MÉTHODE MANQUANTE - Supprimer device connecté
    async clearConnectedDevice() {
        try {
            await AsyncStorage.removeItem(this.KEYS.CONNECTED_DEVICE);
            storageLog('Device connecté supprimé');
        } catch (error) {
            storageLog('Erreur suppression device connecté', error);
        }
    }

    async storeCredentials(password) {
        try {
            if (!password || typeof password !== 'string') {
                throw new Error('Mot de passe invalide');
            }

            await AsyncStorage.setItem(this.KEYS.CREDENTIALS, password);
            storageLog('Identifiants sauvegardés');
        } catch (error) {
            storageLog('Erreur stockage identifiants', error);
            throw error;
        }
    }

    async getCredentials() {
        try {
            const password = await AsyncStorage.getItem(this.KEYS.CREDENTIALS);
            if (password) {
                storageLog('Identifiants récupérés');
            }
            return password;
        } catch (error) {
            storageLog('Erreur récupération identifiants', error);
            return null;
        }
    }

    async removeCredentials() {
        try {
            await AsyncStorage.removeItem(this.KEYS.CREDENTIALS);
            storageLog('Identifiants supprimés');
        } catch (error) {
            storageLog('Erreur suppression identifiants', error);
        }
    }

    async saveDeviceToHistory(device) {
        try {
            if (!device || !device.ip || !device.serialNumber) {
                storageLog('Device invalide pour l\'historique', device);
                return;
            }

            const history = await this.getDeviceHistory();
            const existingIndex = history.findIndex(d => d.ip === device.ip);
            const deviceWithTimestamp = {
                ...device,
                lastConnected: new Date().toISOString(),
            };

            if (existingIndex >= 0) {
                history[existingIndex] = deviceWithTimestamp;
                storageLog('Device mis à jour dans l\'historique');
            } else {
                history.unshift(deviceWithTimestamp);
                storageLog('Nouveau device ajouté à l\'historique');
            }

            const limitedHistory = history.slice(0, 10);
            await AsyncStorage.setItem(
                this.KEYS.DEVICE_HISTORY,
                JSON.stringify(limitedHistory)
            );
        } catch (error) {
            storageLog('Erreur sauvegarde historique', error);
        }
    }

    async getDeviceHistory() {
        try {
            const history = await AsyncStorage.getItem(this.KEYS.DEVICE_HISTORY);
            const parsedHistory = history ? JSON.parse(history) : [];
            const validHistory = parsedHistory.filter(device =>
                device && device.ip && device.serialNumber
            );
            storageLog(`Historique récupéré: ${validHistory.length} devices`);
            return validHistory;
        } catch (error) {
            storageLog('Erreur récupération historique', error);
            return [];
        }
    }

    async saveMeterData(deviceIP, data) {
        try {
            if (!deviceIP || !data) {
                console.warn('⚠️ Données invalides pour la sauvegarde');
                return;
            }

            const dataWithTimestamp = {
                ...data,
                timestamp: new Date().toISOString(),
            };
            await AsyncStorage.setItem(
                `${this.KEYS.METER_DATA}${deviceIP}`,
                JSON.stringify(dataWithTimestamp)
            );
            storageLog(`Données sauvegardées pour ${deviceIP}`);
        } catch (error) {
            storageLog('Erreur sauvegarde données compteur', error);
        }
    }

    async getMeterData(deviceIP) {
        try {
            if (!deviceIP) return null;
            const data = await AsyncStorage.getItem(`${this.KEYS.METER_DATA}${deviceIP}`);
            const parsedData = data ? JSON.parse(data) : null;
            if (parsedData) {
                storageLog(`Données récupérées pour ${deviceIP}`);
            }
            return parsedData;
        } catch (error) {
            storageLog('Erreur récupération données compteur', error);
            return null;
        }
    }

    async saveUserSettings(settings) {
        try {
            await AsyncStorage.setItem(this.KEYS.USER_SETTINGS, JSON.stringify(settings));
            storageLog('Paramètres sauvegardés');
        } catch (error) {
            storageLog('Erreur sauvegarde paramètres', error);
        }
    }

    async getUserSettings() {
        try {
            const settings = await AsyncStorage.getItem(this.KEYS.USER_SETTINGS);
            const defaultSettings = {
                autoRefresh: true,
                refreshInterval: 3000,
                notifications: true,
                theme: 'light',
            };
            const userSettings = settings ? { ...defaultSettings, ...JSON.parse(settings) } : defaultSettings;
            storageLog('Paramètres récupérés');
            return userSettings;
        } catch (error) {
            storageLog('Erreur récupération paramètres', error);
            return {
                autoRefresh: true,
                refreshInterval: 3000,
                notifications: true,
                theme: 'light',
            };
        }
    }

    async clearCache() {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(key =>
                key.startsWith(this.KEYS.METER_DATA) ||
                key === this.KEYS.DEVICE_HISTORY
            );
            await AsyncStorage.multiRemove(cacheKeys);
            storageLog(`Cache vidé: ${cacheKeys.length} éléments supprimés`);
        } catch (error) {
            storageLog('Erreur vidage cache', error);
            throw error;
        }
    }
}

// ✅ CORRECTION - Export direct de l'instance
export const storageService = new StorageService();
export default storageService;

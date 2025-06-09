// src/services/storageService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  KEYS = {
    CREDENTIALS: 'device_credentials',
    DEVICE_HISTORY: 'device_history',
    METER_DATA: 'meter_data_',
    USER_SETTINGS: 'user_settings',
  };

  // Gestion des identifiants avec validation
  async storeCredentials(password) {
    try {
      if (!password || typeof password !== 'string') {
        throw new Error('Mot de passe invalide');
      }
      await AsyncStorage.setItem(this.KEYS.CREDENTIALS, password);
      console.log('💾 Identifiants sauvegardés');
    } catch (error) {
      console.error('❌ Erreur stockage identifiants:', error);
      throw error;
    }
  }

  async getCredentials() {
    try {
      const password = await AsyncStorage.getItem(this.KEYS.CREDENTIALS);
      if (password) {
        console.log('🔑 Identifiants récupérés');
      }
      return password;
    } catch (error) {
      console.error('❌ Erreur récupération identifiants:', error);
      return null;
    }
  }

  async removeCredentials() {
    try {
      await AsyncStorage.removeItem(this.KEYS.CREDENTIALS);
      console.log('🗑️ Identifiants supprimés');
    } catch (error) {
      console.error('❌ Erreur suppression identifiants:', error);
    }
  }

  // Historique des équipements avec validation
  async saveDeviceToHistory(device) {
    try {
      if (!device || !device.ip || !device.serialNumber) {
        console.warn('⚠️ Device invalide pour l\'historique:', device);
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
        console.log('📝 Device mis à jour dans l\'historique');
      } else {
        history.unshift(deviceWithTimestamp);
        console.log('📝 Nouveau device ajouté à l\'historique');
      }

      // Garder seulement les 10 derniers
      const limitedHistory = history.slice(0, 10);
      
      await AsyncStorage.setItem(
        this.KEYS.DEVICE_HISTORY, 
        JSON.stringify(limitedHistory)
      );
    } catch (error) {
      console.error('❌ Erreur sauvegarde historique:', error);
    }
  }

  async getDeviceHistory() {
    try {
      const history = await AsyncStorage.getItem(this.KEYS.DEVICE_HISTORY);
      const parsedHistory = history ? JSON.parse(history) : [];
      
      // Valider chaque device dans l'historique
      const validHistory = parsedHistory.filter(device => 
        device && device.ip && device.serialNumber
      );
      
      console.log(`📚 Historique récupéré: ${validHistory.length} devices`);
      return validHistory;
    } catch (error) {
      console.error('❌ Erreur récupération historique:', error);
      return [];
    }
  }

  // Données des compteurs avec validation
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
      
      console.log(`💾 Données sauvegardées pour ${deviceIP}`);
    } catch (error) {
      console.error('❌ Erreur sauvegarde données compteur:', error);
    }
  }

  async getMeterData(deviceIP) {
    try {
      if (!deviceIP) return null;
      
      const data = await AsyncStorage.getItem(`${this.KEYS.METER_DATA}${deviceIP}`);
      const parsedData = data ? JSON.parse(data) : null;
      
      if (parsedData) {
        console.log(`📊 Données récupérées pour ${deviceIP}`);
      }
      
      return parsedData;
    } catch (error) {
      console.error('❌ Erreur récupération données compteur:', error);
      return null;
    }
  }

  // Paramètres utilisateur
  async saveUserSettings(settings) {
    try {
      await AsyncStorage.setItem(this.KEYS.USER_SETTINGS, JSON.stringify(settings));
      console.log('⚙️ Paramètres sauvegardés');
    } catch (error) {
      console.error('❌ Erreur sauvegarde paramètres:', error);
    }
  }

  async getUserSettings() {
    try {
      const settings = await AsyncStorage.getItem(this.KEYS.USER_SETTINGS);
      const defaultSettings = {
        autoRefresh: true,
        refreshInterval: 5000,
        notifications: true,
        theme: 'light',
      };
      
      const userSettings = settings ? { ...defaultSettings, ...JSON.parse(settings) } : defaultSettings;
      console.log('⚙️ Paramètres récupérés');
      return userSettings;
    } catch (error) {
      console.error('❌ Erreur récupération paramètres:', error);
      return {
        autoRefresh: true,
        refreshInterval: 5000,
        notifications: true,
        theme: 'light',
      };
    }
  }

  // Vider le cache
  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        key.startsWith(this.KEYS.METER_DATA) || 
        key === this.KEYS.DEVICE_HISTORY
      );
      await AsyncStorage.multiRemove(cacheKeys);
      console.log('🗑️ Cache vidé:', cacheKeys.length, 'éléments supprimés');
    } catch (error) {
      console.error('❌ Erreur vidage cache:', error);
      throw error;
    }
  }
}

export default new StorageService();

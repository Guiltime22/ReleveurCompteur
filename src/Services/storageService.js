import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../Utils/constants';

class StorageService {

  async storeCredentials(password) {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.CREDENTIALS, password);
    } catch (error) {
      console.error('Erreur stockage sécurisé:', error);
      throw error;
    }
  }

  async getCredentials() {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.CREDENTIALS);
    } catch (error) {
      console.error('Erreur récupération sécurisée:', error);
      return null;
    }
  }

  async removeCredentials() {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.CREDENTIALS);
    } catch (error) {
      console.error('Erreur suppression sécurisée:', error);
    }
  }

  async storeMeterData(data) {
    try {
      const jsonData = JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
      });
      await AsyncStorage.setItem(STORAGE_KEYS.METER_DATA, jsonData);
    } catch (error) {
      console.error('Erreur stockage données:', error);
    }
  }

  async getMeterData() {
    try {
      const jsonData = await AsyncStorage.getItem(STORAGE_KEYS.METER_DATA);
      return jsonData ? JSON.parse(jsonData) : null;
    } catch (error) {
      console.error('Erreur récupération données:', error);
      return null;
    }
  }

  async storeSettings(settings) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Erreur stockage paramètres:', error);
    }
  }

  async getSettings() {
    try {
      const jsonData = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return jsonData ? JSON.parse(jsonData) : {};
    } catch (error) {
      console.error('Erreur récupération paramètres:', error);
      return {};
    }
  }
}

export default new StorageService();

import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import apiService from '../Services/apiService';
import storageService from '../Services/storageService';

export const useDeviceConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [error, setError] = useState(null);

  const detectDevice = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const info = await apiService.detectDevice();
      setDeviceInfo(info);
      setIsConnected(true);
      return info;
    } catch (err) {
      const errorMessage = err.message || 'Aucun compteur détecté';
      setError(errorMessage);
      setIsConnected(false);
      Alert.alert('Erreur de connexion', errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = async (password) => {
    setIsLoading(true);
    
    try {
      const result = await apiService.authenticate(password);
      if (result.success) {
        await storageService.storeCredentials(password);
        return true;
      }
      throw new Error('Authentification échouée');
    } catch (err) {
      Alert.alert('Erreur', 'Mot de passe incorrect');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    setIsConnected(false);
    setDeviceInfo(null);
    setError(null);
    await storageService.removeCredentials();
  };

  useEffect(() => {
    const autoConnect = async () => {
      const savedPassword = await storageService.getCredentials();
      if (savedPassword) {
        const device = await detectDevice();
        if (device) {
          await authenticate(savedPassword);
        }
      }
    };
    autoConnect();
  }, []);

  return {
    isConnected,
    isLoading,
    deviceInfo,
    error,
    detectDevice,
    authenticate,
    disconnect,
  };
};

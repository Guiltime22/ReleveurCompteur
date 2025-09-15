import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, AppState } from 'react-native';

import apiService from '../services/apiService';
import storageService from '../services/storageService';
import { COLORS } from '../styles/global/colors';
import { TYPOGRAPHY } from '../styles/global/typography';
import { connectionLog, dataLog, storageLog, devLog } from '../config/appConfig';

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [meterData, setMeterData] = useState(null);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        devLog('INIT', 'Initialisation de l\'application...');

        if (isConnected) {
          disconnect();
          console.log('🔄 App redémarrée - Réinitialisation de la connexion');
        }
        
        const userSettings = await storageService.getUserSettings();
        storageLog('Paramètres utilisateur chargés', userSettings);
        
        devLog('INIT', 'Initialisation terminée');
      } catch (error) {
        devLog('INIT', 'Erreur d\'initialisation', error);
        setInitializationError(error.message);
      } finally {
        setTimeout(() => {
          setIsInitialized(true);
        }, 1000);
      }
    };

    initializeApp();
  }, []);


  useEffect(() => {
    if (isConnected && connectedDevice && connectedDevice.ip) {
      connectionLog('Démarrage auto-refresh des données');
      const interval = setInterval(() => {
        fetchMeterDataInternal();
      }, 3000);
      setAutoRefreshInterval(interval);

      return () => {
        if (interval) {
          connectionLog('Arrêt auto-refresh des données');
          clearInterval(interval);
        }
      };
    } else {
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        setAutoRefreshInterval(null);
      }
    }
  }, [isConnected, connectedDevice]);

  const connectToDeviceInternal = async (device, isSilent = false) => {
    if (!device || !device.ip) {
      throw new Error('Équipement invalide');
    }

    try {
      connectionLog(`Connexion à ${device.serialNumber} (${device.ip}) - Aucun mot de passe requis`);

      await apiService.connectToDevice(device);
      
      setIsConnected(true);
      setConnectedDevice(device);
      setError(null);

      await storageService.saveDeviceToHistory(device);
      
      await fetchMeterDataInternal();
      connectionLog('Connexion réussie');
      return true;
    } catch (err) {
      connectionLog('Erreur de connexion', err.message);
      if (!isSilent) {
        setError(err.message);
        Alert.alert('Erreur de connexion', err.message);
      }
      throw err;
    }
  };

  const connectToDevice = async (device) => {
    setIsLoading(true);
    try {
      const result = await connectToDeviceInternal(device, false);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMeterDataInternal = async () => {
    if (!isConnected || !connectedDevice || !connectedDevice.ip) {
      dataLog('Impossible de récupérer les données: pas connecté');
      return;
    }

    try {
      const data = await apiService.getMeterData();
      setMeterData(data);
      await storageService.saveMeterData(connectedDevice.ip, data);
      
      if (error) {
        setError(null);
      }
    } catch (err) {
      dataLog('Erreur récupération données', err.message);
      setError('Erreur lors de la récupération des données');
    }
  };

  const fetchMeterData = async () => {
    await fetchMeterDataInternal();
  };

  const refreshData = async () => {
    await fetchMeterDataInternal();
  };

  const togglePower = async () => {
    if (!isConnected || !meterData) {
      Alert.alert('Erreur', 'Aucun équipement connecté');
      return;
    }

    try {
      const newState = !meterData.powerState;
      connectionLog(`Changement état alimentation: ${newState ? 'ON' : 'OFF'}`);
      
      await apiService.togglePower(newState);

      setMeterData(prev => ({ ...prev, powerState: newState }));

      setTimeout(async () => {
        await fetchMeterDataInternal();
      }, 500);
      
      Alert.alert('Succès', `Compteur ${newState ? 'allumé' : 'éteint'} avec succès`);
    } catch (err) {
      connectionLog('Erreur toggle power', err.message);
      Alert.alert('Erreur', 'Impossible de changer l\'état du compteur');
    }
  };

  const disconnect = async () => {
    connectionLog('Déconnexion...');
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
      setAutoRefreshInterval(null);
    }

    setIsConnected(false);
    setConnectedDevice(null);
    setMeterData(null);
    setError(null);

    connectionLog('Déconnexion terminée');
  };

  if (!isInitialized) {
    return (
      <View style={loadingStyles.container}>
        <View style={loadingStyles.content}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={loadingStyles.title}>ENERGYRIA</Text>
          <Text style={loadingStyles.subtitle}>Initialisation en cours...</Text>
          
          {initializationError && (
            <View style={loadingStyles.errorContainer}>
              <Text style={loadingStyles.errorText}>
                Erreur: {initializationError}
              </Text>
            </View>
          )}
        </View>
        
        <View style={loadingStyles.footer}>
          <Text style={loadingStyles.footerText}>Version 4.0.0</Text>
        </View>
      </View>
    );
  }

  const value = {
    isConnected,
    isLoading,
    connectedDevice,
    meterData,
    error,
    connectToDevice,
    fetchMeterData,
    togglePower,
    disconnect,
    refreshData,
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};

const loadingStyles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.medium,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: COLORS.danger + '10',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.danger,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 40,
  },
  footerText: {
    ...TYPOGRAPHY.small,
    color: COLORS.medium,
    textAlign: 'center',
  },
};

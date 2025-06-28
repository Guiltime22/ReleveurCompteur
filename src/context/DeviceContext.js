import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import mockApiService from '../services/mockApiService';
import apiService from '../services/apiService';
import storageService from '../services/storageService';
import { COLORS } from '../styles/global/colors';
import { TYPOGRAPHY } from '../styles/global/typography';

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
        console.log('🚀 Initialisation de l\'application...');
        
        const userSettings = await storageService.getUserSettings();
        console.log('📋 Paramètres utilisateur chargés:', userSettings);

        const savedPassword = await storageService.getCredentials();
        const deviceHistory = await storageService.getDeviceHistory();
        
        if (savedPassword && deviceHistory.length > 0) {
          console.log('🔄 Tentative de reconnexion automatique...');
          const lastDevice = deviceHistory[0];

          if (lastDevice && lastDevice.ip && lastDevice.serialNumber) {
            try {
              await connectToDeviceInternal(lastDevice, savedPassword, true);
              console.log('✅ Reconnexion automatique réussie');
            } catch (error) {
              console.log('❌ Reconnexion automatique échouée:', error.message);
            }
          }
        }
        
        console.log('✅ Initialisation terminée');
      } catch (error) {
        console.error('❌ Erreur d\'initialisation:', error);
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
      console.log('🔄 Démarrage auto-refresh des données');
      const interval = setInterval(() => {
        fetchMeterDataInternal();
      }, 5000);
      setAutoRefreshInterval(interval);
      
      return () => {
        if (interval) {
          console.log('⏹️ Arrêt auto-refresh des données');
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

  const connectToDeviceInternal = async (device, password, isSilent = false) => {
    if (!device || !device.ip) {
      throw new Error('Équipement invalide');
    }
    
    try {
      console.log(`🔌 Connexion à ${device.serialNumber} (${device.ip})`);

      await apiService.connectToDevice(device, password);
      
      setIsConnected(true);
      setConnectedDevice(device);
      setError(null);
      
      // Sauvegarder dans le cache
      await storageService.saveDeviceToHistory(device);
      await storageService.storeCredentials(password);
      
      // Récupérer les données initiales
      await fetchMeterDataInternal();
      
      console.log('✅ Connexion réussie');
      return true;
      
    } catch (err) {
      console.error('❌ Erreur de connexion:', err.message);
      if (!isSilent) {
        setError(err.message);
        Alert.alert('Erreur de connexion', err.message);
      }
      throw err;
    }
  };

  // Fonction publique de connexion
  const connectToDevice = async (device, password) => {
    setIsLoading(true);
    try {
      const result = await connectToDeviceInternal(device, password, false);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction interne de récupération des données
  const fetchMeterDataInternal = async () => {
    if (!isConnected || !connectedDevice || !connectedDevice.ip) {
      console.log('⚠️ Impossible de récupérer les données: pas connecté');
      return;
    }
    
    try {
      const data = await apiService.getMeterData();
      setMeterData(data);
      
      // Sauvegarder les données dans le cache
      await storageService.saveMeterData(connectedDevice.ip, data);
      
      // Réinitialiser l'erreur si la récupération réussit
      if (error) {
        setError(null);
      }
    } catch (err) {
      console.error('❌ Erreur récupération données:', err.message);
      setError('Erreur lors de la récupération des données');
    }
  };

  // Fonction publique de récupération des données
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
      console.log(`🔌 Changement état alimentation: ${newState ? 'ON' : 'OFF'}`);
      
      await apiService.togglePower(newState);
      
      // Mettre à jour les données locales immédiatement
      setMeterData(prev => ({
        ...prev,
        powerState: newState
      }));
      
      // Rafraîchir les données après un délai
      setTimeout(fetchMeterDataInternal, 1000);
      
      Alert.alert(
        'Succès', 
        `Compteur ${newState ? 'allumé' : 'éteint'} avec succès`
      );
    } catch (err) {
      console.error('❌ Erreur toggle power:', err.message);
      Alert.alert('Erreur', 'Impossible de changer l\'état du compteur');
    }
  };

  const disconnect = async () => {
    console.log('🔌 Déconnexion...');
    
    // Arrêter l'auto-refresh
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
      setAutoRefreshInterval(null);
    }
    
    // Reset tous les états
    setIsConnected(false);
    setConnectedDevice(null);
    setMeterData(null);
    setError(null);
    
    // Supprimer les identifiants
    await storageService.removeCredentials();
    
    console.log('✅ Déconnexion terminée');
  };

  // Loading Screen pendant l'initialisation
  if (!isInitialized) {
    return (
      <View style={loadingStyles.container}>
        <View style={loadingStyles.content}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={loadingStyles.title}>Releveur Compteur</Text>
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
          <Text style={loadingStyles.footerText}>
            Version 1.0.0
          </Text>
        </View>
      </View>
    );
  }

  const value = {
    // États
    isConnected,
    isLoading,
    connectedDevice,
    meterData,
    error,
    
    // Actions
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

// Hook personnalisé pour utiliser le contexte
export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};

// Styles pour l'écran de chargement
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

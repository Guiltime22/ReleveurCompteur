import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import apiService from '../Services/apiService';
import storageService from '../Services/storageService';

export const useMeterData = () => {
  const [meterData, setMeterData] = useState(null);
  const [powerState, setPowerState] = useState(false);
  const [securityStatus, setSecurityStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [metrics, security] = await Promise.all([
        apiService.getMeterData(),
        apiService.getSecurityStatus(),
      ]);

      setMeterData(metrics);
      setPowerState(metrics.powerState);
      setSecurityStatus(security);
      setLastUpdate(new Date());

      await storageService.storeMeterData({
        metrics,
        security,
        powerState: metrics.powerState,
      });

    } catch (error) {
      console.error('Erreur récupération données:', error);
      
      const cachedData = await storageService.getMeterData();
      if (cachedData) {
        setMeterData(cachedData.metrics);
        setPowerState(cachedData.powerState);
        setSecurityStatus(cachedData.security);
      }
      
      Alert.alert('Erreur', 'Impossible de récupérer les données');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePower = async (newState) => {
    try {
      const result = await apiService.togglePower(newState);
      if (result.success) {
        setPowerState(newState);
        Alert.alert(
          'Succès', 
          `Compteur ${newState ? 'allumé' : 'éteint'} avec succès`
        );
        
        setTimeout(fetchData, 1000);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de changer l\'état du compteur');
    }
  };

  return {
    meterData,
    powerState,
    securityStatus,
    isLoading,
    lastUpdate,
    fetchData,
    togglePower,
  };
};

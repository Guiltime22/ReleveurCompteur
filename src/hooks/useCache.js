import { useState, useEffect } from 'react';
import storageService from '../services/storageService';

export const useCache = () => {
  const [cacheSize, setCacheSize] = useState(0);
  const [deviceCount, setDeviceCount] = useState(0);

  const calculateCacheSize = async () => {
    try {
      const history = await storageService.getDeviceHistory();
      setDeviceCount(history.length);
      
      // Estimation simple de la taille du cache
      const estimatedSize = history.length * 2; // 2KB par device estimé
      setCacheSize(estimatedSize);
    } catch (error) {
      console.error('Erreur calcul cache:', error);
    }
  };

  const clearCache = async () => {
    try {
      await storageService.clearCache();
      setCacheSize(0);
      setDeviceCount(0);
      return true;
    } catch (error) {
      console.error('Erreur vidage cache:', error);
      return false;
    }
  };

  useEffect(() => {
    calculateCacheSize();
  }, []);

  return {
    cacheSize,
    deviceCount,
    calculateCacheSize,
    clearCache,
  };
};

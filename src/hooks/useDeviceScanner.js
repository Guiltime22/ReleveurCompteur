// src/hooks/useDeviceScanner.js
import { useState, useCallback } from 'react';
import apiService from '../services/apiService'; // ✅ Ajouter cette ligne

export const useDeviceScanner = () => {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  const scanNetwork = useCallback(async () => {
    setIsScanning(true);
    setError(null);
    
    try {
      console.log('🔍 Démarrage scan...');
      
      // ✅ Utiliser apiService au lieu de scan manuel
      const foundDevices = await apiService.scanNetwork();
      setDevices(foundDevices);
      
      if (foundDevices.length === 0) {
        setError('Aucun équipement détecté. Vérifiez votre connexion WiFi.');
      }
      
    } catch (err) {
      console.error('❌ Erreur scan:', err);
      setError('Erreur lors du scan: ' + err.message);
      setDevices([]);
    } finally {
      setIsScanning(false);
    }
  }, []);

  const stopScan = useCallback(() => {
    setIsScanning(false);
  }, []);

  return {
    devices,
    isScanning,
    error,
    scanNetwork,
    stopScan,
    startScan: scanNetwork, // Alias pour compatibilité
  };
};

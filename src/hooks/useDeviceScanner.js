// src/hooks/useDeviceScanner.js
import { useState } from 'react';
import mockApiService from '../services/mockApiService';

export const useDeviceScanner = () => {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  const scanDevice = async (ip) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const deviceInfo = await mockApiService.detectDevice(ip);
      clearTimeout(timeoutId);

      if (deviceInfo) {
        return {
          ip: ip,
          ...deviceInfo,
          status: 'available',
          lastSeen: new Date(),
          signalStrength: Math.floor(Math.random() * 100) + 1,
        };
      }
    } catch (error) {
      console.log(`❌ Erreur scan ${ip}:`, error.message);
    }
    
    // Retourner null explicitement
    return null;
  };

  const scanNetwork = async () => {
    setIsScanning(true);
    setError(null);
    setDevices([]); // Vider la liste avant le scan

    try {
      const baseIP = '192.168.4.';
      const scanPromises = [];

      // Scanner quelques IPs pour la démo
      for (let i = 1; i <= 5; i++) {
        scanPromises.push(scanDevice(`${baseIP}${i}`));
      }

      const results = await Promise.allSettled(scanPromises);
      
      // ✅ CORRECTION : Filtrer TOUS les éléments null/undefined
      const foundDevices = results
        .map(result => {
          if (result.status === 'fulfilled') {
            return result.value; // Peut être null
          }
          return null; // Promesse rejetée
        })
        .filter(device => {
          // ✅ Vérification stricte : device doit exister ET avoir une IP
          return device !== null && 
                 device !== undefined && 
                 device.ip && 
                 device.serialNumber;
        });

      console.log(`📱 Devices valides trouvés:`, foundDevices.length);
      setDevices(foundDevices);

      if (foundDevices.length === 0) {
        setError('Aucun équipement détecté sur le réseau');
      }
    } catch (err) {
      console.error('❌ Erreur scan réseau:', err);
      setError('Erreur lors du scan réseau');
    } finally {
      setIsScanning(false);
    }
  };

  return {
    devices,
    isScanning,
    error,
    scanNetwork,
  };
};

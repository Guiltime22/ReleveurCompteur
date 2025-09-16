import { useState, useCallback } from 'react';
import apiService from '../services/apiService';
import { scanLog } from '../config/appConfig';

export const useDeviceScanner = () => {
    const [devices, setDevices] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState(null);
    const [scanStatus, setScanStatus] = useState(null);
    const [ip, setIp] = useState(null);

    const scanNetwork = useCallback(async () => {
        setIsScanning(true);
        setError(null);
        setScanStatus(null);  // ✅ RESET STATUS

        try {
            scanLog('Démarrage scan...');
            const result = await apiService.scanNetwork();  // ✅ RÉCUPÈRE OBJET AVEC STATUS
            
            setDevices(result.devices || []);  // ✅ EXTRAIRE DEVICES
            setScanStatus(result.scanStatus);
            setIp(result.ip);   // ✅ EXTRAIRE STATUS

            if (result.devices.length === 0) {
                setError('Aucun équipement détecté. Vérifiez votre connexion WiFi.');
            }
        } catch (err) {
            console.error('❌ Erreur scan:', err);
            setError('Erreur lors du scan: ' + err.message);
            setDevices([]);
            setScanStatus('ERROR');  // ✅ STATUS D'ERREUR
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
        scanStatus,
        ip,
        scanNetwork,
        stopScan,
        startScan: scanNetwork,
    };
};

import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { connectionLog, devLog } from '../config/appConfig';

export const useWiFiMonitor = (deviceIP, isConnected, onDisconnect) => {
    const [isOnline, setIsOnline] = useState(true);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isWifiEnabled, setIsWifiEnabled] = useState(true); // ✅ NOUVEAU
    const intervalRef = useRef(null);
    const netInfoUnsubscribe = useRef(null);
    const maxFailedAttempts = 3;
    const checkIntervalMs = 5000; // 5 secondes

    // ✅ Surveillance native du WiFi
    useEffect(() => {
        const setupNetInfoListener = () => {
            netInfoUnsubscribe.current = NetInfo.addEventListener(state => {
                devLog('WIFI_NATIVE', `État réseau: ${JSON.stringify(state)}`);
                
                const wifiConnected = state.isConnected && state.type === 'wifi';
                const prevWifiState = isWifiEnabled;
                
                setIsWifiEnabled(wifiConnected);
                
                // ✅ Détection de désactivation WiFi
                if (prevWifiState && !wifiConnected && isConnected) {
                    connectionLog('WIFI_NATIVE: WiFi désactivé - Déconnexion forcée');
                    
                    Alert.alert(
                        "WiFi désactivé", 
                        "La connexion WiFi a été désactivée. Vous allez être déconnecté de l'équipement.",
                        [{
                            text: "OK", 
                            onPress: () => {
                                connectionLog('WIFI_NATIVE: Retour au scanner suite à désactivation WiFi');
                                onDisconnect();
                            }
                        }]
                    );
                }
            });
        };

        setupNetInfoListener();

        return () => {
            if (netInfoUnsubscribe.current) {
                netInfoUnsubscribe.current();
            }
        };
    }, [isConnected, isWifiEnabled, onDisconnect]);

    // ✅ Vérification par ping (comme avant)
    const checkConnection = useCallback(async () => {
        if (!deviceIP || !isConnected || !isWifiEnabled) return;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

            const response = await fetch(`http://${deviceIP}/data`, {
                method: 'GET',
                signal: controller.signal,
                headers: { 
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                // Connexion réussie
                if (failedAttempts > 0) {
                    devLog('WIFI', '✅ Connexion ESP32 rétablie');
                    setFailedAttempts(0);
                }
                if (!isOnline) {
                    setIsOnline(true);
                }
            } else {
                throw new Error(`HTTP ${response.status}`);
            }

        } catch (error) {
            devLog('WIFI', `❌ Échec ping ESP32 (${deviceIP}): ${error.message}`);
            
            setFailedAttempts(prev => {
                const newCount = prev + 1;
                devLog('WIFI', `🔄 Tentative ${newCount}/${maxFailedAttempts}`);

                if (newCount >= maxFailedAttempts && isOnline && isWifiEnabled) {
                    devLog('WIFI', '🚨 ESP32 considéré comme déconnecté - Déconnexion automatique');
                    setIsOnline(false);
                    
                    Alert.alert(
                        "Équipement inaccessible", 
                        "L'équipement ne répond plus. Vous allez être déconnecté.",
                        [{ 
                            text: "OK", 
                            onPress: () => {
                                connectionLog('WIFI: Déconnexion automatique par timeout');
                                onDisconnect();
                            }
                        }]
                    );
                }
                return newCount;
            });
        }
    }, [deviceIP, isConnected, isOnline, failedAttempts, onDisconnect, maxFailedAttempts, isWifiEnabled]);

    // ✅ Démarrer/arrêter le monitoring par ping
    useEffect(() => {
        if (deviceIP && isConnected && isWifiEnabled) {
            devLog('WIFI', `🔄 Démarrage monitoring pour ${deviceIP}`);
            intervalRef.current = setInterval(checkConnection, checkIntervalMs);
            
            return () => {
                if (intervalRef.current) {
                    devLog('WIFI', '🛑 Arrêt monitoring');
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            };
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, [deviceIP, isConnected, checkConnection, isWifiEnabled]);

    // ✅ Cleanup général
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (netInfoUnsubscribe.current) {
                netInfoUnsubscribe.current();
            }
        };
    }, []);

    return { 
        isOnline: isOnline && isWifiEnabled, // ✅ Combiné
        failedAttempts,
        maxFailedAttempts,
        isWifiEnabled // ✅ NOUVEAU
    };
};

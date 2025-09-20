import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, Alert, AppState } from 'react-native';
import esp32ApiService from '../services/esp32ApiService';
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
    
    // ✅ ÉTATS AUTHENTIFICATION basés sur l'équipement
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    
    // États WiFi simulés (pas de useWiFiMonitor pour l'instant)
    const [isOnline] = useState(true);
    const [failedAttempts] = useState(0);
    const [maxFailedAttempts] = useState(5);
    const [isWifiEnabled] = useState(true);

    // Initialisation
    useEffect(() => {
        const initializeApp = async () => {
            try {
                devLog('INIT', 'Initialisation de l\'application...');
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

    // ✅ CONNEXION avec vérification de l'état d'access UNE SEULE FOIS
    const connectToDeviceInternal = async (device, isSilent = false) => {
        if (!device || !device.ip) {
            throw new Error('Équipement invalide');
        }

        try {
            connectionLog(`Connexion à ${device.serialNumber} (${device.ip})`);
            
            await esp32ApiService.connectToDevice(device);
            
            setIsConnected(true);
            setConnectedDevice(device);
            setError(null);

            // ✅ Vérifier l'état d'authentification UNE SEULE FOIS après connexion
            try {
                const response = await esp32ApiService.getAccessState();
                const isAuth = response.access === true || response.access === 1;
                
                connectionLog(`État access initial: ${response.access} -> ${isAuth ? 'authentifié' : 'non authentifié'}`);
                
                setIsAuthenticated(isAuth);
                
                if (!isAuth) {
                    setShowAuthModal(true);
                }
            } catch (authError) {
                connectionLog('Erreur vérification auth initiale:', authError.message);
                setIsAuthenticated(false);
                setShowAuthModal(true);
            }

            // Sauvegarde
            try {
                const enrichedDevice = {
                    ...device,
                    connectedAt: new Date().toISOString(),
                    userAgent: 'EnerGyria Mobile v1.0.0'
                };
                
                await storageService.saveDeviceToHistory(enrichedDevice);
                await storageService.saveConnectedDevice(enrichedDevice);
                devLog('STORAGE', 'Device sauvegardé avec succès');
            } catch (storageError) {
                devLog('STORAGE', 'Erreur sauvegarde device (non critique)', storageError);
            }

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

    // ✅ AUTHENTIFICATION avec ton endpoint
    const authenticate = async (password) => {
        setIsLoading(true);
        try {
            connectionLog('Tentative authentification avec ESP32...');
            
            const success = await esp32ApiService.authenticate(password);
            
            if (success) {
                setIsAuthenticated(true);
                setShowAuthModal(false);
                connectionLog('CONTEXT: Authentification réussie');
                
                // Charger les données après authentification
                await fetchMeterDataInternal();
            } else {
                throw new Error('Authentification échouée');
            }
            
        } catch (error) {
            connectionLog('CONTEXT: Erreur authentification', error.message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ ANNULATION AUTHENTIFICATION
    const handleAuthCancel = async () => {
        connectionLog('CONTEXT: Authentification annulée');
        setShowAuthModal(false);
        
        // Déconnexion complète
        await disconnectInternal();
    };

    // ✅ RÉCUPÉRATION DES DONNÉES - SANS vérification auth constante
    const fetchMeterDataInternal = async () => {
        if (!isConnected || !connectedDevice || !isAuthenticated) {
            dataLog('Impossible de récupérer les données: non connecté ou non authentifié');
            return;
        }

        try {
            const data = await esp32ApiService.getMeterData();
            setMeterData(data);
            
            // ✅ PAS de vérification access automatique - ça crée le loop !
            // On fait confiance à l'état isAuthenticated
            
            // Sauvegarde non bloquante
            try {
                const enrichedData = {
                    ...data,
                    retrievedAt: new Date().toISOString(),
                };
                await storageService.saveMeterData(connectedDevice.ip, enrichedData);
            } catch (storageError) {
                devLog('STORAGE', 'Erreur sauvegarde meter data (non critique)', storageError);
            }
            
            if (error) {
                setError(null);
            }
        } catch (err) {
            dataLog('Erreur récupération données', err.message);
            
            // ✅ SEULEMENT si erreur 401/403 = problème auth
            if (err.message.includes('401') || err.message.includes('403') || err.message.includes('Unauthorized')) {
                connectionLog('Erreur auth détectée via getMeterData');
                setIsAuthenticated(false);
                setShowAuthModal(true);
            } else {
                setError('Erreur lors de la récupération des données');
            }
        }
    };

    const fetchMeterData = async () => {
        await fetchMeterDataInternal();
    };

    const refreshData = async () => {
        await fetchMeterDataInternal();
    };

    // ✅ TOGGLE POWER CORRIGÉ
    const togglePower = async () => {
        if (!isConnected || !isAuthenticated || !meterData || !isOnline || !isWifiEnabled) {
            let message = 'Impossible de contrôler le relais: ';
            if (!isWifiEnabled) message += 'WiFi désactivé';
            else if (!isOnline) message += 'équipement hors ligne';
            else if (!isAuthenticated) message += 'non authentifié';
            else message += 'non connecté';
            
            Alert.alert('Erreur', message);
            return;
        }

        try {
            const currentState = meterData.powerState || meterData.relay || false;
            const newState = !currentState;
            
            connectionLog(`Toggle relais: ${currentState} -> ${newState}`);
            
            // ✅ CORRECTION: Utilise togglePower() qui existe vraiment
            const result = await esp32ApiService.togglePower(newState);
            
            if (result && result.success) {
                // Mise à jour optimiste
                setMeterData(prev => ({ 
                    ...prev, 
                    powerState: newState,
                    relay: newState
                }));
                
                // Refresh des données après un délai
                setTimeout(async () => {
                    await fetchMeterDataInternal();
                }, 1500);
            } else {
                throw new Error('Erreur lors du contrôle du relais');
            }
            
        } catch (err) {
            connectionLog('Erreur toggle power', err.message);
            
            // Si erreur auth, déclencher la modal
            if (err.message.includes('401') || err.message.includes('403') || err.message.includes('Unauthorized')) {
                connectionLog('Erreur auth détectée via togglePower');
                setIsAuthenticated(false);
                setShowAuthModal(true);
            }
            
            throw err;
        }
    };

    const disconnectInternal = async () => {
        connectionLog('Déconnexion interne...');
        
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
            setAutoRefreshInterval(null);
        }

        try {
            await esp32ApiService.disconnect();
        } catch (error) {
            devLog('API', 'Erreur déconnexion API (non critique)', error);
        }

        try {
            await storageService.clearConnectedDevice();
        } catch (storageError) {
            devLog('STORAGE', 'Erreur nettoyage storage (non critique)', storageError);
        }

        // Reset TOUS les états
        setIsConnected(false);
        setConnectedDevice(null);
        setMeterData(null);
        setError(null);
        setIsAuthenticated(false);
        setShowAuthModal(false);
        connectionLog('Déconnexion interne terminée');
    };

    const disconnect = async () => {
        await disconnectInternal();
    };

    // ✅ Auto-refresh SIMPLE - seulement si connecté ET authentifié
    useEffect(() => {
        if (isConnected && isAuthenticated && connectedDevice) {
            connectionLog('Démarrage auto-refresh des données (5s)');
            const interval = setInterval(() => {
                fetchMeterDataInternal();
            }, 5000); // 5 secondes au lieu de 3
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
    }, [isConnected, isAuthenticated, connectedDevice]);

    // ❌ SUPPRIMÉ : Vérification périodique de l'auth (causait le loop)

    // Gestion de l'état de l'app
    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === 'active' && isConnected && isAuthenticated && connectedDevice) {
                devLog('APP_STATE', 'App active - Rafraîchissement des données');
                fetchMeterDataInternal();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription?.remove();
    }, [isConnected, isAuthenticated, connectedDevice]);

    if (!isInitialized) {
        return (
            <View style={loadingStyles.container}>
                <View style={loadingStyles.content}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={loadingStyles.title}>ENERGYRIA</Text>
                    <Text style={loadingStyles.subtitle}>Initialisation en cours...</Text>
                    {initializationError && (
                        <View style={loadingStyles.errorContainer}>
                            <Text style={loadingStyles.errorText}>Erreur: {initializationError}</Text>
                        </View>
                    )}
                </View>
                <View style={loadingStyles.footer}>
                    <Text style={loadingStyles.footerText}>Version 1.0.0</Text>
                </View>
            </View>
        );
    }

    const value = {
        // États de base
        isConnected,
        isLoading,
        connectedDevice,
        meterData,
        error,
        
        // États WiFi simulés
        isOnline,
        failedAttempts,
        maxFailedAttempts,
        isWifiEnabled,
        
        // États authentification basés sur l'équipement
        isAuthenticated,
        showAuthModal,
        
        // Actions de base
        connectToDevice,
        fetchMeterData,
        togglePower,
        disconnect,
        refreshData,
        
        // Actions authentification
        authenticate,
        setShowAuthModal,
        handleAuthCancel,
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

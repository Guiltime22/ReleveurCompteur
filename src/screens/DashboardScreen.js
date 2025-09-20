import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    Alert,
    Modal,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDevice } from '../context/DeviceContext';
import Card from '../components/ui/Card';
import PowerToggle from '../components/device/PowerToggle';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AuthModal from '../components/layout/authModal';
import { dashboardScreenStyles } from '../styles/screens/dashboardScreenStyles';
import { COLORS } from '../styles/global/colors';
import { SPACING } from '../styles/global/spacing';

export default function DashboardScreen({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [showDataModal, setShowDataModal] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const {
        // États de base
        isConnected,
        connectedDevice,
        meterData,
        refreshData,
        togglePower,
        disconnect,
        // États WiFi
        isOnline,
        failedAttempts,
        maxFailedAttempts,
        // États authentification ✅
        isAuthenticated,
        showAuthModal,
        authenticate,
        handleAuthCancel,
        setShowAuthModal,
        isLoading
    } = useDevice();

    useEffect(() => {
        if (isConnected && isAuthenticated && connectedDevice) {
            const loadData = async () => {
                setIsDataLoading(true);
                try {
                    await refreshData();
                    setTimeout(() => {
                        setIsDataLoading(false);
                    }, 1500);
                } catch (error) {
                    console.error('Erreur chargement données:', error);
                    setIsDataLoading(false);
                }
            };

            loadData();
        } else {
            setIsDataLoading(false);
        }
    }, [isConnected, isAuthenticated, connectedDevice]);

    const onRefresh = async () => {
        if (!isOnline || !isAuthenticated) {
            Alert.alert('Impossible de rafraîchir', 'Hors ligne ou non authentifié');
            return;
        }
        
        setRefreshing(true);
        try {
            await refreshData();
        } catch (error) {
            console.error('Erreur refresh:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const handlePowerToggle = () => {
        if (isDataLoading || !meterData) {
            Alert.alert('Attention', 'Veuillez attendre que les données soient chargées');
            return;
        }

        if (!isOnline) {
            Alert.alert('Hors ligne', 'Impossible de contrôler le relais, équipement hors ligne');
            return;
        }

        if (!isAuthenticated) {
            Alert.alert('Non authentifié', 'Veuillez vous authentifier pour contrôler le relais');
            return;
        }

        const action = meterData.powerState ? 'éteindre' : 'allumer';
        Alert.alert(
            'Confirmation',
            `Voulez-vous ${action} le compteur ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Confirmer',
                    onPress: async () => {
                        try {
                            await togglePower();
                        } catch (error) {
                            Alert.alert('Erreur', error.message);
                        }
                    },
                    style: meterData.powerState ? 'destructive' : 'default'
                },
            ]
        );
    };

    const handleDisconnect = () => {
        Alert.alert(
            'Déconnexion',
            'Voulez-vous vous déconnecter du compteur ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Déconnecter',
                    onPress: () => {
                        disconnect();
                        navigation.navigate('Scanner');
                    },
                    style: 'destructive'
                },
            ]
        );
    };

    const handleShowData = () => {
        if (isDataLoading || !meterData || !isAuthenticated) {
            Alert.alert('Attention', 'Veuillez attendre que les données soient chargées et vous authentifier');
            return;
        }

        setShowDataModal(true);
    };

    // ✅ Redirection si pas connecté
    if (!isConnected || !connectedDevice) {
        return (
            <View style={dashboardScreenStyles.disconnectedContainer}>
                <Text style={dashboardScreenStyles.disconnectedText}>
                    Aucun compteur connecté.{'\n'}
                    Veuillez scanner et vous connecter à un équipement.
                </Text>
            </View>
        );
    }

    const getMetricIcon = (type) => {
        const icons = {
            aEnergy: { name: 'battery-charging', color: COLORS.success },
            rEnergy: { name: 'battery-half', color: COLORS.warning },
            voltage: { name: 'trending-up', color: COLORS.primary },
            current: { name: 'pulse', color: COLORS.secondary },
            powerF: { name: 'analytics', color: COLORS.info },
            frequency: { name: 'radio', color: COLORS.purple },
        };
        return icons[type] || { name: 'analytics', color: COLORS.medium };
    };

    const metrics = [
        {
            type: 'aEnergy',
            label: 'Énergie Active',
            value: (isDataLoading || !isAuthenticated) ? '---' : (meterData?.aEnergy?.toFixed(1) || '?'),
            unit: 'kWh'
        },
        {
            type: 'rEnergy',
            label: 'Énergie Réactive',
            value: (isDataLoading || !isAuthenticated) ? '---' : (meterData?.rEnergy?.toFixed(1) || '?'),
            unit: 'kVArh'
        },
        {
            type: 'voltage',
            label: 'Tension',
            value: (isDataLoading || !isAuthenticated) ? '---' : (meterData?.voltage || '?'),
            unit: 'V'
        },
        {
            type: 'current',
            label: 'Courant',
            value: (isDataLoading || !isAuthenticated) ? '---' : (meterData?.current?.toFixed(2) || '?'),
            unit: 'A'
        },
        {
            type: 'powerF',
            label: 'Facteur de Puissance',
            value: (isDataLoading || !isAuthenticated) ? '---' : (meterData?.powerF?.toFixed(2) || '?'),
            unit: ''
        },
        {
            type: 'frequency',
            label: 'Fréquence',
            value: (isDataLoading || !isAuthenticated) ? '---' : (meterData?.frequency || '?'),
            unit: 'Hz'
        },
    ];

    return (
        <View style={dashboardScreenStyles.container}>
            <View style={dashboardScreenStyles.header}>
                <View style={dashboardScreenStyles.headerActions}>
                    <TouchableOpacity 
                        style={dashboardScreenStyles.headerActionIcon}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={dashboardScreenStyles.headerActionIcon}
                        onPress={handleDisconnect}
                    >
                        <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                
                <View style={dashboardScreenStyles.headerContent}>
                    <View style={dashboardScreenStyles.headerTextContainer}>
                        <Text style={dashboardScreenStyles.title}>
                            {connectedDevice.serialNumber}
                        </Text>
                        <Text style={dashboardScreenStyles.subtitle}>
                            {isDataLoading ? "Chargement..." :
                                `${connectedDevice.ip} • ${meterData?.timestamp ?
                                    new Date(meterData.timestamp).toLocaleTimeString() : 'N/A'}`}
                        </Text>
                        {/* ✅ États WiFi + Authentification */}
                        <Text style={[dashboardScreenStyles.subtitle, {
                            color: isOnline ? COLORS.success + 'dd' : COLORS.danger + 'dd',
                            fontSize: 12
                        }]}>
                            {isOnline ? 'En ligne' : `Hors ligne (${failedAttempts}/${maxFailedAttempts})`}
                            {isAuthenticated ? ' • Authentifié' : ' • Non authentifié'}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView 
                style={dashboardScreenStyles.scrollView}
                contentContainerStyle={dashboardScreenStyles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* ✅ Messages d'état */}
                {!isOnline && (
                    <Card style={{ backgroundColor: COLORS.danger + '20', marginBottom: SPACING.md }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: SPACING.sm }}>
                            <Ionicons name="wifi-outline" size={20} color={COLORS.danger} />
                            <Text style={{ marginLeft: SPACING.sm, color: COLORS.danger, fontWeight: '600' }}>
                                Équipement hors ligne - Déconnexion automatique en cours...
                            </Text>
                        </View>
                    </Card>
                )}

                {!isAuthenticated && isOnline && (
                    <Card style={{ backgroundColor: COLORS.warning + '20', marginBottom: SPACING.md }}>
                        <TouchableOpacity 
                            style={{ flexDirection: 'row', alignItems: 'center', padding: SPACING.sm }}
                            onPress={() => setShowAuthModal(true)}
                        >
                            <Ionicons name="lock-closed" size={20} color={COLORS.warning} />
                            <Text style={{ marginLeft: SPACING.sm, color: COLORS.warning, fontWeight: '600', flex: 1 }}>
                                Authentification requise - Touchez pour vous connecter
                            </Text>
                            <Ionicons name="chevron-forward" size={16} color={COLORS.warning} />
                        </TouchableOpacity>
                    </Card>
                )}

                
                {/* Toggle de puissance */}
                <PowerToggle
                    isOn={meterData?.powerState || false}
                    onToggle={handlePowerToggle}
                    disabled={isDataLoading || !isOnline || !isAuthenticated}
                />

                {/* Indicateur de fraude */}
                {meterData?.fraudState !== undefined && isAuthenticated && (
                    <View style={[dashboardScreenStyles.fraudIndicator, 
                        meterData.fraudState && dashboardScreenStyles.fraudAlert]}>
                        <View style={[dashboardScreenStyles.fraudIcon, {
                            backgroundColor: meterData.fraudState ? COLORS.danger + '20' : COLORS.success + '20'
                        }]}>
                            <Ionicons 
                                name={meterData.fraudState ? "warning" : "shield-checkmark"} 
                                size={20} 
                                color={meterData.fraudState ? COLORS.danger : COLORS.success} 
                            />
                        </View>
                        <View style={dashboardScreenStyles.fraudTextContainer}>
                            <Text style={dashboardScreenStyles.fraudTitle}>Sécurité</Text>
                            <Text style={[dashboardScreenStyles.fraudStatus, {
                                color: meterData.fraudState ? COLORS.danger : COLORS.success
                            }]}>
                                {meterData.fraudState ? 'FRAUDE DÉTECTÉE' : 'NORMAL'}
                            </Text>
                        </View>
                        {meterData.fraudState && (
                            <TouchableOpacity
                                onPress={() =>
                                    Alert.alert(
                                        'Alerte Sécurité',
                                        'Une tentative de fraude a été détectée sur cet équipement.',
                                        [{ text: 'OK', style: 'default' }]
                                    )
                                }
                            >
                                <Ionicons name="information-circle" size={20} color={COLORS.danger} />
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Grille des métriques */}
                <View style={dashboardScreenStyles.metricsGrid}>
                    {metrics.map((metric) => {
                        const iconConfig = getMetricIcon(metric.type);
                        return (
                            <View key={metric.type} style={[
                                dashboardScreenStyles.metricCard,
                                (!isOnline || !isAuthenticated) && { opacity: 0.5 }
                            ]}>
                                <View style={[dashboardScreenStyles.metricIcon, {
                                    backgroundColor: iconConfig.color + '20'
                                }]}>
                                    <Ionicons
                                        name={iconConfig.name}
                                        size={24}
                                        color={iconConfig.color}
                                    />
                                </View>
                                <Text style={dashboardScreenStyles.metricValue}>
                                    {metric.value}
                                </Text>
                                <Text style={dashboardScreenStyles.metricUnit}>
                                    {metric.unit}
                                </Text>
                                <Text style={dashboardScreenStyles.metricLabel}>
                                    {metric.label}
                                </Text>
                                {(isDataLoading || !isAuthenticated) && (
                                    <LoadingSpinner style={dashboardScreenStyles.metricLoading} />
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Message de chargement */}
                {(isDataLoading || !isAuthenticated) && (
                    <View style={dashboardScreenStyles.statusMessage}>
                        <LoadingSpinner />
                        <Text style={dashboardScreenStyles.statusText}>
                            {!isAuthenticated ? 
                                '🔒 Authentification requise...' : 
                                '📡 Récupération des données en cours...'
                            }
                        </Text>
                    </View>
                )}

                {/* Bouton voir données */}
                <Card style={{ marginTop: SPACING.lg }}>
                    <TouchableOpacity
                        onPress={handleShowData}
                        disabled={isDataLoading || !isAuthenticated}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: SPACING.md,
                            opacity: (!isAuthenticated || isDataLoading) ? 0.5 : 1
                        }}
                    >
                        <Ionicons name="analytics-outline" size={20} color={COLORS.primary} />
                        <Text style={{
                            marginLeft: SPACING.sm,
                            color: COLORS.primary,
                            fontWeight: '600'
                        }}>
                            Voir toutes les données
                        </Text>
                    </TouchableOpacity>
                </Card>
            </ScrollView>

            {/* ✅ Modal d'authentification */}
            <AuthModal
                visible={showAuthModal}
                onAuthenticate={authenticate}
                onCancel={handleAuthCancel}
                isLoading={isLoading}
            />

            {/* Modal des données (ton style original) */}
            <Modal
                visible={showDataModal}
                animationType="slide"
                onRequestClose={() => setShowDataModal(false)}
            >
                {/* Ton modal existant inchangé */}
                <View style={dashboardScreenStyles.modalOverlay}>
                    <View style={dashboardScreenStyles.modalContent}>
                        <View style={dashboardScreenStyles.modalHeader}>
                            <Text style={dashboardScreenStyles.modalTitle}>Données du Compteur</Text>
                            <TouchableOpacity onPress={() => setShowDataModal(false)}>
                                <Ionicons name="close" size={24} color={COLORS.medium} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={dashboardScreenStyles.modalScrollView}>
                            {/* Tes sections existantes... (inchangées) */}
                            <View style={dashboardScreenStyles.dataSection}>
                                <Text style={dashboardScreenStyles.sectionTitle}>
                                    Mesures Électriques Principales
                                </Text>
                                {[
                                    { label: 'Énergie Active', value: `${meterData?.aEnergy?.toFixed(1) || 0} kWh` },
                                    { label: 'Énergie Réactive', value: `${meterData?.rEnergy?.toFixed(1) || 0} kVArh`},
                                    { label: 'Tension', value: `${meterData?.voltage || 0} V`},
                                    { label: 'Courant', value: `${meterData?.current?.toFixed(2) || 0} A`},
                                    { label: 'Facteur de puissance', value: meterData?.powerF?.toFixed(2) || '0'},
                                    { label: 'Fréquence', value: `${meterData?.frequency || 0} Hz`},
                                ].map((item, index) => (
                                    <View key={index} style={dashboardScreenStyles.dataRow}>
                                        <Text style={dashboardScreenStyles.dataLabel}>{item.label}</Text>
                                        <Text style={dashboardScreenStyles.dataValue}>{item.value}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Section système avec état auth */}
                            <View style={dashboardScreenStyles.dataSection}>
                                <Text style={dashboardScreenStyles.sectionTitle}>Informations Système</Text>
                                {[
                                    { label: 'Numéro de Série', value: meterData?.serialNumber || 'N/A'},
                                    { label: 'État Relais', value: meterData?.powerState ? 'Activé' : 'Désactivé'},
                                    { label: 'État Connexion', value: isOnline ? 'En ligne' : 'Hors ligne'},
                                    { label: 'Authentification', value: isAuthenticated ? 'Connecté' : 'Non connecté'}, // ✅ AJOUT
                                    { label: 'Date/Heure', value: meterData?.dateTime ?
                                        new Date(meterData.dateTime).toLocaleString() : 'N/A'},
                                ].map((item, index) => (
                                    <View key={index} style={dashboardScreenStyles.dataRow}>
                                        <Text style={dashboardScreenStyles.dataLabel}>{item.label}</Text>
                                        <Text style={dashboardScreenStyles.dataValue}>{item.value}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Section fraude si authentifié */}
                            {(meterData?.fraudState !== undefined || meterData?.fraudAlertDateTime) && isAuthenticated && (
                                <View style={dashboardScreenStyles.dataSection}>
                                    <Text style={dashboardScreenStyles.sectionTitle}>Alerte Sécurité</Text>
                                    {[
                                        { label: 'État Fraude', value: meterData?.fraudState ? 'FRAUDE DÉTECTÉE' : 'NORMAL' },
                                        ...(meterData?.fraudAlertDateTime ? [{
                                            label: 'Date Alerte',
                                            value: new Date(meterData.fraudAlertDateTime).toLocaleString(),
                                        }] : [])
                                    ].map((item, index) => (
                                        <View key={index} style={dashboardScreenStyles.dataRow}>
                                            <Text style={dashboardScreenStyles.dataLabel}>{item.label}</Text>
                                            <Text style={dashboardScreenStyles.dataValue}>{item.value}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </ScrollView>

                        <TouchableOpacity
                            style={dashboardScreenStyles.closeButton}
                            onPress={() => setShowDataModal(false)}
                        >
                            <Text style={dashboardScreenStyles.closeButtonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

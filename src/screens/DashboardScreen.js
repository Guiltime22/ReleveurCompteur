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
import { dashboardScreenStyles } from '../styles/screens/dashboardScreenStyles';
import { COLORS } from '../styles/global/colors';

export default function DashboardScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const { 
    isConnected, 
    connectedDevice, 
    meterData, 
    refreshData, 
    togglePower, 
    disconnect 
  } = useDevice();

  useEffect(() => {
    if (isConnected && connectedDevice) {
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
  }, [isConnected, connectedDevice]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handlePowerToggle = () => {
    if (isDataLoading || !meterData) {
      Alert.alert('Attention', 'Veuillez attendre que les données soient chargées');
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
          onPress: togglePower,
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
    if (isDataLoading || !meterData) {
      Alert.alert('Attention', 'Veuillez attendre que les données soient chargées');
      return;
    }
    setShowDataModal(true);
  };

  if (!isConnected || !connectedDevice) {
    return (
      <View style={dashboardScreenStyles.disconnectedContainer}>
        <Ionicons name="unlink-outline" size={64} color={COLORS.medium} />
        <Text style={dashboardScreenStyles.disconnectedText}>
          Aucun compteur connecté.{'\n'}
          Veuillez scanner et vous connecter à un équipement.
        </Text>
      </View>
    );
  }

  const getMetricIcon = (type) => {
    const icons = {
      power: { name: 'flash', color: COLORS.warning },
      voltage: { name: 'trending-up', color: COLORS.primary },
      current: { name: 'pulse', color: COLORS.secondary },
      energy: { name: 'battery-charging', color: COLORS.success },
    };
    return icons[type] || { name: 'analytics', color: COLORS.medium };
  };

  const metrics = [
    { 
      type: 'power', 
      label: 'Puissance', 
      value: isDataLoading ? '---' : (meterData?.power?.toFixed(2) || '0'), 
      unit: 'kW' 
    },
    { 
      type: 'voltage', 
      label: 'Tension', 
      value: isDataLoading ? '---' : (meterData?.voltage || '0'), 
      unit: 'V' 
    },
    { 
      type: 'current', 
      label: 'Courant', 
      value: isDataLoading ? '---' : (meterData?.current?.toFixed(2) || '0'), 
      unit: 'A' 
    },
    { 
      type: 'energy', 
      label: 'Énergie', 
      value: isDataLoading ? '---' : (meterData?.energy?.toFixed(1) || '0'), 
      unit: 'kWh' 
    },
  ];

  return (
    <View style={dashboardScreenStyles.container}>
      <ScrollView
        style={dashboardScreenStyles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ✅ Header avec icônes d'action et sans décalage */}
        <View style={dashboardScreenStyles.header}>
          <View style={dashboardScreenStyles.headerContent}>
            {/* Icônes d'action à gauche et droite */}
            <View style={dashboardScreenStyles.headerActions}>
              <TouchableOpacity
                style={[
                  dashboardScreenStyles.headerActionIcon,
                  isDataLoading && dashboardScreenStyles.headerActionDisabled
                ]}
                onPress={handleShowData}
                disabled={isDataLoading}
                activeOpacity={0.7}
                accessibilityLabel="Voir toutes les données détaillées"
                accessibilityHint="Ouvre une fenêtre avec toutes les mesures du compteur"
              >
                <Ionicons 
                  name="analytics" 
                  size={24} 
                  color={isDataLoading ? COLORS.white + '60' : COLORS.white} 
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={dashboardScreenStyles.headerActionIcon}
                onPress={handleDisconnect}
                activeOpacity={0.7}
                accessibilityLabel="Se déconnecter du compteur"
                accessibilityHint="Ferme la connexion avec le compteur actuel"
              >
                <Ionicons name="log-out" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            {/* Informations centrées */}
            <View style={dashboardScreenStyles.headerInfo}>
              <Text style={dashboardScreenStyles.deviceName}>
                {connectedDevice.serialNumber}
              </Text>
              <Text style={dashboardScreenStyles.deviceIP}>
                {connectedDevice.ip}
              </Text>
              {/* ✅ Indicateur de loading fixe pour éviter le décalage */}
              <View style={dashboardScreenStyles.statusContainer}>
                {isDataLoading ? (
                  <View style={dashboardScreenStyles.loadingIndicator}>
                    <LoadingSpinner size="small" />
                    <Text style={dashboardScreenStyles.loadingText}>
                      Chargement...
                    </Text>
                  </View>
                ) : (
                  <Text style={dashboardScreenStyles.lastUpdate}>
                    {meterData?.timestamp 
                      ? `Mis à jour: ${new Date(meterData.timestamp).toLocaleTimeString()}`
                      : 'Données disponibles'
                    }
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={dashboardScreenStyles.content}>
          {/* Power Toggle */}
          <PowerToggle
            isOn={isDataLoading ? false : (meterData?.powerState || false)}
            onToggle={handlePowerToggle}
            disabled={isDataLoading}
          />

          {/* Metrics Grid */}
          <View style={dashboardScreenStyles.metricsGrid}>
            {metrics.map((metric) => {
              const iconConfig = getMetricIcon(metric.type);
              return (
                <Card key={metric.type} style={[
                  dashboardScreenStyles.metricCard,
                  isDataLoading && dashboardScreenStyles.metricCardLoading
                ]}>
                  <View style={[
                    dashboardScreenStyles.metricIcon,
                    { backgroundColor: iconConfig.color + '20' }
                  ]}>
                    <Ionicons 
                      name={iconConfig.name} 
                      size={24} 
                      color={iconConfig.color} 
                    />
                  </View>
                  <Text style={dashboardScreenStyles.metricValue}>
                    {metric.value}
                    <Text style={dashboardScreenStyles.metricUnit}> {metric.unit}</Text>
                  </Text>
                  <Text style={dashboardScreenStyles.metricLabel}>
                    {metric.label}
                  </Text>
                  {isDataLoading && (
                    <View style={dashboardScreenStyles.metricLoading}>
                      <LoadingSpinner size="small" />
                    </View>
                  )}
                </Card>
              );
            })}
          </View>

          {/* Message d'état si nécessaire */}
          {isDataLoading && (
            <View style={dashboardScreenStyles.statusMessage}>
              <Text style={dashboardScreenStyles.statusText}>
                📡 Récupération des données en cours...
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Data Modal - inchangé */}
      <Modal
        visible={showDataModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDataModal(false)}
      >
        <View style={dashboardScreenStyles.modalOverlay}>
          <View style={dashboardScreenStyles.modalContent}>
            <View style={dashboardScreenStyles.modalHeader}>
              <Text style={dashboardScreenStyles.modalTitle}>
                Données Détaillées
              </Text>
              <TouchableOpacity onPress={() => setShowDataModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.medium} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={dashboardScreenStyles.dataSection}>
                <Text style={dashboardScreenStyles.sectionTitle}>
                  Mesures Électriques
                </Text>
                {[
                  { label: 'Puissance', value: `${meterData?.power?.toFixed(2) || 0} kW` },
                  { label: 'Tension', value: `${meterData?.voltage || 0} V` },
                  { label: 'Courant', value: `${meterData?.current?.toFixed(2) || 0} A` },
                  { label: 'Facteur de puissance', value: meterData?.powerFactor || '0' },
                  { label: 'Fréquence', value: `${meterData?.frequency || 0} Hz` },
                ].map((item, index) => (
                  <View key={index} style={dashboardScreenStyles.dataRow}>
                    <Text style={dashboardScreenStyles.dataLabel}>{item.label}</Text>
                    <Text style={dashboardScreenStyles.dataValue}>{item.value}</Text>
                  </View>
                ))}
              </View>

              <View style={dashboardScreenStyles.dataSection}>
                <Text style={dashboardScreenStyles.sectionTitle}>
                  Consommation
                </Text>
                {[
                  { label: 'Énergie totale', value: `${meterData?.energy?.toFixed(1) || 0} kWh` },
                  { label: 'Consommation journalière', value: `${meterData?.dailyConsumption || 0} kWh` },
                  { label: 'Coût mensuel estimé', value: `${meterData?.monthlyCost || 0} €` },
                  { label: 'Température', value: `${meterData?.temperature || 0} °C` },
                ].map((item, index) => (
                  <View key={index} style={dashboardScreenStyles.dataRow}>
                    <Text style={dashboardScreenStyles.dataLabel}>{item.label}</Text>
                    <Text style={dashboardScreenStyles.dataValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
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

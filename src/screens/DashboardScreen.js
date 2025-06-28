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
import { SPACING } from '../styles/global/spacing';

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
      <View style={dashboardScreenStyles.container}>
        <View style={dashboardScreenStyles.disconnectedContainer}>
          <Ionicons name="unlink" size={64} color={COLORS.medium} />
          <Text style={dashboardScreenStyles.disconnectedText}>
            Aucun compteur connecté.{'\n'}
            Veuillez scanner et vous connecter à un équipement.
          </Text>
        </View>
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
      value: isDataLoading ? '---' : (meterData?.aEnergy?.toFixed(1) || '0'),
      unit: 'kWh'
    },
    {
      type: 'rEnergy',
      label: 'Énergie Réactive',
      value: isDataLoading ? '---' : (meterData?.rEnergy?.toFixed(1) || '0'),
      unit: 'kVArh'
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
      type: 'powerF',
      label: 'Facteur de Puissance',
      value: isDataLoading ? '---' : (meterData?.powerF?.toFixed(2) || '0'),
      unit: ''
    },
    {
      type: 'frequency',
      label: 'Fréquence',
      value: isDataLoading ? '---' : (meterData?.frequency || '0'),
      unit: 'Hz'
    },
  ];

  return (
    <View style={dashboardScreenStyles.container}>
      <View style={dashboardScreenStyles.header}>
        <View style={dashboardScreenStyles.headerActions}>
          <TouchableOpacity 
            style={dashboardScreenStyles.headerActionIcon}
            onPress={handleDisconnect}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out" size={20} color={COLORS.white} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={dashboardScreenStyles.headerActionIcon}
            onPress={handleShowData}
            activeOpacity={0.7}
          >
            <Ionicons name="analytics" size={20} color={COLORS.white} />
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
          </View>
        </View>
      </View>

      <ScrollView
        style={dashboardScreenStyles.scrollView}
        contentContainerStyle={dashboardScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <PowerToggle 
          isOn={meterData?.powerState || false}
          onToggle={handlePowerToggle}
          disabled={isDataLoading || !meterData}
          style={{ marginBottom: SPACING.lg }}
        />

        {meterData?.fraudState !== undefined && (
          <View style={dashboardScreenStyles.fraudIndicator}>
            <View style={[
              dashboardScreenStyles.fraudIcon,
              { backgroundColor: meterData.fraudState ? COLORS.danger + '20' : COLORS.success + '20' }
            ]}>
              <Ionicons 
                name={meterData.fraudState ? "warning" : "shield-checkmark"} 
                size={20} 
                color={meterData.fraudState ? COLORS.danger : COLORS.success} 
              />
            </View>
            
            <View style={dashboardScreenStyles.fraudTextContainer}>
              <Text style={dashboardScreenStyles.fraudTitle}>Sécurité</Text>
              <Text style={[
                dashboardScreenStyles.fraudStatus,
                { color: meterData.fraudState ? COLORS.danger : COLORS.success }
              ]}>
                {meterData.fraudState ? 'FRAUDE DÉTECTÉE' : 'NORMAL'}
              </Text>
            </View>
            
            {meterData.fraudState && (
              <TouchableOpacity 
                style={dashboardScreenStyles.fraudAlert}
                onPress={() => Alert.alert(
                  'Alerte Sécurité', 
                  'Une tentative de fraude a été détectée sur cet équipement.',
                  [{ text: 'OK', style: 'default' }]
                )}
              >
                <Ionicons name="information-circle" size={16} color={COLORS.danger} />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={dashboardScreenStyles.metricsGrid}>
          {metrics.map((metric) => {
            const iconConfig = getMetricIcon(metric.type);
            return (
              <View key={metric.type} style={dashboardScreenStyles.metricCard}>
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
                <Text style={dashboardScreenStyles.metricLabel}>{metric.label}</Text>
                {isDataLoading && (
                  <View style={dashboardScreenStyles.metricLoading}>
                    <LoadingSpinner size="small" color={COLORS.medium} />
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {isDataLoading && (
          <View style={dashboardScreenStyles.statusMessage}>
            <LoadingSpinner size="small" color={COLORS.primary} />
            <Text style={dashboardScreenStyles.statusText}>
              📡 Récupération des données en cours...
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showDataModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDataModal(false)}
      >
        <View style={dashboardScreenStyles.modalOverlay}>
          <View style={dashboardScreenStyles.modalContent}>
            <View style={dashboardScreenStyles.modalHeader}>
              <Text style={dashboardScreenStyles.modalTitle}>
                Données du Compteur
              </Text>
              <TouchableOpacity onPress={() => setShowDataModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.medium} />
              </TouchableOpacity>
            </View>

            <View style={dashboardScreenStyles.dataSection}>
              <Text style={dashboardScreenStyles.sectionTitle}>
                Mesures Électriques
              </Text>
              {[
                { label: 'Énergie Active', value: `${meterData?.aEnergy?.toFixed(1) || 0} kWh` },
                { label: 'Énergie Réactive', value: `${meterData?.rEnergy?.toFixed(1) || 0} kVArh` },
                { label: 'Tension', value: `${meterData?.voltage || 0} V` },
                { label: 'Courant', value: `${meterData?.current?.toFixed(2) || 0} A` },
                { label: 'Facteur de puissance', value: meterData?.powerF?.toFixed(2) || '0' },
                { label: 'Fréquence', value: `${meterData?.frequency || 0} Hz` },
              ].map((item, index) => (
                <View key={index} style={dashboardScreenStyles.dataRow}>
                  <Text style={dashboardScreenStyles.dataLabel}>{item.label}</Text>
                  <Text style={dashboardScreenStyles.dataValue}>{item.value}</Text>
                </View>
              ))}
            </View>

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

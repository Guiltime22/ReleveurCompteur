import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import storageService from '../services/storageService';
import { useDevice } from '../context/DeviceContext';
import Button from '../components/ui/Button';
import { historyScreenStyles } from '../styles/screens/historyScreenStyles';
import { COLORS } from '../styles/global/colors';


export default function HistoryScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [deviceHistory, setDeviceHistory] = useState([]);
  const { connectToDevice, isLoading } = useDevice();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await storageService.getDeviceHistory();
      const enrichedHistory = await Promise.all(
        history.map(async (device) => {
          const meterData = await storageService.getMeterData(device.ip);
          return {
            ...device,
            lastData: meterData,
          };
        })
      );
      setDeviceHistory(enrichedHistory);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReconnect = async (device) => {
    Alert.alert(
      'Reconnexion',
      `Voulez-vous vous reconnecter au compteur ${device.serialNumber} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Reconnecter',
          onPress: async () => {
            try {
              const savedPassword = await storageService.getCredentials();
              if (savedPassword) {
                const success = await connectToDevice(device, savedPassword);
                if (success) {
                  navigation.navigate('Dashboard');
                }
              } else {
                navigation.navigate('Scanner', { preSelectedDevice: device });
              }
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de se reconnecter automatiquement. Veuillez saisir le mot de passe.');
              navigation.navigate('Scanner', { preSelectedDevice: device });
            }
          },
        },
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Vider l\'historique',
      'Voulez-vous supprimer tout l\'historique des connexions ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Vider',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.clearCache();
              setDeviceHistory([]);
              Alert.alert('Succès', 'Historique vidé avec succès');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de vider l\'historique');
            }
          },
        },
      ]
    );
  };

  const renderHistoryItem = (device, index) => {
    if (!device || !device.ip) {
      return null;
    }

    return (
      <View key={device.ip} style={historyScreenStyles.historyCard}>
        <View style={historyScreenStyles.historyHeader}>
          <View style={historyScreenStyles.deviceIcon}>
            <Ionicons name="speedometer" size={24} color={COLORS.primary} />
          </View>
          <View style={historyScreenStyles.deviceInfo}>
            <Text style={historyScreenStyles.deviceSerial}>
              {device.serialNumber || 'Inconnu'}
            </Text>
            <Text style={historyScreenStyles.deviceIP}>
              IP: {device.ip || 'N/A'}
            </Text>
          </View>
          <View style={historyScreenStyles.connectionTime}>
            <Ionicons name="time" size={12} color={COLORS.medium} />
            <Text style={historyScreenStyles.connectionTimeText}>
              {device.lastConnected ? formatDate(device.lastConnected) : 'N/A'}
            </Text>
          </View>
        </View>

        {device.lastData && (
          <View style={historyScreenStyles.dataPreview}>
            <View style={historyScreenStyles.dataRow}>
              <Text style={historyScreenStyles.dataLabel}>Énergie Active</Text>
              <Text style={historyScreenStyles.dataValue}>
                {device.lastData.aEnergy?.toFixed(1) || 0} kWh
              </Text>
            </View>
            <View style={historyScreenStyles.dataRow}>
              <Text style={historyScreenStyles.dataLabel}>Tension</Text>
              <Text style={historyScreenStyles.dataValue}>
                {device.lastData.voltage || 0} V
              </Text>
            </View>
            <View style={historyScreenStyles.dataRow}>
              <Text style={historyScreenStyles.dataLabel}>Courant</Text>
              <Text style={historyScreenStyles.dataValue}>
                {device.lastData.current?.toFixed(2) || 0} A
              </Text>
            </View>
            <View style={historyScreenStyles.dataRow}>
              <Text style={historyScreenStyles.dataLabel}>Fréquence</Text>
              <Text style={historyScreenStyles.dataValue}>
                {device.lastData.frequency || 0} Hz
              </Text>
            </View>
          </View>
        )}

        <Button
          title="Reconnecter"
          onPress={() => handleReconnect(device)}
          variant="outline"
          size="medium"
          icon="refresh"
          loading={isLoading}
          style={historyScreenStyles.actionButton}
        />
      </View>
    );
  };

  return (
    <View style={historyScreenStyles.container}>
      <View style={historyScreenStyles.header}>
        <View style={historyScreenStyles.headerContent}>
          <TouchableOpacity
            style={historyScreenStyles.headerIcon}
            onPress={onRefresh}
            activeOpacity={0.7}
          >
            <Ionicons name="time" size={24} color="white" />
          </TouchableOpacity>
          <View style={historyScreenStyles.headerTextContainer}>
            <Text style={historyScreenStyles.title}>Historique</Text>
            <Text style={historyScreenStyles.subtitle}>
              {refreshing ? "Actualisation..." : 
               `${deviceHistory.length} équipement${deviceHistory.length > 1 ? 's' : ''} en historique`}
            </Text>
          </View>
          {deviceHistory.length > 0 && (
            <TouchableOpacity
              style={historyScreenStyles.headerActionIcon}
              onPress={handleClearHistory}
              activeOpacity={0.7}
            >
              <Ionicons name="trash" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={historyScreenStyles.scrollView}
        contentContainerStyle={historyScreenStyles.scrollContent}
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
        {deviceHistory.length === 0 ? (
          <View style={historyScreenStyles.emptyState}>
            <Ionicons name="time" size={64} color={COLORS.medium} />
            <Text style={historyScreenStyles.emptyTitle}>
              Aucun historique
            </Text>
            <Text style={historyScreenStyles.emptySubtitle}>
              Connectez-vous à un compteur pour voir l'historique apparaître ici
            </Text>
            <Button
              title="Scanner des équipements"
              onPress={() => navigation.navigate('Scanner')}
              variant="primary"
              size="medium"
              icon="scan"
              style={{ marginTop: 24 }}
            />
          </View>
        ) : (
          deviceHistory.map(renderHistoryItem)
        )}
      </ScrollView>
    </View>
  );
}

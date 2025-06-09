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
import Button from '../components/ui/Button';
import { historyScreenStyles } from '../styles/screens/historyScreenStyles';
import { COLORS } from '../styles/global/colors';

export default function HistoryScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [deviceHistory, setDeviceHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await storageService.getDeviceHistory();
      
      // Enrichir avec les données mises en cache
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

  const handleReconnect = (device) => {
    Alert.alert(
      'Reconnexion',
      `Voulez-vous vous reconnecter au compteur ${device.serialNumber} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Reconnecter',
          onPress: () => {
            // Naviguer vers le scanner avec le device pré-sélectionné
            navigation.navigate('Scanner', { preSelectedDevice: device });
          },
        },
      ]
    );
  };

  // Dans src/screens/HistoryScreen.js
  const renderHistoryItem = (device, index) => {
    // Ajouter cette vérification au début
    if (!device || !device.ip) {
      return null;
    }

    return (
      <View key={device.ip} style={historyScreenStyles.historyCard}>
        <View style={historyScreenStyles.historyHeader}>
          <View style={historyScreenStyles.deviceIcon}>
            <Ionicons name="flash" size={24} color={COLORS.primary} />
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
              <Text style={historyScreenStyles.dataLabel}>Dernière puissance</Text>
              <Text style={historyScreenStyles.dataValue}>
                {device.lastData.power?.toFixed(2) || 0} kW
              </Text>
            </View>
            <View style={historyScreenStyles.dataRow}>
              <Text style={historyScreenStyles.dataLabel}>Tension</Text>
              <Text style={historyScreenStyles.dataValue}>
                {device.lastData.voltage || 0} V
              </Text>
            </View>
            <View style={historyScreenStyles.dataRow}>
              <Text style={historyScreenStyles.dataLabel}>État</Text>
              <Text style={[
                historyScreenStyles.dataValue,
                { color: device.lastData.powerState ? COLORS.success : COLORS.danger }
              ]}>
                {device.lastData.powerState ? 'Allumé' : 'Éteint'}
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
          style={historyScreenStyles.actionButton}
        />
      </View>
    );
  };

  return (
    <View style={historyScreenStyles.container}>
      <ScrollView
        style={historyScreenStyles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={historyScreenStyles.header}>
          <TouchableOpacity 
            style={historyScreenStyles.headerIconClickable}
            onPress={onRefresh}
            disabled={refreshing}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={refreshing ? "hourglass" : "time"} 
              size={32} 
              color="#ffffff" 
            />
          </TouchableOpacity>
          <Text style={historyScreenStyles.title}>Historique</Text>
          <Text style={historyScreenStyles.subtitle}>
            {refreshing ? "Actualisation..." : "Équipements précédemment connectés"}
          </Text>
        </View>

        <View style={historyScreenStyles.content}>
          {deviceHistory.length === 0 ? (
            <View style={historyScreenStyles.emptyState}>
              <Ionicons 
                name="document-outline" 
                size={64} 
                color={COLORS.medium}
                style={historyScreenStyles.emptyIcon}
              />
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
        </View>
      </ScrollView>
    </View>
  );
}

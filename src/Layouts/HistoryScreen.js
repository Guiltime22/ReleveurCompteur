import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import storageService from '../Services/storageService';
import MeterCard from '../Components/Meter/MeterCard';
import { styles } from './HistoryScreen.styles';

export default function HistoryScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  const loadHistory = async () => {
    try {
      const cachedData = await storageService.getMeterData();
      if (cachedData) {
        // Simuler un historique basé sur les données mises en cache
        const history = [
          {
            id: 1,
            timestamp: new Date().toISOString(),
            power: cachedData.metrics?.power || 0,
            voltage: cachedData.metrics?.voltage || 0,
            current: cachedData.metrics?.current || 0,
          },
          // Ajouter plus d'entrées d'historique simulées
          {
            id: 2,
            timestamp: new Date(Date.now() - 3600000).toISOString(), // 1h ago
            power: (cachedData.metrics?.power || 0) * 0.8,
            voltage: cachedData.metrics?.voltage || 0,
            current: (cachedData.metrics?.current || 0) * 0.8,
          },
          {
            id: 3,
            timestamp: new Date(Date.now() - 7200000).toISOString(), // 2h ago
            power: (cachedData.metrics?.power || 0) * 1.2,
            voltage: cachedData.metrics?.voltage || 0,
            current: (cachedData.metrics?.current || 0) * 1.2,
          },
        ];
        setHistoryData(history);
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Ionicons name="time" size={32} color="#2196F3" />
        <Text style={styles.title}>Historique des Mesures</Text>
        <Text style={styles.subtitle}>
          Données des dernières sessions
        </Text>
      </View>

      {historyData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-outline" size={64} color="#757575" />
          <Text style={styles.emptyText}>
            Aucun historique disponible
          </Text>
          <Text style={styles.emptySubtext}>
            Les données apparaîtront après la première connexion
          </Text>
        </View>
      ) : (
        historyData.map((entry) => (
          <MeterCard 
            key={entry.id} 
            title={`📅 ${formatDate(entry.timestamp)}`}
          >
            <View style={styles.entryContainer}>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Puissance:</Text>
                <Text style={styles.dataValue}>{entry.power.toFixed(2)} kW</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Tension:</Text>
                <Text style={styles.dataValue}>{entry.voltage.toFixed(0)} V</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Courant:</Text>
                <Text style={styles.dataValue}>{entry.current.toFixed(2)} A</Text>
              </View>
            </View>
          </MeterCard>
        ))
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Tirez vers le bas pour actualiser
        </Text>
      </View>
    </ScrollView>
  );
}

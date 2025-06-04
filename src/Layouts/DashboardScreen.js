import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useMeterData } from '../Hooks/useMeterData';
import { useDeviceConnection } from '../Hooks/useDeviceConnection';
import MeterCard from '../Components/Meter/MeterCard';
import PowerToggle from '../Components/Meter/PowerToggle';
import DataDisplay from '../Components/Meter/DataDisplay';
import StatusIndicator from '../Components/UI/StatusIndicator';
import { styles } from './DashboardScreen.styles';

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { isConnected } = useDeviceConnection();
  const { 
    meterData, 
    powerState, 
    securityStatus, 
    isLoading,
    lastUpdate,
    fetchData, 
    togglePower 
  } = useMeterData();

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handlePowerToggle = async () => {
    const action = powerState ? 'éteindre' : 'allumer';
    Alert.alert(
      'Confirmation',
      `Voulez-vous ${action} le compteur ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Confirmer', 
          onPress: () => togglePower(!powerState),
          style: powerState ? 'destructive' : 'default'
        },
      ]
    );
  };

  useEffect(() => {
    if (isConnected) {
      fetchData();
      const interval = setInterval(fetchData, 10000); // Refresh toutes les 10s
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  if (!isConnected) {
    return (
      <View style={styles.disconnectedContainer}>
        <StatusIndicator status="disconnected" label="Non connecté" size="large" />
        <Text style={styles.disconnectedText}>
          Veuillez vous connecter au compteur depuis l'onglet Connexion
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Tableau de Bord</Text>
        <Text style={styles.subtitle}>Contrôle et surveillance en temps réel</Text>
        {lastUpdate && (
          <Text style={styles.lastUpdate}>
            Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
          </Text>
        )}
      </View>

      <PowerToggle
        isOn={powerState}
        onToggle={handlePowerToggle}
        securityStatus={securityStatus}
        disabled={isLoading}
      />

      <MeterCard title="⚡ Consommation Actuelle">
        <DataDisplay
          data={[
            { 
              label: 'Puissance', 
              value: `${meterData?.power || 0} kW` 
            },
            { 
              label: 'Tension', 
              value: `${meterData?.voltage || 0} V` 
            },
            { 
              label: 'Courant', 
              value: `${meterData?.current || 0} A` 
            },
            { 
              label: 'Facteur de puissance', 
              value: `${meterData?.powerFactor || 0}` 
            },
          ]}
        />
      </MeterCard>

      <MeterCard title="📊 Statistiques du Jour">
        <DataDisplay
          data={[
            { 
              label: 'Consommation totale', 
              value: `${meterData?.dailyConsumption || 0} kWh` 
            },
            { 
              label: 'Coût estimé', 
              value: `${meterData?.dailyCost || 0} €` 
            },
            { 
              label: 'Temps d\'activité', 
              value: `${meterData?.activeTime || 0} h` 
            },
            { 
              label: 'Pic de consommation', 
              value: `${meterData?.peakPower || 0} kW` 
            },
          ]}
        />
      </MeterCard>

      <MeterCard title="🔒 État de Sécurité">
        <View style={styles.securityContainer}>
          <StatusIndicator 
            status={securityStatus?.alert ? 'warning' : 'connected'} 
            label={securityStatus?.alert ? 'Alerte détectée' : 'Système sécurisé'} 
          />
          {securityStatus?.message && (
            <Text style={styles.securityMessage}>
              {securityStatus.message}
            </Text>
          )}
        </View>
      </MeterCard>

      {securityStatus?.alert && (
        <MeterCard title="⚠️ Alerte de Sécurité" alertStyle>
          <Text style={styles.alertText}>
            Une tentative de manipulation a été détectée !
          </Text>
          <Text style={styles.alertDetails}>
            {securityStatus.details || 'Contactez immédiatement le service technique.'}
          </Text>
        </MeterCard>
      )}
    </ScrollView>
  );
}

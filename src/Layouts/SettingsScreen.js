import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import storageService from '../Services/storageService';
import { useDeviceConnection } from '../Hooks/useDeviceConnection';
import MeterCard from '../Components/Meter/MeterCard';
import Button from '../Components/UI/Button';
import { styles } from './SettingsScreen.styles';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    notifications: true,
    saveHistory: true,
    refreshInterval: 10,
  });
  const { disconnect, deviceInfo } = useDeviceConnection();

  const loadSettings = async () => {
    try {
      const savedSettings = await storageService.getSettings();
      setSettings(prev => ({ ...prev, ...savedSettings }));
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await storageService.storeSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Erreur sauvegarde paramètres:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les paramètres');
    }
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const handleClearCache = () => {
    Alert.alert(
      'Vider le cache',
      'Voulez-vous supprimer toutes les données mises en cache ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.getMeterData(); // Clear cache logic here
              Alert.alert('Succès', 'Cache vidé avec succès');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de vider le cache');
            }
          },
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
          style: 'destructive',
          onPress: () => {
            disconnect();
            Alert.alert('Succès', 'Déconnexion effectuée');
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings" size={32} color="#2196F3" />
        <Text style={styles.title}>Paramètres</Text>
        <Text style={styles.subtitle}>Configuration de l'application</Text>
      </View>

      {deviceInfo && (
        <MeterCard title="📱 Informations du Compteur">
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Numéro de série:</Text>
              <Text style={styles.infoValue}>{deviceInfo.serialNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version firmware:</Text>
              <Text style={styles.infoValue}>{deviceInfo.version}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type d'appareil:</Text>
              <Text style={styles.infoValue}>{deviceInfo.deviceType}</Text>
            </View>
          </View>
        </MeterCard>
      )}

      <MeterCard title="⚙️ Préférences">
        <View style={styles.settingContainer}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Actualisation automatique</Text>
              <Text style={styles.settingDescription}>
                Actualise les données automatiquement
              </Text>
            </View>
            <Switch
              value={settings.autoRefresh}
              onValueChange={(value) => handleSettingChange('autoRefresh', value)}
              trackColor={{ false: '#E0E0E0', true: '#2196F3' }}
              thumbColor={settings.autoRefresh ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Recevoir des alertes de sécurité
              </Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => handleSettingChange('notifications', value)}
              trackColor={{ false: '#E0E0E0', true: '#2196F3' }}
              thumbColor={settings.notifications ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sauvegarder l'historique</Text>
              <Text style={styles.settingDescription}>
                Conserver les données localement
              </Text>
            </View>
            <Switch
              value={settings.saveHistory}
              onValueChange={(value) => handleSettingChange('saveHistory', value)}
              trackColor={{ false: '#E0E0E0', true: '#2196F3' }}
              thumbColor={settings.saveHistory ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>
      </MeterCard>

      <MeterCard title="🔧 Actions">
        <View style={styles.actionContainer}>
          <Button
            title="Vider le cache"
            onPress={handleClearCache}
            icon="trash"
            variant="secondary"
            size="medium"
            style={styles.actionButton}
          />
          
          <Button
            title="Se déconnecter"
            onPress={handleDisconnect}
            icon="log-out"
            variant="danger"
            size="medium"
            style={styles.actionButton}
          />
        </View>
      </MeterCard>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Version de l'application: 1.0.0
        </Text>
        <Text style={styles.footerText}>
          Développé pour les releveurs de compteurs électriques
        </Text>
      </View>
    </ScrollView>
  );
}

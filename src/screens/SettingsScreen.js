import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import storageService from '../services/storageService';
import { useDevice } from '../context/DeviceContext';
import { useCache } from '../hooks/useCache';
import Button from '../components/ui/Button';
import { settingsScreenStyles } from '../styles/screens/settingsScreenStyles';
import { COLORS } from '../styles/global/colors';


export default function SettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: 5000,
    theme: 'light',
  });

  const { isConnected, connectedDevice, disconnect } = useDevice();
  const { cacheSize, deviceCount, clearCache } = useCache();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await storageService.getUserSettings();
      setSettings(userSettings);
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    }
  };

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await storageService.saveUserSettings(newSettings);
  };

  const handleClearCache = () => {
    Alert.alert(
      'Vider le cache',
      'Cette action supprimera toutes les données mises en cache. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Vider le cache',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await clearCache();
              if (success) {
                Alert.alert('Succès', 'Cache vidé avec succès');
              } else {
                Alert.alert('Erreur', 'Impossible de vider le cache');
              }
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
      'Voulez-vous vous déconnecter du compteur actuel ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: () => {
            disconnect();
            navigation.navigate('Scanner');
            Alert.alert('Succès', 'Déconnexion effectuée');
          },
        },
      ]
    );
  };

  const renderSettingItem = (icon, iconColor, label, description, value, onValueChange, isLast = false) => (
    <View style={[settingsScreenStyles.settingItem, isLast && settingsScreenStyles.settingItemLast]}>
      <View style={settingsScreenStyles.settingLeft}>
        <View style={[settingsScreenStyles.settingIcon, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View style={settingsScreenStyles.settingInfo}>
          <Text style={settingsScreenStyles.settingLabel}>{label}</Text>
          <Text style={settingsScreenStyles.settingDescription}>{description}</Text>
        </View>
      </View>
      <View style={settingsScreenStyles.switchContainer}>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: COLORS.border, true: COLORS.primary + '40' }}
          thumbColor={value ? COLORS.primary : COLORS.medium}
        />
      </View>
    </View>
  );

  return (
    <View style={settingsScreenStyles.container}>
      {/* Header fixe compact */}
      <View style={settingsScreenStyles.header}>
        <View style={settingsScreenStyles.headerContent}>
          <View style={settingsScreenStyles.headerIcon}>
            <Ionicons name="settings" size={24} color="white" />
          </View>
          <View style={settingsScreenStyles.headerTextContainer}>
            <Text style={settingsScreenStyles.title}>Paramètres</Text>
            <Text style={settingsScreenStyles.subtitle}>
              Configuration de l'application
            </Text>
          </View>
        </View>
      </View>

      {/* Contenu scrollable */}
      <ScrollView
        style={settingsScreenStyles.scrollView}
        contentContainerStyle={settingsScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Informations de l'application */}
        <View style={settingsScreenStyles.appInfoSection}>
          <View style={settingsScreenStyles.appInfoHeader}>
            <View style={settingsScreenStyles.appIcon}>
              <Ionicons name="flash" size={32} color={COLORS.primary} />
            </View>
            <View style={settingsScreenStyles.appDetails}>
              <Text style={settingsScreenStyles.appName}>Releveur Compteur</Text>
              <Text style={settingsScreenStyles.appVersion}>Version 1.0.0</Text>
              <Text style={settingsScreenStyles.appDescription}>
                Application de relevé de compteurs électriques
              </Text>
            </View>
          </View>
        </View>

        {/* Équipement connecté */}
        {isConnected && connectedDevice && (
          <View style={settingsScreenStyles.section}>
            <Text style={settingsScreenStyles.sectionTitle}>Équipement Connecté</Text>
            <View style={settingsScreenStyles.deviceConnected}>
              <View style={settingsScreenStyles.deviceConnectedIcon}>
                <Ionicons name="speedometer" size={24} color={COLORS.success} />
              </View>
              <View style={settingsScreenStyles.deviceConnectedInfo}>
                <Text style={settingsScreenStyles.deviceConnectedName}>
                  {connectedDevice.serialNumber}
                </Text>
                <Text style={settingsScreenStyles.deviceConnectedDetails}>
                  IP: {connectedDevice.ip} • Version: {connectedDevice.version}
                </Text>
              </View>
            </View>
            <Button
              title="Déconnecter"
              onPress={handleDisconnect}
              variant="outline"
              size="medium"
              icon="log-out"
              style={settingsScreenStyles.actionButton}
            />
          </View>
        )}

        {/* Préférences */}
        <View style={settingsScreenStyles.section}>
          <Text style={settingsScreenStyles.sectionTitle}>Préférences</Text>
          {renderSettingItem(
            'refresh',
            COLORS.primary,
            'Actualisation automatique',
            'Actualise les données automatiquement',
            settings.autoRefresh,
            (value) => updateSetting('autoRefresh', value),
            true
          )}
        </View>

        {/* Gestion des données */}
        <View style={settingsScreenStyles.section}>
          <Text style={settingsScreenStyles.sectionTitle}>Gestion des Données</Text>
          
          <View style={settingsScreenStyles.cacheInfo}>
            <View style={settingsScreenStyles.cacheStats}>
              <View style={settingsScreenStyles.cacheStat}>
                <Text style={settingsScreenStyles.cacheStatValue}>{deviceCount}</Text>
                <Text style={settingsScreenStyles.cacheStatLabel}>Équipements</Text>
              </View>
              <View style={settingsScreenStyles.cacheStat}>
                <Text style={settingsScreenStyles.cacheStatValue}>{cacheSize} KB</Text>
                <Text style={settingsScreenStyles.cacheStatLabel}>Cache utilisé</Text>
              </View>
            </View>
          </View>

          <Button
            title="Voir l'historique"
            onPress={() => navigation.navigate('Historique')}
            variant="outline"
            size="medium"
            icon="time"
            style={settingsScreenStyles.actionButton}
          />

          <Button
            title="Vider le cache"
            onPress={handleClearCache}
            variant="outline"
            size="medium"
            icon="trash"
            style={[settingsScreenStyles.actionButton, settingsScreenStyles.dangerButton]}
          />
        </View>

        {/* À propos */}
        <View style={settingsScreenStyles.section}>
          <Text style={settingsScreenStyles.sectionTitle}>À propos</Text>
          <View style={settingsScreenStyles.aboutContent}>
            <Text style={settingsScreenStyles.aboutText}>
              Application développée pour la surveillance et le contrôle de compteurs électriques intelligents.
            </Text>
            <Text style={settingsScreenStyles.aboutVersion}>
              Version 1.0.0 • Build 2024.1
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

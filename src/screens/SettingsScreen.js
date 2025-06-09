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
              await storageService.clearCache();
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
    <View style={[
      settingsScreenStyles.settingItem,
      isLast && settingsScreenStyles.settingItemLast
    ]}>
      <View style={settingsScreenStyles.settingLeft}>
        <View style={[
          settingsScreenStyles.settingIcon,
          { backgroundColor: iconColor + '20' }
        ]}>
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
      <ScrollView
        style={settingsScreenStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header uniforme */}
        <View style={settingsScreenStyles.header}>
          <TouchableOpacity 
            style={settingsScreenStyles.headerIconClickable}
            onPress={loadSettings}
            activeOpacity={0.8}
          >
            <Ionicons name="settings" size={32} color="#ffffff" />
          </TouchableOpacity>
          <Text style={settingsScreenStyles.title}>Paramètres</Text>
          <Text style={settingsScreenStyles.subtitle}>
            Configuration de l'application
          </Text>
        </View>

        <View style={settingsScreenStyles.content}>
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
              <Text style={settingsScreenStyles.sectionTitle}>
                Équipement Connecté
              </Text>
              
              <View style={settingsScreenStyles.settingItem}>
                <View style={settingsScreenStyles.settingLeft}>
                  <View style={[
                    settingsScreenStyles.settingIcon,
                    { backgroundColor: COLORS.success + '20' }
                  ]}>
                    <Ionicons name="flash" size={20} color={COLORS.success} />
                  </View>
                  <View style={settingsScreenStyles.settingInfo}>
                    <Text style={settingsScreenStyles.settingLabel}>
                      {connectedDevice.serialNumber}
                    </Text>
                    <Text style={settingsScreenStyles.settingDescription}>
                      IP: {connectedDevice.ip} • Version: {connectedDevice.version}
                    </Text>
                  </View>
                </View>
              </View>

              <Button
                title="Se déconnecter"
                onPress={handleDisconnect}
                variant="danger"
                size="medium"
                icon="log-out"
                style={settingsScreenStyles.actionButton}
              />
            </View>
          )}

          {/* Préférences */}
          <View style={settingsScreenStyles.section}>
            <Text style={settingsScreenStyles.sectionTitle}>
              Préférences
            </Text>
            
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

          {/* Données */}
          <View style={settingsScreenStyles.section}>
            <Text style={settingsScreenStyles.sectionTitle}>
              Gestion des Données
            </Text>
            
            <Button
              title="Vider le cache"
              onPress={handleClearCache}
              variant="outline"
              size="medium"
              icon="trash"
              style={settingsScreenStyles.actionButton}
            />
            
            <Button
              title="Voir l'historique"
              onPress={() => navigation.navigate('Historique')}
              variant="outline"
              size="medium"
              icon="time"
              style={settingsScreenStyles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

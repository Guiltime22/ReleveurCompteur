import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDeviceScanner } from '../hooks/useDeviceScanner';
import { useDevice } from '../context/DeviceContext';
import { APP_CONFIG } from '../config/appConfig';
import Button from '../components/ui/Button';
import DeviceCard from '../components/device/DeviceCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { scanScreenStyles } from '../styles/screens/scanScreenStyles';
import { COLORS } from '../styles/global/colors';

export default function ScanScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { devices, isScanning, error, scanNetwork } = useDeviceScanner();
  const { connectToDevice, isLoading, isConnected } = useDevice();

  useEffect(() => {
    if (!isConnected) {
      scanNetwork();
    }
  }, [isConnected]);

  const onRefresh = async () => {
    setRefreshing(true);
    await scanNetwork();
    setRefreshing(false);
  };

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
    setShowPasswordModal(true);
    setPassword('');
  };

  // ✅ S'assurer que la fonction est bien définie
  const handleConnect = async () => {
    console.log('🔌 Bouton connecter appuyé'); // ✅ Ajouter ce log pour debug
    
    try {
      if (APP_CONFIG.USE_MOCK_DATA) {
        if (!password.trim()) {
          Alert.alert('Erreur', 'Veuillez entrer le mot de passe');
          return;
        }
      }

      console.log('🔌 Tentative de connexion...'); // ✅ Log de debug
      const success = await connectToDevice(selectedDevice, password || 'no-password');
      
      if (success) {
        console.log('✅ Connexion réussie'); // ✅ Log de debug
        setShowPasswordModal(false);
        setPassword('');
        navigation.navigate('Dashboard');
      }
    } catch (error) {
      console.error('❌ Erreur connexion:', error);
      Alert.alert('Erreur de connexion', error.message);
    }
  };


  if (isConnected) {
    return (
      <View style={scanScreenStyles.container}>
        <View style={scanScreenStyles.header}>
          <View style={scanScreenStyles.headerContent}>
            <View style={scanScreenStyles.headerIcon}>
              <Ionicons name="checkmark-circle" size={24} color="white" />
            </View>
            <View style={scanScreenStyles.headerTextContainer}>
              <Text style={scanScreenStyles.title}>Connecté</Text>
              <Text style={scanScreenStyles.subtitle}>
                Équipement connecté avec succès
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={scanScreenStyles.scrollView}
          contentContainerStyle={scanScreenStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={scanScreenStyles.connectedState}>
            <Ionicons name="checkmark-circle" size={64} color={COLORS.success} />
            <Text style={scanScreenStyles.connectedTitle}>
              Déjà Connecté
            </Text>
            <Text style={scanScreenStyles.connectedText}>
              Appuyez sur le bouton ci-dessous pour accéder au tableau de bord
            </Text>
            <Button
              title="Aller au Dashboard"
              onPress={() => navigation.navigate('Dashboard')}
              variant="primary"
              size="large"
              icon="speedometer"
              style={scanScreenStyles.dashboardButton}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={scanScreenStyles.container}>
      <View style={scanScreenStyles.header}>
        <View style={scanScreenStyles.headerContent}>
          <Ionicons name="scan" size={24} color="white" />
          <View style={scanScreenStyles.headerTextContainer}>
            <Text style={scanScreenStyles.title}>Scanner</Text>
            <Text style={scanScreenStyles.subtitle}>
              {isScanning
                ? "Recherche en cours..."
                : "Liste des équipements disponible"
              }
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={scanScreenStyles.scrollView}
        contentContainerStyle={scanScreenStyles.scrollContent}
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
        <View style={scanScreenStyles.instructionsCard}>
          <View style={scanScreenStyles.instructionRow}>
            <Ionicons name="wifi" size={20} color={COLORS.primary} />
            <Text style={scanScreenStyles.instructionText}>
              Assurez-vous d'être connecté au réseau WiFi du compteur
            </Text>
          </View>
          <View style={scanScreenStyles.instructionRow}>
            <Ionicons name="refresh" size={20} color={COLORS.primary} />
            <Text style={scanScreenStyles.instructionText}>
              Tirez vers le bas pour actualiser ou appuyez sur l'icône radar
            </Text>
          </View>
        </View>

        {error && (
          <View style={scanScreenStyles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color={COLORS.danger} />
            <Text style={scanScreenStyles.errorText}>{error}</Text>
          </View>
        )}

        {isScanning && (
          <View style={scanScreenStyles.loadingContainer}>
            <LoadingSpinner size="large" color={COLORS.primary} />
            <Text style={scanScreenStyles.loadingText}>
              Scan du réseau en cours...
            </Text>
          </View>
        )}

        {devices.length > 0 && (
          <View style={scanScreenStyles.devicesSection}>
            <View style={scanScreenStyles.sectionHeader}>
              <Text style={scanScreenStyles.sectionTitle}>
                Équipements détectés
              </Text>
              <View style={scanScreenStyles.deviceCount}>
                <Text style={scanScreenStyles.deviceCountText}>
                  {devices.length}
                </Text>
              </View>
            </View>
            
            {devices
              .filter(device => device && device.ip && device.serialNumber)
              .map((device) => (
                <DeviceCard
                  key={device.ip}
                  device={device}
                  onPress={() => handleDeviceSelect(device)}
                  style={scanScreenStyles.deviceCard}
                />
              ))
            }
          </View>
        )}

        {!isScanning && devices.length === 0 && !error && (
          <View style={scanScreenStyles.emptyState}>
            <Ionicons name="search" size={64} color={COLORS.medium} />
            <Text style={scanScreenStyles.emptyTitle}>
              Aucun équipement détecté
            </Text>
            <Text style={scanScreenStyles.emptySubtitle}>
              Assurez-vous d'être connecté au réseau WiFi du compteur et tirez vers le bas pour réessayer
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={scanScreenStyles.modalOverlay}>
          <View style={scanScreenStyles.modalContent}>
            <View style={scanScreenStyles.modalHeader}>
              <Text style={scanScreenStyles.modalTitle}>
                Connexion au compteur
              </Text>
              <TouchableOpacity
                onPress={() => setShowPasswordModal(false)}
                style={scanScreenStyles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.medium} />
              </TouchableOpacity>
            </View>

            {selectedDevice && (
              <View style={scanScreenStyles.deviceInfo}>
                <Text style={scanScreenStyles.deviceInfoTitle}>
                  {selectedDevice.serialNumber}
                </Text>
                <Text style={scanScreenStyles.deviceInfoSubtitle}>
                  IP: {selectedDevice.ip}
                </Text>
              </View>
            )}

            <View style={scanScreenStyles.passwordSection}>
              <Text style={scanScreenStyles.inputLabel}>Mot de passe</Text>
              <View style={scanScreenStyles.passwordInput}>
                <TextInput
                  style={scanScreenStyles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Entrez le mot de passe"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={scanScreenStyles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={COLORS.medium}
                  />
                </TouchableOpacity>
              </View>
              <Text style={scanScreenStyles.passwordHint}>
                💡 Mot de passe de test : "test123" ou "admin"
              </Text>
            </View>

            <View style={scanScreenStyles.modalActions}>
              <Button
                title="Annuler"
                onPress={() => setShowPasswordModal(false)}
                variant="outline"
                size="medium"
                style={scanScreenStyles.modalButton}
              />
              <Button
                title="Se connecter"
                onPress={handleConnect}
                variant="primary"
                size="medium"
                loading={isLoading}
                style={scanScreenStyles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

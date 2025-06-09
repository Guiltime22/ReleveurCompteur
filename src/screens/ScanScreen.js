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

  const handleConnect = async () => {
    if (!password.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer le mot de passe');
      return;
    }

    const success = await connectToDevice(selectedDevice, password);
    if (success) {
      setShowPasswordModal(false);
      setPassword('');
      navigation.navigate('Dashboard');
    }
  };

  if (isConnected) {
    return (
      <View style={scanScreenStyles.container}>
        <View style={scanScreenStyles.header}>
          <TouchableOpacity 
            style={scanScreenStyles.headerIconClickable}
            onPress={scanNetwork}
            disabled={isScanning}
          >
            <Ionicons 
              name={isScanning ? "hourglass" : "checkmark-circle"} 
              size={32} 
              color="#ffffff" 
            />
          </TouchableOpacity>
          <Text style={scanScreenStyles.title}>Déjà Connecté</Text>
          <Text style={scanScreenStyles.subtitle}>
            Appuyez sur l'icône pour scanner d'autres équipements
          </Text>
        </View>
        
        <View style={scanScreenStyles.content}>
          <Button
            title="Aller au Dashboard"
            onPress={() => navigation.navigate('Dashboard')}
            variant="primary"
            size="large"
            icon="speedometer"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={scanScreenStyles.container}>
      <ScrollView
        style={scanScreenStyles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header avec icône cliquable */}
        <View style={scanScreenStyles.header}>
          <TouchableOpacity 
            style={scanScreenStyles.headerIconClickable}
            onPress={scanNetwork}
            disabled={isScanning}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isScanning ? "hourglass" : "scan"} 
              size={32} 
              color="#ffffff" 
            />
          </TouchableOpacity>
          <Text style={scanScreenStyles.title}>Scanner les Équipements</Text>
          <Text style={scanScreenStyles.subtitle}>
            {isScanning 
              ? "Recherche en cours..." 
              : "Appuyez sur l'icône pour rechercher des compteurs"
            }
          </Text>
        </View>

        {/* Status Section - Plus de bouton */}
        <View style={scanScreenStyles.statusSection}>
          {error && (
            <View style={scanScreenStyles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
              <Text style={scanScreenStyles.errorText}>{error}</Text>
            </View>
          )}

          {isScanning && (
            <View style={scanScreenStyles.loadingContainer}>
              <LoadingSpinner size="large" />
              <Text style={scanScreenStyles.loadingText}>
                Scan du réseau en cours...
              </Text>
            </View>
          )}
        </View>

        {/* Devices List */}
        {devices.length > 0 && (
          <View style={scanScreenStyles.devicesSection}>
            <View style={scanScreenStyles.sectionHeader}>
              <Text style={scanScreenStyles.sectionTitle}>
                Équipements détectés
              </Text>
              <View style={scanScreenStyles.deviceCount}>
                <Text style={scanScreenStyles.deviceCountText}>{devices.length}</Text>
              </View>
            </View>
            
            {devices
              .filter(device => device && device.ip && device.serialNumber)
              .map((device) => (
                <DeviceCard
                  key={device.ip}
                  device={device}
                  onPress={() => handleDeviceSelect(device)}
                />
              ))
            }
          </View>
        )}

        {/* Empty State */}
        {!isScanning && devices.length === 0 && !error && (
          <View style={scanScreenStyles.emptyState}>
            <Ionicons name="wifi-outline" size={64} color="#6b7280" />
            <Text style={scanScreenStyles.emptyTitle}>Aucun équipement détecté</Text>
            <Text style={scanScreenStyles.emptySubtitle}>
              Assurez-vous d'être connecté au réseau WiFi du compteur
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Password Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={scanScreenStyles.modalOverlay}>
          <View style={scanScreenStyles.modalContent}>
            <View style={scanScreenStyles.modalHeader}>
              <Text style={scanScreenStyles.modalTitle}>Connexion au compteur</Text>
              <Button
                icon="close"
                variant="ghost"
                size="small"
                onPress={() => setShowPasswordModal(false)}
              />
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
                  placeholder="Entrez le mot de passe (test123)"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  blurOnSubmit={false}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={scanScreenStyles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={24} 
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
                variant="outline"
                size="medium"
                onPress={() => setShowPasswordModal(false)}
                style={scanScreenStyles.modalButton}
              />
              <Button
                title="Se connecter"
                variant="primary"
                size="medium"
                onPress={handleConnect}
                loading={isLoading}
                disabled={!password.trim()}
                style={scanScreenStyles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

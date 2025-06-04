import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDeviceConnection } from '../Hooks/useDeviceConnection';
import { styles } from './ConnectionScreen.styles';
import StatusIndicator from '../Components/UI/StatusIndicator';
import Button from '../Components/UI/Button';

export default function ConnectionScreen() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { 
    isConnected, 
    isLoading, 
    deviceInfo, 
    error,
    detectDevice, 
    authenticate,
    disconnect 
  } = useDeviceConnection();

  const handleConnect = async () => {
    if (!password.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer le mot de passe');
      return;
    }

    const device = await detectDevice();
    if (device) {
      const success = await authenticate(password);
      if (success) {
        Alert.alert('Succès', 'Connexion établie avec succès');
      }
    }
  };

  const handleDisconnect = async () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnecter', onPress: disconnect, style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flash" size={60} color="#2196F3" />
        <Text style={styles.title}>Releveur de Compteur</Text>
        <Text style={styles.subtitle}>
          Connectez-vous au compteur électrique
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <StatusIndicator 
          status={isConnected ? 'connected' : 'disconnected'} 
          label={isConnected ? 'Connecté' : 'Déconnecté'} 
          size="large"
        />
        {deviceInfo && (
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceLabel}>Compteur détecté:</Text>
            <Text style={styles.deviceSerial}>{deviceInfo.serialNumber}</Text>
            <Text style={styles.deviceVersion}>v{deviceInfo.version}</Text>
          </View>
        )}
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>

      {!isConnected ? (
        <View style={styles.form}>
          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Entrez le mot de passe"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={24} 
                color="#757575" 
              />
            </TouchableOpacity>
          </View>

          <Button
            title="Se connecter"
            onPress={handleConnect}
            icon="wifi"
            loading={isLoading}
            disabled={!password.trim()}
            variant="primary"
            size="large"
          />
        </View>
      ) : (
        <View style={styles.connectedContainer}>
          <Text style={styles.connectedText}>
            Connexion établie avec succès !
          </Text>
          <Button
            title="Se déconnecter"
            onPress={handleDisconnect}
            icon="log-out"
            variant="danger"
            size="medium"
          />
        </View>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>Instructions:</Text>
        <Text style={styles.instructionText}>
          1. Connectez-vous au WiFi du compteur
        </Text>
        <Text style={styles.instructionText}>
          2. Entrez le mot de passe fourni
        </Text>
        <Text style={styles.instructionText}>
          3. Appuyez sur "Se connecter"
        </Text>
      </View>
    </ScrollView>
  );
}

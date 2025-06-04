import { Alert } from 'react-native';
import * as Network from 'expo-network';

class WiFiService {
  async getNetworkState() {
    try {
      const networkState = await Network.getNetworkStateAsync();
      return networkState;
    } catch (error) {
      console.error('Erreur état réseau:', error);
      return null;
    }
  }

  async getIPAddress() {
    try {
      const networkState = await Network.getNetworkStateAsync();
      if (networkState.isConnected && networkState.isInternetReachable) {
        const ipAddress = await Network.getIpAddressAsync();
        return ipAddress;
      }
      return null;
    } catch (error) {
      console.error('Erreur IP:', error);
      return null;
    }
  }

  async checkConnectivity() {
    try {
      const networkState = await Network.getNetworkStateAsync();
      return {
        isConnected: networkState.isConnected,
        isWiFi: networkState.type === Network.NetworkStateType.WIFI,
        isInternetReachable: networkState.isInternetReachable,
      };
    } catch (error) {
      console.error('Erreur connectivité:', error);
      return {
        isConnected: false,
        isWiFi: false,
        isInternetReachable: false,
      };
    }
  }

  async showWiFiInstructions() {
    Alert.alert(
      'Connexion WiFi requise',
      'Pour utiliser cette application, vous devez :\n\n' +
      '1. Aller dans les paramètres WiFi de votre téléphone\n' +
      '2. Rechercher le réseau "COMPTEUR_XXXX"\n' +
      '3. Se connecter avec le mot de passe fourni\n' +
      '4. Revenir dans l\'application',
      [
        {
          text: 'Ouvrir les paramètres WiFi',
          onPress: () => {
            // Note: Expo ne permet pas d'ouvrir directement les paramètres WiFi
            // L'utilisateur doit le faire manuellement
            Alert.alert(
              'Information',
              'Veuillez ouvrir manuellement les paramètres WiFi de votre téléphone'
            );
          },
        },
        { text: 'Compris', style: 'cancel' },
      ]
    );
  }
}

export default new WiFiService();

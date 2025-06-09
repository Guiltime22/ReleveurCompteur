import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DeviceProvider } from './src/context/DeviceContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <DeviceProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </DeviceProvider>
    </SafeAreaProvider>
  );
}

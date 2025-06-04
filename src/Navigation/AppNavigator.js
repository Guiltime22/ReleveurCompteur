import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ConnectionScreen from '../Layouts/ConnectionScreen';
import DashboardScreen from '../Layouts/DashboardScreen';
import HistoryScreen from '../Layouts/HistoryScreen';
import SettingsScreen from '../Layouts/SettingsScreen';
import { COLORS } from '../Styles/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Connexion':
              iconName = focused ? 'wifi' : 'wifi-outline';
              break;
            case 'Dashboard':
              iconName = focused ? 'speedometer' : 'speedometer-outline';
              break;
            case 'Historique':
              iconName = focused ? 'time' : 'time-outline';
              break;
            case 'Paramètres':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: 'white',
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightGray,
        },
      })}
    >
      <Tab.Screen name="Connexion" component={ConnectionScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Historique" component={HistoryScreen} />
      <Tab.Screen name="Paramètres" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

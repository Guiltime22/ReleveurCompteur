import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './StatusIndicator.styles';

export default function StatusIndicator({ status, label, size = 'medium' }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: 'checkmark-circle',
          color: '#4CAF50',
          backgroundColor: '#E8F5E8',
        };
      case 'disconnected':
        return {
          icon: 'close-circle',
          color: '#F44336',
          backgroundColor: '#FFEBEE',
        };
      case 'loading':
        return {
          icon: 'time',
          color: '#FF9800',
          backgroundColor: '#FFF3E0',
        };
      case 'warning':
        return {
          icon: 'warning',
          color: '#FF9800',
          backgroundColor: '#FFF3E0',
        };
      default:
        return {
          icon: 'help-circle',
          color: '#757575',
          backgroundColor: '#F5F5F5',
        };
    }
  };

  const config = getStatusConfig();
  const containerStyle = [
    styles.container,
    styles[size],
    { backgroundColor: config.backgroundColor },
  ];

  return (
    <View style={containerStyle}>
      <Ionicons 
        name={config.icon} 
        size={size === 'large' ? 32 : 24} 
        color={config.color} 
      />
      {label && (
        <Text style={[styles.label, { color: config.color }]}>
          {label}
        </Text>
      )}
    </View>
  );
}

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './PowerToggle.styles';
import StatusIndicator from '../UI/StatusIndicator';

export default function PowerToggle({ 
  isOn, 
  onToggle, 
  securityStatus,
  disabled = false 
}) {
  const toggleStyle = [
    styles.toggle,
    isOn ? styles.toggleOn : styles.toggleOff,
    disabled && styles.toggleDisabled,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contrôle d'Alimentation</Text>
        {securityStatus?.alert && (
          <StatusIndicator status="warning" label="Alerte" size="small" />
        )}
      </View>
      
      <TouchableOpacity
        style={toggleStyle}
        onPress={onToggle}
        disabled={disabled}
      >
        <View style={styles.toggleContent}>
          <Ionicons 
            name={isOn ? 'power' : 'power-outline'} 
            size={48} 
            color="white" 
          />
          <Text style={styles.toggleText}>
            {isOn ? 'ALLUMÉ' : 'ÉTEINT'}
          </Text>
        </View>
      </TouchableOpacity>
      
      <Text style={styles.instruction}>
        Appuyez pour {isOn ? 'éteindre' : 'allumer'} le compteur
      </Text>
    </View>
  );
}

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { powerToggleStyles } from '../../styles/components/device/powerToggleStyles';
import { COLORS } from '../../styles/global/colors';

export default function PowerToggle({ 
  isOn, 
  onToggle, 
  disabled = false 
}) {
  return (
    <View style={powerToggleStyles.container}>
      <Text style={powerToggleStyles.title}>Contrôle d'Alimentation</Text>
      
      <TouchableOpacity
        style={[
          powerToggleStyles.toggle,
          isOn ? powerToggleStyles.toggleOn : powerToggleStyles.toggleOff,
          disabled && powerToggleStyles.toggleDisabled
        ]}
        onPress={onToggle}
        disabled={disabled}
        activeOpacity={disabled ? 1 : 0.8}
      >
        <View style={powerToggleStyles.toggleContent}>
          <Ionicons 
            name={disabled ? 'hourglass' : (isOn ? 'power' : 'power-outline')} 
            size={48} 
            color="white" 
          />
          <Text style={powerToggleStyles.toggleText}>
            {disabled ? 'CHARGEMENT' : (isOn ? 'ALLUMÉ' : 'ÉTEINT')}
          </Text>
        </View>
      </TouchableOpacity>
      
      <Text style={powerToggleStyles.instruction}>
        {disabled 
          ? 'Chargement des données...' 
          : `Appuyez pour ${isOn ? 'éteindre' : 'allumer'} le compteur`
        }
      </Text>
    </View>
  );
}

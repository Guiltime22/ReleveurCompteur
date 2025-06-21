import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { powerToggleStyles } from '../../styles/components/device/powerToggleStyles';
import { COLORS } from '../../styles/global/colors';

export default function PowerToggle({
  isOn,
  onToggle,
  disabled = false,
  style
}) {
  return (
    <View style={[powerToggleStyles.container, style]}>
      <View style={powerToggleStyles.content}>
        <View style={powerToggleStyles.textSection}>
          <Text style={powerToggleStyles.title}>Contrôle d'Alimentation</Text>
          <Text style={[
            powerToggleStyles.status,
            { color: disabled ? COLORS.medium : (isOn ? COLORS.success : COLORS.medium) }
          ]}>
            {disabled ? 'CHARGEMENT' : (isOn ? 'ALLUMÉ' : 'ÉTEINT')}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            powerToggleStyles.toggleCompact,
            isOn ? powerToggleStyles.toggleOn : powerToggleStyles.toggleOff,
            disabled && powerToggleStyles.toggleDisabled
          ]}
          onPress={onToggle}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <View style={powerToggleStyles.toggleContent}>
            <Ionicons 
              name="power" 
              size={20} 
              color={COLORS.white} 
            />
            <Text style={powerToggleStyles.toggleText}>
              {isOn ? 'ON' : 'OFF'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={powerToggleStyles.instruction}>
        {disabled
          ? 'Chargement des données...'
          : `Appuyez pour ${isOn ? 'éteindre' : 'allumer'} le compteur`
        }
      </Text>
    </View>
  );
}

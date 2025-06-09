import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { deviceCardStyles } from '../../styles/components/device/deviceCardStyles';
import { COLORS } from '../../styles/global/colors';

export default function DeviceCard({ device, onPress, isSelected = false }) {
  if (!device || !device.ip) {
    return null;
  }
  
  const getSignalColor = (strength) => {
    if (strength > 70) return COLORS.success;
    if (strength > 40) return COLORS.warning;
    return COLORS.danger;
  };

  return (
    <TouchableOpacity
      style={[
        deviceCardStyles.card,
        isSelected && deviceCardStyles.cardSelected
      ]}
      onPress={() => onPress(device)}
      activeOpacity={0.8}
    >
      <View style={deviceCardStyles.cardHeader}>
        <View style={deviceCardStyles.deviceIcon}>
          <Ionicons name="flash" size={24} color={COLORS.primary} />
        </View>
        
        <View style={deviceCardStyles.deviceInfo}>
          <Text style={deviceCardStyles.deviceSerial}>
            {device.serialNumber}
          </Text>
          <Text style={deviceCardStyles.deviceIP}>
            IP: {device.ip}
          </Text>
          <Text style={deviceCardStyles.deviceType}>
            {device.deviceType}
          </Text>
        </View>
        
        <View style={deviceCardStyles.statusContainer}>
          <View style={deviceCardStyles.signalContainer}>
            <Ionicons 
              name="wifi" 
              size={16} 
              color={getSignalColor(device.signalStrength)} 
            />
            <Text style={deviceCardStyles.signalText}>
              {device.signalStrength}%
            </Text>
          </View>
        </View>
      </View>
      
      <View style={deviceCardStyles.deviceFooter}>
        <Text style={deviceCardStyles.versionText}>
          Version: {device.version}
        </Text>
        <View style={deviceCardStyles.statusBadge}>
          <Text style={deviceCardStyles.statusText}>
            Disponible
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

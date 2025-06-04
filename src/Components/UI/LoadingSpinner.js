import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styles } from './LoadingSpinner.styles';

export default function LoadingSpinner({ 
  size = 'small', 
  color = '#2196F3',
  style 
}) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

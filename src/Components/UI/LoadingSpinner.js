import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { loadingSpinnerStyles } from '../../styles/components/ui/loadingSpinnerStyles';

export default function LoadingSpinner({ 
  size = 'small', 
  color = '#6366f1',
  style 
}) {
  return (
    <View style={[loadingSpinnerStyles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

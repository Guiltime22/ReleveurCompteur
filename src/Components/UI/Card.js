import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { cardStyles } from '../../styles/components/ui/cardStyles';

export default function Card({ 
  children, 
  style, 
  onPress,
  elevated = true,
  ...props 
}) {
  const cardStyle = [
    cardStyles.card,
    elevated && cardStyles.elevated,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} {...props}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

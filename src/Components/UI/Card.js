import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { styles } from './Card.styles';

export default function Card({ 
  children, 
  style, 
  onPress,
  elevated = true,
  ...props 
}) {
  const cardStyle = [
    styles.card,
    elevated && styles.elevated,
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

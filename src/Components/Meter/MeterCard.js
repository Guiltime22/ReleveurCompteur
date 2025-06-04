import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './MeterCard.styles';

export default function MeterCard({ 
  title, 
  children, 
  alertStyle = false,
  style 
}) {
  const cardStyle = [
    styles.card,
    alertStyle && styles.alertCard,
    style,
  ];

  const titleStyle = [
    styles.title,
    alertStyle && styles.alertTitle,
  ];

  return (
    <View style={cardStyle}>
      {title && <Text style={titleStyle}>{title}</Text>}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

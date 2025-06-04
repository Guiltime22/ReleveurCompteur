import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './DataDisplay.styles';

export default function DataDisplay({ data }) {
  if (!data || !Array.isArray(data)) {
    return (
      <View style={styles.container}>
        <Text style={styles.noData}>Aucune donnée disponible</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={styles.dataRow}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

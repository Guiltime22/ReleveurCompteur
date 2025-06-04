import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './Button.styles';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  loading = false,
  disabled = false,
  style,
  ...props
}) {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#2196F3'} />
      ) : (
        <>
          {icon && (
            <Ionicons 
              name={icon} 
              size={size === 'large' ? 24 : 20} 
              color={variant === 'primary' ? 'white' : '#2196F3'} 
            />
          )}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

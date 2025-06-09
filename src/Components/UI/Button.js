import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { buttonStyles } from '../../styles/components/ui/buttonStyles';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  ...props
}) {
  const buttonStyle = [
    buttonStyles.button,
    buttonStyles[variant],
    buttonStyles[size],
    (disabled || loading) && buttonStyles.disabled,
    style,
  ];

  const textStyle = [
    buttonStyles.text,
    buttonStyles[`${variant}Text`],
    buttonStyles[`${size}Text`],
  ];

  const iconSize = size === 'large' ? 24 : size === 'small' ? 16 : 20;
  const iconColor = variant === 'outline' ? buttonStyles[`${variant}Text`].color : buttonStyles.primaryText.color;

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? iconColor : '#ffffff'} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={iconSize} color={iconColor} />
          )}
          <Text style={textStyle}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={iconSize} color={iconColor} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

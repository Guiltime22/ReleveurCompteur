import { StyleSheet } from 'react-native';
import { COLORS } from '../../Styles/colors';
import { GLOBAL_STYLES } from '../../Styles/globalStyles';

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    gap: 8,
    ...GLOBAL_STYLES.shadow,
  },
  
  // Variants
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  danger: {
    backgroundColor: COLORS.danger,
  },
  success: {
    backgroundColor: COLORS.success,
  },
  
  // Sizes
  small: {
    height: 36,
    paddingHorizontal: 12,
  },
  medium: {
    height: 48,
    paddingHorizontal: 16,
  },
  large: {
    height: 56,
    paddingHorizontal: 24,
  },
  
  // Text styles
  text: {
    fontWeight: '600',
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.primary,
  },
  dangerText: {
    color: COLORS.white,
  },
  successText: {
    color: COLORS.white,
  },
  
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  disabled: {
    backgroundColor: COLORS.lightGray,
    opacity: 0.6,
  },
});

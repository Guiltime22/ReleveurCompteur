import { StyleSheet } from 'react-native';
import { COLORS } from '../../global/colors';
import { TYPOGRAPHY } from '../../global/typography';
import { SPACING } from '../../global/spacing';

export const buttonStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: SPACING.sm,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  success: {
    backgroundColor: COLORS.success,
  },
  warning: {
    backgroundColor: COLORS.warning,
  },
  danger: {
    backgroundColor: COLORS.danger,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },

  small: {
    height: 36,
    paddingHorizontal: SPACING.md,
  },
  medium: {
    height: SPACING.buttonHeight,
    paddingHorizontal: SPACING.lg,
  },
  large: {
    height: 56,
    paddingHorizontal: SPACING.xl,
  },
  
  text: {
    ...TYPOGRAPHY.bodySemiBold,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.white,
  },
  successText: {
    color: COLORS.white,
  },
  warningText: {
    color: COLORS.white,
  },
  dangerText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
  ghostText: {
    color: COLORS.primary,
  },

  smallText: {
    ...TYPOGRAPHY.captionMedium,
  },
  mediumText: {
    ...TYPOGRAPHY.bodySemiBold,
  },
  largeText: {
    ...TYPOGRAPHY.h4,
  },
  
  disabled: {
    opacity: 0.6,
  },
});

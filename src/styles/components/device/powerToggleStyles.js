import { StyleSheet } from 'react-native';
import { COLORS } from '../../global/colors';
import { TYPOGRAPHY } from '../../global/typography';
import { SPACING } from '../../global/spacing';
import { GLOBAL_STYLES } from '../../global/globalStyles';

export const powerToggleStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    margin: SPACING.md,
    ...GLOBAL_STYLES.shadow,
  },
  
  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.dark,
    marginBottom: SPACING.lg,
  },
  
  toggle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...GLOBAL_STYLES.shadowLarge,
  },
  
  toggleOn: {
    backgroundColor: COLORS.success,
  },
  
  toggleOff: {
    backgroundColor: COLORS.medium,
  },
  
  toggleDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.6,
  },
  
  toggleContent: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  
  toggleText: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.white,
  },
  
  instruction: {
    ...TYPOGRAPHY.caption,
    color: COLORS.medium,
    textAlign: 'center',
  },
});

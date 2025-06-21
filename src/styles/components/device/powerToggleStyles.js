import { StyleSheet } from 'react-native';
import { COLORS } from '../../global/colors';
import { TYPOGRAPHY } from '../../global/typography';
import { SPACING } from '../../global/spacing';
import { GLOBAL_STYLES } from '../../global/globalStyles';

export const powerToggleStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.md,
    ...GLOBAL_STYLES.shadow,
    marginBottom: SPACING.md,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },

  textSection: {
    flex: 1,
    paddingRight: SPACING.md,
  },

  title: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.dark,
    marginBottom: 4,
  },

  status: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },

  toggleCompact: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...GLOBAL_STYLES.shadow,
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
    gap: 2,
  },

  toggleText: {
    ...TYPOGRAPHY.small,
    color: COLORS.white,
    fontWeight: 'bold',
  },

  instruction: {
    ...TYPOGRAPHY.small,
    color: COLORS.medium,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

import { StyleSheet } from 'react-native';
import { COLORS } from '../../global/colors';
import { TYPOGRAPHY } from '../../global/typography';
import { SPACING } from '../../global/spacing';
import { GLOBAL_STYLES } from '../../global/globalStyles';

export const deviceCardStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...GLOBAL_STYLES.shadow,
  },
  
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '10',
  },
  
  cardHeader: {
    ...GLOBAL_STYLES.row,
    marginBottom: SPACING.md,
  },
  
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  
  deviceInfo: {
    flex: 1,
  },
  
  deviceSerial: {
    ...TYPOGRAPHY.h4,
    color: COLORS.dark,
    marginBottom: 4,
  },
  
  deviceIP: {
    ...TYPOGRAPHY.caption,
    color: COLORS.medium,
    marginBottom: 2,
  },
  
  deviceType: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: '600',
  },
  
  statusContainer: {
    alignItems: 'flex-end',
  },
  
  signalContainer: {
    ...GLOBAL_STYLES.row,
    backgroundColor: COLORS.light,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: SPACING.xs,
  },
  
  signalText: {
    ...TYPOGRAPHY.small,
    color: COLORS.medium,
    marginLeft: 4,
  },
  
  deviceFooter: {
    ...GLOBAL_STYLES.row,
    ...GLOBAL_STYLES.spaceBetween,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  
  versionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.medium,
  },
  
  statusBadge: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  
  statusText: {
    ...TYPOGRAPHY.small,
    color: COLORS.success,
    fontWeight: '600',
  },
});

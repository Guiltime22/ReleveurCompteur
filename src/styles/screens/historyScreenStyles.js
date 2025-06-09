import { StyleSheet } from 'react-native';
import { COLORS } from '../global/colors';
import { TYPOGRAPHY } from '../global/typography';
import { SPACING } from '../global/spacing';
import { GLOBAL_STYLES } from '../global/globalStyles';

export const historyScreenStyles = StyleSheet.create({
  container: {
    ...GLOBAL_STYLES.container,
  },
  
  scrollView: {
    flex: 1,
  },
  
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.screenPadding,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  
  headerIconClickable: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.white + 'CC',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  
  content: {
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.lg,
  },
  
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  
  emptyIcon: {
    marginBottom: SPACING.lg,
  },
  
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.medium,
    marginBottom: SPACING.sm,
  },
  
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.medium,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  historyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...GLOBAL_STYLES.shadow,
  },
  
  historyHeader: {
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
  },
  
  connectionTime: {
    ...GLOBAL_STYLES.row,
    backgroundColor: COLORS.light,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  
  connectionTimeText: {
    ...TYPOGRAPHY.small,
    color: COLORS.medium,
    marginLeft: 4,
  },
  
  dataPreview: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  
  dataRow: {
    ...GLOBAL_STYLES.row,
    ...GLOBAL_STYLES.spaceBetween,
    marginBottom: SPACING.sm,
  },
  
  dataLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.medium,
  },
  
  dataValue: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.dark,
  },
  
  actionButton: {
    marginTop: SPACING.md,
  },
});

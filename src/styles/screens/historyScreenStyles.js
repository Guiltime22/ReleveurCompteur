import { StyleSheet } from 'react-native';
import { COLORS } from '../global/colors';
import { TYPOGRAPHY } from '../global/typography';
import { SPACING } from '../global/spacing';
import { GLOBAL_STYLES } from '../global/globalStyles';

const HEADER_HEIGHT = 120;

export const historyScreenStyles = StyleSheet.create({
  container: {
    ...GLOBAL_STYLES.container,
    paddingTop: HEADER_HEIGHT,
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.screenPadding,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    ...GLOBAL_STYLES.shadow,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 10,
  },

  headerContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 80,
  },

  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },

  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },

  headerActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },

  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 2,
  },

  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white + 'CC',
    textAlign: 'center',
    lineHeight: 16,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.md,
    paddingBottom: 100,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },

  emptyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.medium,
    marginTop: SPACING.lg,
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
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 8,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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

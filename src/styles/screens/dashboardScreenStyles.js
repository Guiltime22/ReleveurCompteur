import { StyleSheet } from 'react-native';
import { COLORS } from '../global/colors';
import { TYPOGRAPHY } from '../global/typography';
import { SPACING } from '../global/spacing';
import { GLOBAL_STYLES } from '../global/globalStyles';

const HEADER_HEIGHT = 120;

export const dashboardScreenStyles = StyleSheet.create({
  container: {
    ...GLOBAL_STYLES.container,
    paddingTop: HEADER_HEIGHT,
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.lg,
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

  headerActions: {
    position: 'absolute',
    top: SPACING.lg + 15,
    left: SPACING.screenPadding,
    right: SPACING.screenPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },

  headerActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white + '25',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },

  fraudIndicator: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...GLOBAL_STYLES.shadow,
  },

  fraudIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },

  fraudTextContainer: {
    flex: 1,
  },

  fraudTitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.dark,
    marginBottom: 2,
  },

  fraudStatus: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },

  fraudAlert: {
    padding: SPACING.sm,
    borderRadius: 8,
    backgroundColor: COLORS.danger + '10',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.md,
    paddingBottom: 100,
  },

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },

  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: 'center',
    ...GLOBAL_STYLES.shadow,
  },

  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },

  metricValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.dark,
    marginBottom: 4,
  },

  metricUnit: {
    ...TYPOGRAPHY.small,
    color: COLORS.medium,
  },

  metricLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.medium,
    textAlign: 'center',
  },

  metricLoading: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
  },

  disconnectedContainer: {
    ...GLOBAL_STYLES.centerContent,
    padding: SPACING.screenPadding,
  },

  disconnectedText: {
    ...TYPOGRAPHY.body,
    color: COLORS.medium,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },

  statusMessage: {
    backgroundColor: COLORS.lightBlue,
    padding: SPACING.md,
    borderRadius: 12,
    marginTop: SPACING.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  statusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    textAlign: 'center',
    marginLeft: SPACING.sm,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.lg,
    margin: SPACING.screenPadding,
    maxHeight: '80%',
    width: '90%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.dark,
  },

  dataSection: {
    marginBottom: SPACING.lg,
  },

  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },

  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  dataLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.medium,
  },

  dataValue: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.dark,
  },

  closeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },

  closeButtonText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.white,
  },
});

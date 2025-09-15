import { StyleSheet } from 'react-native';
import { COLORS } from '../global/colors';
import { TYPOGRAPHY } from '../global/typography';
import { SPACING } from '../global/spacing';
import { GLOBAL_STYLES } from '../global/globalStyles';

const HEADER_HEIGHT = 120;

export const scanScreenStyles = StyleSheet.create({
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

  instructionsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...GLOBAL_STYLES.shadow,
  },

  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },

  instructionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    flex: 1,
  },

  connectedState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },

  connectedTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.success,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },

  connectedText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },

  dashboardButton: {
    marginTop: SPACING.md,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.danger + '10',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },

  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.danger,
    marginLeft: SPACING.sm,
    flex: 1,
  },

  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },

  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.medium,
    marginTop: SPACING.md,
  },

  devicesSection: {
    marginBottom: SPACING.lg,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },

  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.dark,
  },

  deviceCount: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deviceCountText: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.white,
  },

  deviceCard: {
    marginBottom: SPACING.sm,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl + 20,
    paddingHorizontal: SPACING.screenPadding,
    maxHeight: '80%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },

  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.dark,
  },

  closeButton: {
    padding: SPACING.sm,
  },

  deviceInfo: {
    backgroundColor: COLORS.light,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },

  deviceInfoTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.dark,
    marginBottom: 4,
  },

  deviceInfoSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.medium,
  },

  passwordSection: {
    marginBottom: SPACING.lg,
  },

  inputLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },

  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    paddingLeft: SPACING.md,
    marginBottom: SPACING.sm,
  },

  textInput: {
    flex: 1,
    height: SPACING.inputHeight,
    ...TYPOGRAPHY.body,
    color: COLORS.dark,
    paddingRight: SPACING.sm,
  },

  eyeButton: {
    padding: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  passwordHint: {
    ...TYPOGRAPHY.small,
    color: COLORS.medium,
    fontStyle: 'italic',
    textAlign: 'center',
    backgroundColor: COLORS.light,
    padding: SPACING.sm,
    borderRadius: 8,
  },

  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },

  modalButton: {
    flex: 1,
  },
});

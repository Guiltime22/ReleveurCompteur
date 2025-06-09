import { StyleSheet } from 'react-native';
import { COLORS } from '../global/colors';
import { TYPOGRAPHY } from '../global/typography';
import { SPACING } from '../global/spacing';
import { GLOBAL_STYLES } from '../global/globalStyles';

export const scanScreenStyles = StyleSheet.create({
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
  
  statusSection: {
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.lg,
  },
  
  errorContainer: {
    ...GLOBAL_STYLES.row,
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
    paddingHorizontal: SPACING.screenPadding,
    paddingBottom: SPACING.lg,
  },
  
  sectionHeader: {
    ...GLOBAL_STYLES.row,
    ...GLOBAL_STYLES.spaceBetween,
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
  
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.screenPadding,
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
  
  content: {
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.lg,
    flex: 1,
    justifyContent: 'center',
  },
  
  // Modal styles (inchangés)
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
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.screenPadding,
    maxHeight: '80%',
  },
  
  modalHeader: {
    ...GLOBAL_STYLES.row,
    ...GLOBAL_STYLES.spaceBetween,
    marginBottom: SPACING.lg,
  },
  
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.dark,
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
    ...GLOBAL_STYLES.row,
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

  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl + 20,
    paddingHorizontal: SPACING.screenPadding,
    maxHeight: '80%',
  },
  
  modalActions: {
    ...GLOBAL_STYLES.row,
    gap: SPACING.md,
  },
  
  modalButton: {
    flex: 1,
  },
});

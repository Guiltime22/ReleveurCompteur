import { StyleSheet } from 'react-native';
import { COLORS } from '../global/colors';
import { TYPOGRAPHY } from '../global/typography';
import { SPACING } from '../global/spacing';
import { GLOBAL_STYLES } from '../global/globalStyles';

export const settingsScreenStyles = StyleSheet.create({
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

  appInfoSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...GLOBAL_STYLES.shadow,
  },
  
  appInfoHeader: {
    ...GLOBAL_STYLES.row,
    alignItems: 'center',
  },
  
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  
  appDetails: {
    flex: 1,
  },
  
  appName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.dark,
    marginBottom: 4,
  },
  
  appVersion: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.primary,
    marginBottom: 4,
  },
  
  appDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.medium,
    lineHeight: 18,
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
  
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...GLOBAL_STYLES.shadow,
  },
  
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },
  
  settingItem: {
    ...GLOBAL_STYLES.row,
    ...GLOBAL_STYLES.spaceBetween,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  
  settingItemLast: {
    borderBottomWidth: 0,
  },
  
  settingLeft: {
    ...GLOBAL_STYLES.row,
    flex: 1,
  },
  
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  
  settingInfo: {
    flex: 1,
  },
  
  settingLabel: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.dark,
    marginBottom: 2,
  },
  
  settingDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.medium,
  },
  
  switchContainer: {
    marginLeft: SPACING.md,
  },
  
  actionButton: {
    marginBottom: SPACING.md,
  },
  
  dangerButton: {
    marginTop: SPACING.md,
  },
  
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.screenPadding,
  },
  
  footerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.medium,
    textAlign: 'center',
    marginBottom: 4,
  },
  
  versionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.medium,
    textAlign: 'center',
  },
});

import { StyleSheet } from 'react-native';
import { COLORS } from '../global/colors';
import { TYPOGRAPHY } from '../global/typography';
import { SPACING } from '../global/spacing';
import { GLOBAL_STYLES } from '../global/globalStyles';

const HEADER_HEIGHT = 120;

export const settingsScreenStyles = StyleSheet.create({
  container: {
    ...GLOBAL_STYLES.container,
    paddingTop: HEADER_HEIGHT,
  },

  // Header fixe compact
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

  // Contenu scrollable
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.md,
    paddingBottom: 100,
  },

  // Sections
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

  // App info
  appInfoSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...GLOBAL_STYLES.shadow,
  },

  appInfoHeader: {
    flexDirection: 'row',
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

  // Device connecté
  deviceConnected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '10',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },

  deviceConnectedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },

  deviceConnectedInfo: {
    flex: 1,
  },

  deviceConnectedName: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.dark,
    marginBottom: 2,
  },

  deviceConnectedDetails: {
    ...TYPOGRAPHY.caption,
    color: COLORS.medium,
  },

  // Settings items
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  settingItemLast: {
    borderBottomWidth: 0,
  },

  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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

  // Cache info
  cacheInfo: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },

  cacheStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  cacheStat: {
    alignItems: 'center',
  },

  cacheStatValue: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    marginBottom: 4,
  },

  cacheStatLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.medium,
  },

  // About
  aboutContent: {
    alignItems: 'center',
  },

  aboutText: {
    ...TYPOGRAPHY.body,
    color: COLORS.medium,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.md,
  },

  aboutVersion: {
    ...TYPOGRAPHY.caption,
    color: COLORS.medium,
    textAlign: 'center',
  },

  // Buttons
  actionButton: {
    marginBottom: SPACING.md,
  },

  dangerButton: {
    borderColor: COLORS.danger,
  },
});

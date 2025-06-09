import { StyleSheet } from 'react-native';
import { COLORS } from '../global/colors';
import { TYPOGRAPHY } from '../global/typography';
import { SPACING } from '../global/spacing';
import { GLOBAL_STYLES } from '../global/globalStyles';

export const dashboardScreenStyles = StyleSheet.create({
  container: {
    ...GLOBAL_STYLES.container,
  },
  
  scrollView: {
    flex: 1,
  },
  
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.screenPadding,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...GLOBAL_STYLES.shadow,
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

  headerActions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },

  headerActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white + '20',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  headerActionDisabled: {
    opacity: 0.5,
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
  
  headerContent: {
    alignItems: 'center',
  },

  headerInfo: {
    alignItems: 'center',
    paddingTop: SPACING.sm,
  },
  
  deviceName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 4,
  },

  deviceIP: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white + 'CC',
    textAlign: 'center',
  },
    
  lastUpdate: {
    ...TYPOGRAPHY.small,
    color: COLORS.white + 'AA',
    textAlign: 'center',
  },
  
  content: {
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.lg,
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
  
  metricLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.medium,
    textAlign: 'center',
  },
  
  metricUnit: {
    ...TYPOGRAPHY.small,
    color: COLORS.medium,
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

  // ✅ Styles pour les icônes d'action
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: SPACING.lg,
    marginVertical: SPACING.lg,
    ...GLOBAL_STYLES.shadow,
  },

  actionIcon: {
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    minWidth: 100,
  },

  actionIconDisabled: {
    opacity: 0.5,
  },

  actionLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.dark,
    marginTop: SPACING.sm,
    textAlign: 'center',
    fontWeight: '600',
  },

  actionLabelDisabled: {
    color: COLORS.medium,
  },

  // ✅ Styles pour les états de loading
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },

  loadingText: {
    ...TYPOGRAPHY.small,
    color: COLORS.white + 'AA',
    fontStyle: 'italic',
  },

  metricCardLoading: {
    opacity: 0.7,
  },

  metricLoading: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
  },

  statusContainer: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },

  statusMessage: {
    backgroundColor: COLORS.lightBlue,
    padding: SPACING.md,
    borderRadius: 12,
    marginTop: SPACING.md,
    alignItems: 'center',
  },

  statusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    textAlign: 'center',
  },
  
  // Modal styles
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

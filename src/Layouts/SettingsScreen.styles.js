import { StyleSheet } from 'react-native';
import { COLORS } from '../Styles/colors';
import { TYPOGRAPHY } from '../Styles/typography';
import { GLOBAL_STYLES } from '../Styles/globalStyles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.dark,
    marginTop: 10,
  },
  
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.gray,
    marginTop: 5,
  },
  
  infoContainer: {
    gap: 12,
  },
  
  infoRow: {
    ...GLOBAL_STYLES.row,
    ...GLOBAL_STYLES.spaceBetween,
    paddingVertical: 8,
  },
  
  infoLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.gray,
    flex: 1,
  },
  
  infoValue: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.dark,
    textAlign: 'right',
  },
  
  settingContainer: {
    gap: 20,
  },
  
  settingRow: {
    ...GLOBAL_STYLES.row,
    ...GLOBAL_STYLES.spaceBetween,
    alignItems: 'flex-start',
  },
  
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  
  settingLabel: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  
  settingDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.gray,
  },
  
  actionContainer: {
    gap: 15,
  },
  
  actionButton: {
    width: '100%',
  },
  
  footer: {
    alignItems: 'center',
    padding: 30,
    gap: 8,
  },
  
  footerText: {
    ...TYPOGRAPHY.small,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

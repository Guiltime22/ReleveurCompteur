import { StyleSheet } from 'react-native';
import { COLORS } from '../Styles/colors';
import { TYPOGRAPHY } from '../Styles/typography';
import { GLOBAL_STYLES } from '../Styles/globalStyles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  disconnectedContainer: {
    ...GLOBAL_STYLES.centerContent,
    padding: 20,
  },
  
  disconnectedText: {
    ...TYPOGRAPHY.body,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 20,
  },
  
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.dark,
  },
  
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.gray,
    marginTop: 5,
  },
  
  lastUpdate: {
    ...TYPOGRAPHY.small,
    color: COLORS.gray,
    marginTop: 8,
    fontStyle: 'italic',
  },
  
  securityContainer: {
    alignItems: 'center',
    gap: 10,
  },
  
  securityMessage: {
    ...TYPOGRAPHY.caption,
    color: COLORS.gray,
    textAlign: 'center',
  },
  
  alertText: {
    ...TYPOGRAPHY.body,
    color: COLORS.danger,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 10,
  },
  
  alertDetails: {
    ...TYPOGRAPHY.caption,
    color: COLORS.danger,
    textAlign: 'center',
  },
});

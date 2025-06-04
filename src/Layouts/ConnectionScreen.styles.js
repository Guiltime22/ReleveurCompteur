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
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.dark,
    marginTop: 15,
    textAlign: 'center',
  },
  
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
  },
  
  statusContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 20,
  },
  
  deviceInfo: {
    alignItems: 'center',
    marginTop: 15,
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    ...GLOBAL_STYLES.shadow,
  },
  
  deviceLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.gray,
  },
  
  deviceSerial: {
    ...TYPOGRAPHY.h3,
    color: COLORS.dark,
    marginTop: 5,
  },
  
  deviceVersion: {
    ...TYPOGRAPHY.small,
    color: COLORS.gray,
    marginTop: 2,
  },
  
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.danger,
    textAlign: 'center',
    marginTop: 10,
  },
  
  form: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  
  label: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 10,
  },
  
  passwordContainer: {
    ...GLOBAL_STYLES.row,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginBottom: 20,
  },
  
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    ...TYPOGRAPHY.body,
  },
  
  eyeButton: {
    padding: 15,
    justifyContent: 'center',
  },
  
  connectedContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  
  connectedText: {
    ...TYPOGRAPHY.body,
    color: COLORS.success,
    textAlign: 'center',
    marginBottom: 20,
  },
  
  instructions: {
    backgroundColor: COLORS.lightBlue,
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  
  instructionTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 15,
  },
  
  instructionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.gray,
    marginBottom: 8,
    paddingLeft: 10,
  },
});

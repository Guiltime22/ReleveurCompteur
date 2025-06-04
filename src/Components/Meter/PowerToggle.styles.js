import { StyleSheet } from 'react-native';
import { COLORS } from '../../Styles/colors';
import { GLOBAL_STYLES } from '../../Styles/globalStyles';

export const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    ...GLOBAL_STYLES.shadow,
  },
  
  header: {
    ...GLOBAL_STYLES.row,
    ...GLOBAL_STYLES.spaceBetween,
    marginBottom: 20,
  },
  
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
  },
  
  toggle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    ...GLOBAL_STYLES.shadow,
  },
  
  toggleOn: {
    backgroundColor: COLORS.success,
  },
  
  toggleOff: {
    backgroundColor: COLORS.gray,
  },
  
  toggleDisabled: {
    backgroundColor: COLORS.lightGray,
    opacity: 0.6,
  },
  
  toggleContent: {
    alignItems: 'center',
    gap: 8,
  },
  
  toggleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  instruction: {
    textAlign: 'center',
    color: COLORS.gray,
    fontSize: 14,
  },
});

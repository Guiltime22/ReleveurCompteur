import { StyleSheet } from 'react-native';
import { COLORS } from '../../Styles/colors';
import { GLOBAL_STYLES } from '../../Styles/globalStyles';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    margin: 10,
    ...GLOBAL_STYLES.shadow,
  },
  
  alertCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
    backgroundColor: '#FFEBEE',
  },
  
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 12,
  },
  
  alertTitle: {
    color: COLORS.danger,
  },
  
  content: {
    flex: 1,
  },
});

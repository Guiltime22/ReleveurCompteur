import { StyleSheet } from 'react-native';
import { COLORS } from '../../Styles/colors';
import { GLOBAL_STYLES } from '../../Styles/globalStyles';

export const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  
  dataRow: {
    ...GLOBAL_STYLES.row,
    ...GLOBAL_STYLES.spaceBetween,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  
  label: {
    fontSize: 16,
    color: COLORS.gray,
    flex: 1,
  },
  
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    textAlign: 'right',
  },
  
  noData: {
    textAlign: 'center',
    color: COLORS.gray,
    fontStyle: 'italic',
    padding: 20,
  },
});

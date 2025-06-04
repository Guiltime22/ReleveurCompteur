import { StyleSheet } from 'react-native';
import { COLORS } from '../../Styles/colors';
import { GLOBAL_STYLES } from '../../Styles/globalStyles';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
  },
  
  elevated: {
    ...GLOBAL_STYLES.shadow,
  },
});

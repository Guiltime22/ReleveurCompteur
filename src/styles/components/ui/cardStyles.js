import { StyleSheet } from 'react-native';
import { COLORS } from '../../global/colors';
import { SPACING } from '../../global/spacing';
import { GLOBAL_STYLES } from '../../global/globalStyles';

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.cardPadding,
  },
  
  elevated: {
    ...GLOBAL_STYLES.shadow,
  },
});

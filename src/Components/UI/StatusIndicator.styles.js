import { StyleSheet } from 'react-native';
import { COLORS } from '../../Styles/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  
  small: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  
  medium: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  
  large: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});

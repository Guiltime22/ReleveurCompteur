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
  
  emptyContainer: {
    ...GLOBAL_STYLES.centerContent,
    paddingVertical: 60,
  },
  
  emptyText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.gray,
    marginTop: 20,
  },
  
  emptySubtext: {
    ...TYPOGRAPHY.caption,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },
  
  entryContainer: {
    gap: 8,
  },
  
  dataRow: {
    ...GLOBAL_STYLES.row,
    ...GLOBAL_STYLES.spaceBetween,
    paddingVertical: 4,
  },
  
  dataLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.gray,
  },
  
  dataValue: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.dark,
  },
  
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  
  footerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
});

import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from '../../../components';
import { COLORS } from '../constants';
import { ReactNode } from 'react';

interface SliderCardProps {
  title: string;
  children: ReactNode;
  style?: ViewStyle;
}

export function SliderCard({ title, children, style }: SliderCardProps) {
  return (
    <View style={[styles.card, style]}>
      <Text tx={title} h4 style={styles.title} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: COLORS.cardStyle,
  title: {
    marginBottom: 12,
    color: COLORS.textColor,
  },
});

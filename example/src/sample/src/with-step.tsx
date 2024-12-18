import { Slider } from 'react-native-awesome-slider';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Text } from '../../components';
import { COLORS } from './constants';

export function WithStep() {
  const progress = useSharedValue(30);
  const min = useSharedValue(0);
  const max = useSharedValue(100);

  return (
    <View style={styles.card}>
      <Text tx="Step Slider" h4 style={styles.title} />
      <Slider
        progress={progress}
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        theme={COLORS.sliderTheme}
        steps={10}
        forceSnapToStep
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: COLORS.cardStyle,
  title: {
    marginBottom: 12,
    color: COLORS.textColor,
  },
  slider: {
    marginBottom: 20,
    marginTop: 12,
  },
});

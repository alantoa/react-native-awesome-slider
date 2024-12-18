import { Slider } from 'react-native-awesome-slider';
import { StyleSheet } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { COLORS } from './constants';
import { SliderCard } from './components/slider-card';

export function Basic() {
  const progress = useSharedValue(30);
  const min = useSharedValue(0);
  const max = useSharedValue(100);

  return (
    <SliderCard title="Basic Usage">
      <Slider
        progress={progress}
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        theme={COLORS.sliderTheme}
      />
    </SliderCard>
  );
}

const styles = StyleSheet.create({
  slider: {
    marginBottom: 20,
    marginTop: 12,
  },
});

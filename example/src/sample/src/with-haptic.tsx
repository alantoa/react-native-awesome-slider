import { Slider, HapticModeEnum } from 'react-native-awesome-slider';
import { StyleSheet } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS } from './constants';
import { SliderCard } from './components/slider-card';

export function WithHaptic() {
  const progress = useSharedValue(30);
  const min = useSharedValue(10);
  const max = useSharedValue(110);

  return (
    <SliderCard title="Range & Haptic step-mode">
      <Slider
        progress={progress}
        minimumValue={min}
        style={styles.slider}
        maximumValue={max}
        steps={10}
        sliderHeight={2}
        onHapticFeedback={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }}
        forceSnapToStep
        onSlidingComplete={(e) => {
          console.log(e);
        }}
        thumbWidth={24}
        hapticMode={HapticModeEnum.STEP}
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

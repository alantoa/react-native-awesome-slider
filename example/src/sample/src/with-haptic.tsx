import { Slider, HapticModeEnum } from 'react-native-awesome-slider';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS } from './constants';
import { SliderCard } from './components/slider-card';
import { Switch, Text } from '../../components';
import { useState } from 'react';

const step = 14;

const fibNumbers = Array.from({ length: step + 1 }).reduce<number[]>(
  (acc, _, i) => {
    if (i <= 1) return [...acc, i];
    // @ts-ignore
    return [...acc, acc[i - 1] + acc[i - 2]];
  },
  []
);

export function WithHaptic() {
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const progress = useSharedValue(30);
  const min = useSharedValue(10);
  const max = useSharedValue(110);

  return (
    <SliderCard title="Custom marks">
      <Slider
        progress={progress}
        minimumValue={min}
        style={styles.slider}
        maximumValue={max}
        steps={step}
        sliderHeight={2}
        onHapticFeedback={() => {
          if (hapticFeedback) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
        }}
        renderMark={({ index }) => {
          if (!fibNumbers.includes(index)) {
            return null;
          }
          return <View style={styles.mark} />;
        }}
        forceSnapToStep
        // snapThreshold={6}
        onSlidingComplete={(e) => {
          console.log(e);
        }}
        thumbWidth={24}
        hapticMode={HapticModeEnum.STEP}
        theme={COLORS.sliderTheme}
      />
      <View style={COLORS.optionStyle}>
        <Text tx="Haptic feedback" />
        <Switch value={hapticFeedback} onValueChange={setHapticFeedback} />
      </View>
    </SliderCard>
  );
}

const styles = StyleSheet.create({
  slider: {
    marginBottom: 20,
    marginTop: 12,
  },
  mark: {
    width: 4,
    height: 8,
    backgroundColor: COLORS.markColor,
  },
});

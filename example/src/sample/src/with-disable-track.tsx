import { Slider, HapticModeEnum } from 'react-native-awesome-slider';
import { StyleSheet } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { COLORS } from './constants';
import { SliderCard } from './components/slider-card';

export function WithDisableTrack() {
  const progress = useSharedValue(40);
  const min = useSharedValue(0);
  const max = useSharedValue(100);

  return (
    <SliderCard title="Disable track follow">
      <Slider
        progress={progress}
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        theme={COLORS.sliderTheme}
        disableTapEvent
        disableTrackFollow
        hapticMode={HapticModeEnum.BOTH}
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

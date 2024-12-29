import { Slider } from 'react-native-awesome-slider';
import { StyleSheet, Image, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { COLORS } from './constants';
import { SliderCard } from './components/slider-card';

const thumbWidth = 15;
const bubbleWidth = 90;

export function WithCustomBubble() {
  const progress = useSharedValue(30);
  const min = useSharedValue(0);
  const max = useSharedValue(100);

  return (
    <SliderCard title="Custom bubble & thumb">
      <Slider
        progress={progress}
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        bubbleWidth={bubbleWidth}
        bubbleMaxWidth={bubbleWidth}
        bubbleTranslateY={-50}
        bubbleOffsetX={5}
        thumbWidth={thumbWidth}
        renderThumb={() => <View style={styles.customThumb} />}
        renderBubble={() => <View style={styles.customBubble} />}
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
  customThumb: {
    width: thumbWidth,
    height: thumbWidth + 10,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: COLORS.bubbleBackgroundColor,
  },
  customBubble: {
    alignItems: 'center',
    width: bubbleWidth,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  bubbleImg: {
    width: 90,
    borderRadius: 4,
    height: 60,
  },
});

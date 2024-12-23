import { Slider } from 'react-native-awesome-slider';
import { StyleSheet, View } from 'react-native';
import {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { COLORS } from './constants';
import { SliderCard } from './components/slider-card';
import Animated from 'react-native-reanimated';

const colors = [
  '#FF4B4B',
  '#FF764B',
  '#FFA14B',
  '#FFD24B',
  '#FFE74B',
  '#E9FF4B',
  '#BFFF4B',
  '#89FF4B',
  '#4BFF62',
  '#4BFFA1',
];
const step = colors.length - 1;

const TrackSegment = ({
  index,
  progress,
  step,
  color,
}: {
  index: number;
  progress: SharedValue<number>;
  step: number;
  color: string | undefined;
}) => {
  const style = useAnimatedStyle(() => {
    const progressStep = Math.round((progress.value / 100) * step);
    return {
      opacity: index < progressStep ? 1 : 0,
    };
  });
  return (
    <View
      style={[
        styles.track,
        {
          borderTopLeftRadius: index === 0 ? 999 : 0,
          borderBottomLeftRadius: index === 0 ? 999 : 0,
          borderTopRightRadius: index === step - 1 ? 999 : 0,
          borderBottomRightRadius: index === step - 1 ? 999 : 0,
          overflow: 'hidden',
        },
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFillObject, style]}>
        <View
          style={[StyleSheet.absoluteFillObject, { backgroundColor: color }]}
        />
      </Animated.View>
    </View>
  );
};

const sliderHeight = 8;

export function WithCustomTrack() {
  const progress = useSharedValue(50);
  const min = useSharedValue(0);
  const max = useSharedValue(100);

  return (
    <SliderCard title="Custom tracks & marks">
      <Slider
        progress={progress}
        minimumValue={min}
        style={styles.slider}
        containerStyle={styles.containerStyle}
        maximumValue={max}
        steps={step}
        sliderHeight={sliderHeight}
        renderMark={({ index }) => {
          if (index === 0 || index === step) return null;
          return (
            <View
              style={[
                styles.mark,
                {
                  backgroundColor: COLORS.markColor,
                },
              ]}
            />
          );
        }}
        renderTrack={({ index }) => {
          return (
            <TrackSegment
              index={index}
              progress={progress}
              step={step}
              color={colors[index]}
            />
          );
        }}
        forceSnapToStep
        thumbWidth={20}
        theme={{
          ...COLORS.sliderTheme,
        }}
      />
    </SliderCard>
  );
}

const styles = StyleSheet.create({
  slider: {
    marginBottom: 20,
    marginTop: 12,
  },
  containerStyle: {
    overflow: 'hidden',
    borderRadius: 999,
  },
  mark: {
    width: 2,
    height: sliderHeight,
  },
  track: {
    height: '100%',
    width: '100%',
  },
});

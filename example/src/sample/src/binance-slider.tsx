import { Slider } from 'react-native-awesome-slider';
import { StyleSheet, TextInput, View } from 'react-native';
import {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Text } from '../../components';
import Animated from 'react-native-reanimated';
import { useCallback, useState } from 'react';

const markWidth = 8;
const thumbWidth = markWidth + 4;
const backgroundColor = '#202630';
const markColor = '#EAECEF';
const borderColor = '#343B47';
const bubbleBackgroundColor = '#E0E2E5';
const bubbleTextColor = '#262C36';

const Mark = ({ slideOver }: { slideOver?: boolean }) => {
  return (
    <View
      style={{
        width: slideOver ? markWidth + 2 : markWidth,
        height: slideOver ? markWidth + 2 : markWidth,
        left: slideOver ? -1 : 0,
        top: slideOver ? -1 : 0,
        transform: [{ rotate: '45deg' }],
        backgroundColor: slideOver ? markColor : backgroundColor,
        borderWidth: 1,
        borderColor: slideOver ? markColor : borderColor,
        borderRadius: 2,
      }}
    />
  );
};

const Thumb = () => {
  return (
    <View
      style={{
        width: thumbWidth + 2,
        height: thumbWidth + 2,
        transform: [{ rotate: '45deg' }],
        backgroundColor: backgroundColor,
        borderWidth: 1,
        borderColor: markColor,
        borderRadius: 2,
      }}
    />
  );
};
export function BinanceSlider() {
  const [value, setValue] = useState(0);
  const progress = useSharedValue(25);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  const thumbScaleValue = useSharedValue(1);
  const step = 4;

  useAnimatedReaction(
    () => {
      return value;
    },
    (data) => {
      if (data !== undefined && !isNaN(data)) {
        progress.value = data;
      }
    },
    [value]
  );
  return (
    <View style={styles.card}>
      <Text tx="Binance Slider" h4 style={styles.title} />
      <TextInput
        style={{
          backgroundColor: 'grey',
          color: 'blue',
          marginBottom: 4,
          height: 40,
          width: 200,
        }}
        placeholder="Enter value"
        onChangeText={(text) => {
          setValue(Number(text));
        }}
      />
      <Slider
        steps={4}
        thumbWidth={thumbWidth}
        sliderHeight={2}
        forceSnapToStep={false}
        onSlidingStart={() => {
          thumbScaleValue.value = 1.15;
        }}
        onSlidingComplete={() => {
          thumbScaleValue.value = 1;
        }}
        bubble={useCallback((s: number) => {
          return `${Math.round(s)}%`;
        }, [])}
        snapThreshold={6}
        snapThresholdMode="absolute"
        markWidth={markWidth}
        renderMark={useCallback(
          ({ index }: { index: number }) => {
            return (
              <>
                <Mark key={index} />
                <MarkWithAnimatedView
                  index={index}
                  progress={progress}
                  step={step}
                />
              </>
            );
          },
          [progress]
        )}
        theme={{
          maximumTrackTintColor: borderColor,
          minimumTrackTintColor: markColor,
          bubbleBackgroundColor: bubbleBackgroundColor,
          bubbleTextColor: bubbleTextColor,
        }}
        renderThumb={() => <Thumb />}
        style={styles.slider}
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        thumbScaleValue={thumbScaleValue}
      />
    </View>
  );
}
const MarkWithAnimatedView = ({
  index,
  progress,
  step,
}: {
  index: number;
  progress: SharedValue<number>;
  step: number;
}) => {
  const style = useAnimatedStyle(() => {
    const progressStep = Math.floor((progress.value / 100) * step);
    return {
      opacity: index <= progressStep ? 1 : 0,
    };
  });
  return (
    <Animated.View style={[{ ...StyleSheet.absoluteFillObject }, style]}>
      <Mark slideOver />
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 14,
    marginTop: 20,
    shadowColor: '#000',
    backgroundColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    elevation: 1,
  },
  title: {
    marginBottom: 12,
    color: markColor,
  },
  slider: {
    marginBottom: 20,
    marginTop: 12,
  },
  container: {
    flex: 1,
  },
});

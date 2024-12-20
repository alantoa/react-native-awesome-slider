import {
  Platform,
  StyleSheet,
  TextInput,
  Pressable,
  View,
  Text,
} from 'react-native';
import {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { useCallback, useState } from 'react';
import { COLORS } from './constants';
import { Switch } from './switch';
import dynamic from 'next/dynamic';
const Slider = dynamic(
  () => import('react-native-awesome-slider').then((mod) => mod.Slider),
  { ssr: false }
);

const markWidth = 10;
const thumbWidth = markWidth + 4;
const backgroundColor = COLORS.backgroundColor;
const markColor = COLORS.markColor;
const borderColor = COLORS.borderColor;

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
        width: thumbWidth,
        height: thumbWidth,
        transform: [{ rotate: '45deg' }],
        backgroundColor: backgroundColor,
        borderWidth: 1,
        borderColor: markColor,
        borderRadius: 2,
      }}
    />
  );
};
export function SliderExample() {
  const [value, setValue] = useState(25);
  const [forceSnapToStep, setForceSnapToStep] = useState(false);
  const [snapThreshold, setSnapThreshold] = useState(6);

  const progress = useSharedValue(100);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  const thumbScaleValue = useSharedValue(1);
  const isScrubbing = useSharedValue(false);
  const step = 4;

  useAnimatedReaction(
    () => {
      return value;
    },
    (data) => {
      if (data !== undefined && !isNaN(data) && !isScrubbing.value) {
        progress.value = data;
      }
    },
    [value]
  );
  return (
    <View style={styles.full}>
      <View>
        <View style={styles.inputContainer}>
          <TextInput
            style={{
              color: markColor,
              height: 38,
              borderRadius: 8,
              paddingHorizontal: 40,
              fontWeight: '500',
              fontSize: 14,
              width: 120,
            }}
            autoFocus={false}
            inputMode="numeric"
            {...(Platform.OS === 'web'
              ? { value: value.toString() }
              : { defaultValue: value.toString() })}
            placeholder="Enter value"
            onChangeText={(text) => {
              if (!isNaN(Number(text))) {
                if (Number(text) > max.value) {
                  setValue(max.value);
                } else if (Number(text) < min.value) {
                  setValue(min.value);
                } else {
                  setValue(Number(text));
                }
              }
            }}
          />

          <Pressable
            style={{
              left: 0,
              ...styles.button,
            }}
            onPress={() => {
              setValue(value - 1);
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '500', color: markColor }}>
              -
            </Text>
          </Pressable>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              position: 'absolute',
              right: 0,
              ...styles.button,
            }}
            onPress={() => {
              setValue(value + 1);
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '500', color: markColor }}>
              +
            </Text>
          </Pressable>
        </View>
      </View>
      <Slider
        steps={step}
        thumbWidth={thumbWidth}
        sliderHeight={3}
        isScrubbing={isScrubbing}
        // disableTrackPress
        // thumbTouchSize={thumbWidth * 2}
        forceSnapToStep={forceSnapToStep}
        onSlidingStart={() => {
          thumbScaleValue.value = 1.15;
        }}
        // disableTapEvent={true}
        onSlidingComplete={() => {
          thumbScaleValue.value = 1;
        }}
        bubble={useCallback((s: number) => {
          return `${Math.round(s)}%`;
        }, [])}
        snapThreshold={snapThreshold}
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
        theme={COLORS.sliderTheme}
        renderThumb={() => <Thumb />}
        onValueChange={useCallback((value: number) => {
          setValue(Math.round(value));
        }, [])}
        style={styles.slider}
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        thumbScaleValue={thumbScaleValue}
      />
      <View style={COLORS.optionStyle}>
        <Text style={styles.desc}>forceSnapToStep</Text>
        <Switch value={forceSnapToStep} onValueChange={setForceSnapToStep} />
      </View>
      <View style={COLORS.optionStyle}>
        <Text style={styles.desc}>snapThreshold</Text>
        <TextInput
          style={{
            color: markColor,
            height: 32,
            borderRadius: 8,
            fontWeight: '500',
            fontSize: 14,
            width: 60,
            borderWidth: 1,
            borderColor: COLORS.borderColor,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
          inputMode="numeric"
          value={snapThreshold.toString()}
          onChangeText={(text) => {
            setSnapThreshold(Number(text));
          }}
        />
      </View>
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
  full: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackgroundColor,
    height: 38,
    justifyContent: 'center',
    marginBottom: 12,
  },
  slider: {
    marginBottom: 20,
    marginTop: 12,
  },
  container: {
    flex: 1,
  },

  desc: {
    color: COLORS.descriptionColor,
  },
  button: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    // @ts-ignore
    userSelect: 'none',
  },
});

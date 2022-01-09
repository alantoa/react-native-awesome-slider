import React, { useRef } from 'react';
import { LayoutChangeEvent, TextStyle, View, ViewStyle } from 'react-native';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Bubble, BubbleRef } from './';
import { palette } from './theme/palette';
import { clamp } from './utils';

export type AwesomeSliderProps = {
  /**
   * color to fill the progress in the seekbar
   */
  minimumTrackTintColor?: string;

  /**
   * color to fill the background in the seekbar
   */
  maximumTrackTintColor?: string;

  /**
   * color to fill the cache in the seekbar
   */
  cacheTrackTintColor?: string;

  /**
   * style for the container view
   */
  style?: any;

  /**
   * color of the border of the slider
   */
  borderColor?: string;

  /**
   * a function that gets the current value of the slider as you slide it,
   * and returns a string to be used inside the bubble. if not provided it will use the
   * current value as integer.
   */
  bubble?: (s: number) => string;

  /**
   * an AnimatedValue from `react-native-reanimated` library which is the
   * current value of the slider.
   */
  progress: Animated.SharedValue<number>;

  /**
   * an AnimatedValue from `react-native-reanimated` library which is the
   * curren value of the cache. the cache is optional and will be rendered behind
   * the main progress indicator.
   */
  cache?: Animated.SharedValue<number>;

  /**
   * an AnimatedValue from `react-native-reanimated` library which is the
   * minimum value of the slider.
   */
  minimumValue: Animated.SharedValue<number>;

  /**
   * an AnimatedValue from `react-native-reanimated` library which is the
   * maximum value of the slider.
   */
  maximumValue: Animated.SharedValue<number>;

  /**
   * callback called when the users starts sliding
   */
  onSlidingStart: () => void;

  /**
   * callback called when slide value change
   * @reture max/min
   */
  onValueChange?: (second: number) => void;

  /**
   * callback called when the users stops sliding. the new value will be passed as
   * argument
   */
  onSlidingComplete: (second: number) => void;

  /**
   * render custom Bubble to show when sliding.
   */
  renderBubble?: () => React.ReactNode;

  /**
   * this function will be called while sliding, and should set the text inside your custom
   * bubble.
   */
  setBubbleText?: (s: string) => void;

  /**
   * value to pass to the container of the bubble as `translateY`
   */
  bubbleTranslateY?: number;

  /**
   * render custom thumb image. if you need to customize thumb,
   * you also need to set the `thumb width`
   */
  renderThumbImage?: () => React.ReactNode;

  /**
   * thumb elements width, default 15
   */
  thumbWidth?: number;

  /**
   * disable slide
   */
  disable?: Animated.SharedValue<boolean>;
  /**
   * disable slide color, default is minimumTrackTintColor
   */
  disableMinTrackTintColor?: string;
  /**
   * enable tap event change value, default true
   */
  disableTapEvent?: boolean;

  /**
   * bubble elements max width, default 100.
   */
  bubbleMaxWidth?: number;
  /**
   * with progress sliding timingConfig
   */
  timingConfig?: Animated.WithTimingConfig;
  bubbleTextStyle?: TextStyle;
  bubbleContainerStyle?: ViewStyle;
  bubbleBackgroundColor?: string;
};
const defaultTimingConfig: Animated.WithTimingConfig = {
  duration: 300,
};
export const Slider = ({
  renderBubble,
  renderThumbImage,
  style,
  minimumTrackTintColor = palette.Main(1),
  maximumTrackTintColor = palette.G3(1),
  cacheTrackTintColor = palette.G6(1),
  borderColor = palette.transparent,
  bubbleTranslateY = -25,
  progress,
  minimumValue,
  maximumValue,
  cache,
  onSlidingComplete,
  onSlidingStart,
  setBubbleText,
  onValueChange,
  thumbWidth = 15,
  disable,
  disableTapEvent = false,
  bubble,
  bubbleMaxWidth = 100,
  timingConfig = defaultTimingConfig,
  disableMinTrackTintColor = palette.G4(1),
  bubbleBackgroundColor = palette.Main(1),
  bubbleTextStyle,
  bubbleContainerStyle,
}: AwesomeSliderProps) => {
  const bubbleRef = useRef<BubbleRef>(null);
  /**
   *  current progress convert to animated value.
   * @returns number
   */

  const width = useSharedValue(0);
  const seekValue = useSharedValue(0);
  const thumbValue = useSharedValue(0);
  const bubbleOpacity = useSharedValue(0);
  const isScrubbing = useSharedValue(false);

  const animatedSeekStyle = useAnimatedStyle(() => {
    const currentValue = clamp(
      (progress.value / (minimumValue.value + maximumValue.value)) *
        width.value,
      0,
      width.value - thumbWidth,
    );
    return {
      width: withTiming(
        currentValue,
        isScrubbing.value
          ? {
              duration: 0,
            }
          : timingConfig,
      ),
      backgroundColor: disable?.value
        ? disableMinTrackTintColor
        : minimumTrackTintColor,
    };
  }, [progress.value, isScrubbing.value]);

  const animatedThumbStyle = useAnimatedStyle(() => {
    const currentValue = clamp(
      (progress.value / (minimumValue.value + maximumValue.value)) *
        width.value,
      0,
      width.value - thumbWidth,
    );

    return {
      transform: [
        {
          translateX: withTiming(
            clamp(currentValue, 0, width.value - thumbWidth),
            isScrubbing.value
              ? {
                  duration: 0,
                }
              : timingConfig,
          ),
        },
      ],
    };
  }, [progress.value, isScrubbing.value]);

  const animatedBubbleStyle = useAnimatedStyle(() => {
    return {
      opacity: bubbleOpacity.value,
      transform: [
        {
          translateY: bubbleTranslateY,
        },
        {
          translateX: thumbValue.value + thumbWidth / 2,
        },
        {
          scale: bubbleOpacity.value,
        },
      ],
    };
  });

  const animatedCacheXStyle = useAnimatedStyle(() => {
    return {
      width: cache?.value || 0,
    };
  });

  const onSlideAcitve = (second: number) => {
    const formatSecond = `${Math.round(second * 100) / 100}`;
    const bubbleText = bubble ? bubble?.(second) : formatSecond;
    onValueChange?.(second);
    setBubbleText
      ? setBubbleText(bubbleText)
      : bubbleRef.current?.setText(bubbleText);
  };

  /**
   * convert Sharevalue to seconds
   * @returns number
   */
  const shareValueToSeconds = () => {
    'worklet';
    return ((thumbValue.value + thumbWidth) / width.value) * maximumValue.value;
  };
  /**
   * convert [x] position to progress
   * @returns number
   */
  const xToProgress = (x: number) => {
    'worklet';
    return clamp(
      Math.round((x / width.value) * maximumValue.value),
      minimumValue.value,
      maximumValue.value,
    );
  };
  /**
   * change slide value
   */
  const onActiveSlider = (x: number) => {
    'worklet';
    isScrubbing.value = true;
    thumbValue.value = clamp(x, 0, width.value - thumbWidth);
    seekValue.value = clamp(x, 0, width.value - thumbWidth);
    const currentValue = xToProgress(x);
    progress.value = clamp(
      currentValue,
      minimumValue.value,
      maximumValue.value,
    );
    runOnJS(onSlideAcitve)(shareValueToSeconds());
  };

  const onGestureEvent = useAnimatedGestureHandler<
    GestureEvent<PanGestureHandlerEventPayload>
  >({
    onStart: () => {
      if (disable?.value) return;

      bubbleOpacity.value = withSpring(1);
      isScrubbing.value = true;
      if (onSlidingStart) {
        runOnJS(onSlidingStart)();
      }
    },
    onActive: ({ x }) => {
      if (disable?.value) return;
      onActiveSlider(x);
    },

    onEnd: () => {
      if (disable?.value) return;
      bubbleOpacity.value = withSpring(0);
      isScrubbing.value = false;
      if (onSlidingComplete) {
        runOnJS(onSlidingComplete)(shareValueToSeconds());
      }
    },
  });

  const onSingleTapEvent = useAnimatedGestureHandler<
    GestureEvent<TapGestureHandlerEventPayload>
  >({
    onActive: ({ x }) => {
      if (disable?.value || disableTapEvent) return;
      onActiveSlider(x);
    },
    onEnd: () => {
      if (disable?.value || disableTapEvent) return;

      bubbleOpacity.value = withSpring(0);
      isScrubbing.value = true;
      if (onSlidingComplete) {
        runOnJS(onSlidingComplete)(shareValueToSeconds());
      }
    },
  });

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    width.value = nativeEvent.layout.width;
    const currentValue =
      (progress.value / (minimumValue.value + maximumValue.value)) *
      nativeEvent.layout.width;

    thumbValue.value = seekValue.value = clamp(
      currentValue,
      0,
      nativeEvent.layout.width - thumbWidth,
    );
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} minDist={0}>
      <Animated.View>
        <TapGestureHandler onGestureEvent={onSingleTapEvent}>
          <Animated.View
            style={[
              {
                flex: 1,
                height: 30,
                overflow: 'visible',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#3330',
              },
              style,
            ]}
            onLayout={onLayout}>
            <Animated.View
              style={{
                width: '100%',
                height: 5,
                borderRadius: 2,
                borderColor: borderColor,
                overflow: 'hidden',
                borderWidth: 1,
                backgroundColor: maximumTrackTintColor,
              }}>
              <Animated.View
                style={[
                  {
                    backgroundColor: cacheTrackTintColor,
                    height: '100%',
                    left: 0,
                    position: 'absolute',
                  },
                  animatedCacheXStyle,
                ]}
              />
              <Animated.View
                style={[
                  {
                    height: '100%',
                    maxWidth: '100%',
                    left: 0,
                    position: 'absolute',
                  },
                  animatedSeekStyle,
                ]}
              />
            </Animated.View>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  left: 0,
                },
                animatedThumbStyle,
              ]}>
              {renderThumbImage ? (
                renderThumbImage()
              ) : (
                <View
                  style={{
                    backgroundColor: minimumTrackTintColor,
                    height: thumbWidth,
                    width: thumbWidth,
                    borderRadius: thumbWidth,
                  }}
                />
              )}
            </Animated.View>

            <Animated.View
              style={[
                {
                  position: 'absolute',
                  left: -bubbleMaxWidth / 2,
                  width: bubbleMaxWidth,
                },
                animatedBubbleStyle,
              ]}>
              {renderBubble ? (
                renderBubble()
              ) : (
                <Bubble
                  ref={bubbleRef}
                  color={bubbleBackgroundColor}
                  textStyle={bubbleTextStyle}
                  containerStyle={bubbleContainerStyle}
                  bubbleMaxWidth={bubbleMaxWidth}
                />
              )}
            </Animated.View>
          </Animated.View>
        </TapGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
};

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
const formatSeconds = (second: number) => `${Math.round(second * 100) / 100}`;

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
  bubbleTextStyle?: TextStyle;
  bubbleContainerStyle?: ViewStyle;
  bubbleBackgroundColor?: string;
  isScrubbing?: Animated.SharedValue<boolean>;
  onTap?: () => void;
  thumbScaleValue?: Animated.SharedValue<number>;
  sliderHeight?: number;
};

export const Slider = ({
  renderBubble,
  renderThumbImage,
  style,
  minimumTrackTintColor = palette.Main,
  maximumTrackTintColor = palette.G3,
  cacheTrackTintColor = palette.G6,
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
  disableMinTrackTintColor = palette.Main,
  bubbleBackgroundColor = palette.Main,
  bubbleTextStyle,
  bubbleContainerStyle,
  isScrubbing,
  onTap,
  thumbScaleValue,
  sliderHeight = 30,
}: AwesomeSliderProps) => {
  const bubbleRef = useRef<BubbleRef>(null);
  /**
   *  current progress convert to animated value.
   * @returns number
   */

  const width = useSharedValue(0);
  const thumbValue = useSharedValue(0);
  const bubbleOpacity = useSharedValue(0);

  const sliderTotalValue = () => {
    'worklet';
    return minimumValue.value + maximumValue.value;
  };
  const progressToValue = (value: number) => {
    'worklet';
    if (sliderTotalValue() === 0) return 0;
    return (value / sliderTotalValue()) * (width.value - thumbWidth);
  };
  const animatedSeekStyle = useAnimatedStyle(() => {
    const currentValue = progressToValue(progress.value) + thumbWidth / 2;

    return {
      width: clamp(currentValue, 0, width.value),
    };
  }, [progress.value, minimumValue.value, maximumValue.value]);

  const animatedThumbStyle = useAnimatedStyle(() => {
    const currentValue = progressToValue(progress.value);

    return {
      transform: [
        {
          translateX: clamp(currentValue, 0, width.value - thumbWidth),
        },
        {
          scale: withTiming(thumbScaleValue ? thumbScaleValue.value : 1, {
            duration: 100,
          }),
        },
      ],
    };
  }, [progress.value, minimumValue.value, maximumValue.value]);

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
    const cacheX = cache?.value
      ? (cache?.value / sliderTotalValue()) * width.value
      : 0;

    return {
      width: cacheX,
    };
  });

  const onSlideAcitve = (seconds: number) => {
    const bubbleText = bubble ? bubble?.(seconds) : formatSeconds(seconds);
    onValueChange?.(seconds);

    setBubbleText
      ? setBubbleText(bubbleText)
      : bubbleRef.current?.setText(bubbleText);
  };

  /**
   * convert Sharevalue to callback seconds
   * @returns number
   */
  const shareValueToSeconds = () => {
    'worklet';

    return (thumbValue.value / (width.value - thumbWidth)) * sliderTotalValue();
  };
  /**
   * convert [x] position to progress
   * @returns number
   */
  const xToProgress = (x: number) => {
    'worklet';
    return clamp(
      (x / (width.value - thumbWidth)) * sliderTotalValue(),
      minimumValue.value,
      sliderTotalValue(),
    );
  };

  /**
   * change slide value
   */
  const onActiveSlider = (x: number) => {
    'worklet';
    if (isScrubbing) {
      isScrubbing.value = true;
    }
    thumbValue.value = clamp(x, 0, width.value - thumbWidth);

    progress.value = clamp(
      xToProgress(x),
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
      if (isScrubbing) {
        isScrubbing.value = true;
      }
      bubbleOpacity.value = withSpring(1);

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
      if (isScrubbing) {
        isScrubbing.value = true;
      }
      bubbleOpacity.value = withSpring(0);

      if (onSlidingComplete) {
        runOnJS(onSlidingComplete)(shareValueToSeconds());
      }
    },
  });

  const onSingleTapEvent = useAnimatedGestureHandler<
    GestureEvent<TapGestureHandlerEventPayload>
  >({
    onActive: ({ x }) => {
      if (onTap) {
        runOnJS(onTap)();
      }
      if (disable?.value) return;
      if (disableTapEvent) return;

      onActiveSlider(x);
    },
    onEnd: () => {
      if (disable?.value || disableTapEvent) return;
      if (isScrubbing) {
        isScrubbing.value = true;
      }
      bubbleOpacity.value = withSpring(0);

      if (onSlidingComplete) {
        runOnJS(onSlidingComplete)(shareValueToSeconds());
      }
    },
  });

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const layoutWidth = nativeEvent.layout.width;
    width.value = layoutWidth;
    const currentValue =
      (progress.value / (minimumValue.value + maximumValue.value)) *
      layoutWidth;

    thumbValue.value = clamp(currentValue, 0, layoutWidth - thumbWidth);
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} minDist={0}>
      <Animated.View
        style={[
          {
            flex: 1,
            height: sliderHeight,
          },
          style,
        ]}
        hitSlop={{
          top: 8,
          left: 0,
          bottom: 8,
          right: 0,
        }}
        onLayout={onLayout}>
        <TapGestureHandler onGestureEvent={onSingleTapEvent}>
          <Animated.View
            style={{
              width: '100%',
              height: '100%',
              overflow: 'visible',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
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
                    backgroundColor: disable?.value
                      ? disableMinTrackTintColor
                      : minimumTrackTintColor,
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

import React, { useRef, useState } from 'react';
import {
  Insets,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
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
const hitSlop = {
  top: 12,
  bottom: 12,
};
export type AwesomeSliderProps = {
  /**
   * Color to fill the progress in the seekbar
   */
  minimumTrackTintColor?: string;
  /**
   * Color to fill the background in the seekbar
   */
  maximumTrackTintColor?: string;

  /**
   * Color to fill the cache in the seekbar
   */
  cacheTrackTintColor?: string;

  /**
   * Style for the container view
   */
  style?: StyleProp<ViewStyle>;

  sliderHeight?: number;
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * A function that gets the current value of the slider as you slide it,
   * and returns a string to be used inside the bubble. if not provided it will use the
   * current value as integer.
   */
  bubble?: (s: number) => string;

  /**
   * An Animated.SharedValue from `react-native-reanimated` library which is the
   * current value of the slider.
   */
  progress: Animated.SharedValue<number>;

  /**
   * A Animated.SharedValue from `react-native-reanimated` library which is the
   * curren value of the cache. the cache is optional and will be rendered behind
   * the main progress indicator.
   */
  cache?: Animated.SharedValue<number>;

  /**
   * An  Animated.SharedValue from `react-native-reanimated` library which is the minimum value of the slider.
   */
  minimumValue: Animated.SharedValue<number>;

  /**
   * An Animated.SharedValue from `react-native-reanimated` library which is themaximum value of the slider.
   */
  maximumValue: Animated.SharedValue<number>;

  /**
   * Callback called when the users starts sliding
   */
  onSlidingStart?: () => void;

  /**
   * Callback called when slide value change
   */
  onValueChange?: (value: number) => void;

  /**
   * Callback called when the users stops sliding. the new value will be passed as argument
   */
  onSlidingComplete?: (value: number) => void;

  /**
   * Render custom Bubble to show when sliding.
   */
  renderBubble?: () => React.ReactNode;

  /**
   * This function will be called while sliding, and should set the text inside your custom bubble.
   */
  setBubbleText?: (s: string) => void;

  /**
   * Value to pass to the container of the bubble as `translateY`
   */
  bubbleTranslateY?: number;

  /**
   * Render custom thumb image. if you need to customize thumb, you also need to set the `thumb width`
   */
  renderThumb?: () => React.ReactNode;

  /**
   * Thumb elements width, default 15
   */
  thumbWidth?: number;
  /**
   * Disable slider
   */
  disable?: boolean;
  /**
   * Disable slider color, default is minimumTrackTintColor
   */
  disableMinTrackTintColor?: string;
  /**
   * Enable tap event change value, default true
   */
  disableTapEvent?: boolean;
  /**
   * Bubble elements max width, default 100.
   */
  bubbleMaxWidth?: number;
  bubbleTextStyle?: StyleProp<TextStyle>;
  bubbleContainerStyle?: StyleProp<ViewStyle>;
  bubbleBackgroundColor?: string;
  /**
   * By this, you know the slider status as quickly as possible.(This is useful when you doing video-palyer’s scrubber.)
   */
  isScrubbing?: Animated.SharedValue<boolean>;
  /**
   * On tap slider event.(This is useful when you doing video-palyer’s scrubber.)
   */
  onTap?: () => void;
  /**
   * By this, you can control thumb’s transform-scale animation.
   */
  thumbScaleValue?: Animated.SharedValue<number>;
  panHitSlop?: Insets;

  step?: number;
  markStyle?: StyleProp<ViewStyle>;
  markWidth?: number;
};

export const Slider = ({
  renderBubble,
  renderThumb,
  style,
  minimumTrackTintColor = palette.Main,
  maximumTrackTintColor = palette.G3,
  cacheTrackTintColor = palette.G6,
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
  disable = false,
  disableTapEvent = false,
  bubble,
  bubbleMaxWidth = 100,
  disableMinTrackTintColor = palette.G3,
  bubbleBackgroundColor = palette.Main,
  bubbleTextStyle,
  bubbleContainerStyle,
  isScrubbing,
  onTap,
  thumbScaleValue,
  sliderHeight = 5,
  containerStyle,
  panHitSlop = hitSlop,
  step,
  markStyle,
  markWidth = 4,
}: AwesomeSliderProps) => {
  const bubbleRef = useRef<BubbleRef>(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const width = useSharedValue(0);
  const thumbValue = useSharedValue(0);
  const bubbleOpacity = useSharedValue(0);
  const markLeftArr = useSharedValue<number[]>([]);
  const thumbIndex = useSharedValue(0);

  const sliderTotalValue = () => {
    'worklet';
    return maximumValue.value + minimumValue.value;
  };

  const progressToValue = (value: number) => {
    'worklet';
    if (sliderTotalValue() === 0) {
      return 0;
    }
    return (value / sliderTotalValue()) * (width.value - thumbWidth);
  };

  const animatedSeekStyle = useAnimatedStyle(() => {
    let seekWidth = 0;
    // when you set step
    if (step && markLeftArr.value.length >= step) {
      seekWidth = markLeftArr.value[thumbIndex.value] + thumbWidth / 2;
    } else {
      seekWidth = progressToValue(progress.value) + thumbWidth / 2;
    }
    return {
      width: clamp(seekWidth, 0, width.value),
    };
  }, [progress, minimumValue, maximumValue, width]);

  const animatedThumbStyle = useAnimatedStyle(() => {
    let translateX = 0;
    // when you set step
    if (step && markLeftArr.value.length >= step) {
      translateX = markLeftArr.value[thumbIndex.value];
    } else {
      translateX = progressToValue(progress.value);
    }
    return {
      transform: [
        {
          translateX,
        },
        {
          scale: withTiming(thumbScaleValue ? thumbScaleValue.value : 1, {
            duration: 100,
          }),
        },
      ],
    };
  }, [progress, minimumValue, maximumValue, width.value]);

  const animatedBubbleStyle = useAnimatedStyle(() => {
    let translateX = 0;
    // when you set step
    if (step && markLeftArr.value.length >= step) {
      translateX = clamp(
        markLeftArr.value[thumbIndex.value] + thumbWidth / 2,
        thumbWidth / 2,
        width.value - thumbWidth / 2,
      );
    } else {
      translateX = thumbValue.value + thumbWidth / 2;
    }
    return {
      opacity: bubbleOpacity.value,
      transform: [
        {
          translateY: bubbleTranslateY,
        },
        {
          translateX,
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
    const sliderPercent = clamp(
      thumbValue.value / (width.value - thumbWidth) +
        minimumValue.value / sliderTotalValue(),
      0,
      1,
    );
    return clamp(
      sliderPercent * sliderTotalValue(),
      minimumValue.value,
      maximumValue.value,
    );
  };
  /**
   * convert [x] position to progress
   * @returns number
   */
  const xToProgress = (x: number) => {
    'worklet';
    if (step && markLeftArr.value.length >= step) {
      return markLeftArr.value[thumbIndex.value];
    } else {
      return (x / (width.value - thumbWidth)) * sliderTotalValue();
    }
  };

  /**
   * change slide value
   */
  const onActiveSlider = (x: number) => {
    'worklet';
    if (isScrubbing) {
      isScrubbing.value = true;
    }
    if (step) {
      const index = markLeftArr.value.findIndex(item => item >= x);
      const arrNext = markLeftArr.value[index];
      const arrPrev = markLeftArr.value[index - 1];
      const currentX = (arrNext + arrPrev) / 2;
      if (x - thumbWidth / 2 > currentX) {
        thumbIndex.value = index;
      } else {
        if (index - 1 === -1) {
          thumbIndex.value === 0;
        } else if (index - 1 < -1) {
          thumbIndex.value = step;
        } else {
          thumbIndex.value = index - 1;
        }
      }

      runOnJS(onSlideAcitve)(
        clamp(
          minimumValue.value +
            (thumbIndex.value / step) *
              (maximumValue.value - minimumValue.value),
          minimumValue.value,
          maximumValue.value,
        ),
      );
    } else {
      thumbValue.value = clamp(x, 0, width.value - thumbWidth);
      progress.value = xToProgress(x);

      runOnJS(onSlideAcitve)(shareValueToSeconds());
    }
  };

  const onGestureEvent = useAnimatedGestureHandler<
    GestureEvent<PanGestureHandlerEventPayload>
  >({
    onStart: () => {
      if (disable) {
        return;
      }
      if (isScrubbing) {
        isScrubbing.value = true;
      }
      if (onSlidingStart) {
        runOnJS(onSlidingStart)();
      }
    },
    onActive: ({ x }) => {
      if (disable) {
        return;
      }
      bubbleOpacity.value = withSpring(1);
      onActiveSlider(x);
    },

    onEnd: () => {
      if (disable) {
        return;
      }
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
      if (disable) {
        return;
      }
      if (disableTapEvent) {
        return;
      }

      onActiveSlider(x);
    },
    onEnd: () => {
      if (disable || disableTapEvent) {
        return;
      }
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
    setSliderWidth(layoutWidth);
    if (step) {
      // correct mark left position Array
      markLeftArr.value = new Array(step + 1).fill(0).map((_, i) => {
        return (
          Math.round(layoutWidth * (i / step)) -
          (i / step) * markWidth -
          Math.round(thumbWidth / 3)
        );
      });

      const marksLeft = new Array(step + 1)
        .fill(0)
        .map((_, i) => Math.round(layoutWidth * (i / step)));

      // current positon width
      const currentWidth =
        ((progress.value - minimumValue.value) /
          (maximumValue.value - minimumValue.value)) *
        layoutWidth;

      const currentIndex = marksLeft.findIndex(value => value >= currentWidth);
      thumbIndex.value = clamp(currentIndex, 0, step);
    } else {
      const currentValue =
        (progress.value / (minimumValue.value + maximumValue.value)) *
        layoutWidth;
      thumbValue.value = clamp(currentValue, 0, layoutWidth - thumbWidth);
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      minDist={10}
      hitSlop={panHitSlop}
      minPointers={1}
      maxPointers={1}>
      <Animated.View
        style={[styles.view, { height: sliderHeight }, style]}
        hitSlop={panHitSlop}
        onLayout={onLayout}>
        <TapGestureHandler onGestureEvent={onSingleTapEvent}>
          <Animated.View style={styles.container}>
            <Animated.View
              style={StyleSheet.flatten([
                styles.slider,
                {
                  height: sliderHeight,
                  backgroundColor: maximumTrackTintColor,
                },
                containerStyle,
              ])}>
              <Animated.View
                style={[
                  styles.cache,
                  {
                    backgroundColor: cacheTrackTintColor,
                  },
                  animatedCacheXStyle,
                ]}
              />
              <Animated.View
                style={[
                  styles.seek,
                  {
                    backgroundColor: disable
                      ? disableMinTrackTintColor
                      : minimumTrackTintColor,
                  },
                  animatedSeekStyle,
                ]}
              />
            </Animated.View>
            {sliderWidth > 0 &&
              step &&
              new Array(step + 1).fill(0).map((_, i) => {
                return (
                  <View
                    key={i}
                    style={[
                      styles.mark,
                      {
                        width: markWidth,
                        borderRadius: markWidth,
                        left: sliderWidth * (i / step) - (i / step) * markWidth,
                      },
                      markStyle,
                    ]}
                  />
                );
              })}
            <Animated.View style={[styles.thumb, animatedThumbStyle]}>
              {renderThumb ? (
                renderThumb()
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
                styles.bubble,
                {
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
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    width: '100%',
    overflow: 'hidden',
  },
  view: {
    flex: 1,
  },
  cache: {
    height: '100%',
    left: 0,
    position: 'absolute',
  },
  seek: {
    height: '100%',
    maxWidth: '100%',
    left: 0,
    position: 'absolute',
  },
  mark: {
    height: 4,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 1,
  },
  thumb: {
    position: 'absolute',
    left: 0,
  },
  bubble: {
    position: 'absolute',
  },
});

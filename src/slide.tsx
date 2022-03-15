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
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
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
export enum HapticModeEnum {
  NONE = 'none',
  STEP = 'step',
  BOTH = 'both',
}
export enum PanDirectionEnum {
  START = 0,
  LEFT = 1,
  RIGHT = 2,
  END = 3,
}
export type SliderThemeType =
  | {
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
       * Color to fill the bubble backgrouundColor
       */
      bubbleBackgroundColor?: string;
      /**
       * Bubble text color
       */
      bubbleTextColor?: string;
      /**
       * Disabled color to fill the progress in the seekbar
       */
      disableMinTrackTintColor?: string;
    }
  | null
  | undefined;

export type AwesomeSliderProps = {
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
   * Enable tap event change value, default true
   */
  disableTapEvent?: boolean;
  /**
   * Bubble elements max width, default 100.
   */
  bubbleMaxWidth?: number;
  bubbleTextStyle?: StyleProp<TextStyle>;
  bubbleContainerStyle?: StyleProp<ViewStyle>;

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
  onHapticFeedback?: () => void;
  hapticMode?: HapticModeEnum;
  theme?: SliderThemeType;
  /**
   * Current swipe direction
   * @enum Animated.SharedValue<PanDirectionEnum>
   */
  panDirectionValue?: Animated.SharedValue<PanDirectionEnum>;
  /**
   * Disable track follow thumb.(Commonly used in video/audio players)
   */
  disableTrackFollow?: boolean;
  /**
   * Bubble width, If you set this value, bubble positioning left & right will be clamp.
   */
  bubbleWidth?: number;
};
const defaultTheme: SliderThemeType = {
  minimumTrackTintColor: palette.Main,
  maximumTrackTintColor: palette.Gray,
  cacheTrackTintColor: palette.Gray,
  bubbleBackgroundColor: palette.Main,
  bubbleTextColor: palette.White,
};
export const Slider = ({
  renderBubble,
  renderThumb,
  style,
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
  onHapticFeedback,
  hapticMode = HapticModeEnum.NONE,
  theme,
  panDirectionValue,
  disableTrackFollow = false,
  bubbleWidth = 0,
}: AwesomeSliderProps) => {
  const bubbleRef = useRef<BubbleRef>(null);
  const prevX = useSharedValue(0);

  const [sliderWidth, setSliderWidth] = useState(0);
  const width = useSharedValue(0);
  const thumbValue = useSharedValue(0);
  const bubbleOpacity = useSharedValue(0);
  const markLeftArr = useSharedValue<number[]>([]);
  const thumbIndex = useSharedValue(0);
  const isTriggedHaptic = useSharedValue(false);
  const _theme = {
    ...defaultTheme,
    ...theme,
  };

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
  }, [progress, minimumValue, maximumValue, width, markLeftArr]);

  const animatedThumbStyle = useAnimatedStyle(() => {
    let translateX = 0;
    // when you set step
    if (step && markLeftArr.value.length >= step) {
      translateX = markLeftArr.value[thumbIndex.value];
    } else if (disableTrackFollow) {
      translateX = clamp(thumbValue.value, 0, width.value - thumbWidth);
    } else {
      translateX = clamp(
        progressToValue(progress.value),
        0,
        width.value - thumbWidth,
      );
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
      translateX = markLeftArr.value[thumbIndex.value] + thumbWidth / 2;
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
          translateX: clamp(
            translateX,
            bubbleWidth / 2,
            width.value - bubbleWidth / 2,
          ),
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
    if (step) {
      return clamp(
        minimumValue.value +
          (thumbIndex.value / step) * (maximumValue.value - minimumValue.value),
        minimumValue.value,
        maximumValue.value,
      );
    } else {
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
    }
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
      // Computing step boundaries
      const currentX = (arrNext + arrPrev) / 2;
      const thumbIndexPrev = thumbIndex.value;
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
      // Determine trigger haptics callback
      if (
        thumbIndexPrev !== thumbIndex.value &&
        hapticMode === HapticModeEnum.STEP &&
        onHapticFeedback
      ) {
        runOnJS(onHapticFeedback)();
        isTriggedHaptic.value = true;
      } else {
        isTriggedHaptic.value = false;
      }

      runOnJS(onSlideAcitve)(shareValueToSeconds());
    } else {
      thumbValue.value = clamp(x, 0, width.value - thumbWidth);
      if (!disableTrackFollow) {
        progress.value = xToProgress(x);
      }
      // Determines whether the thumb slides to both ends
      if (x <= 0 || x >= width.value - thumbWidth) {
        if (
          !isTriggedHaptic.value &&
          hapticMode === HapticModeEnum.BOTH &&
          onHapticFeedback
        ) {
          runOnJS(onHapticFeedback)();
          isTriggedHaptic.value = true;
        }
      } else {
        isTriggedHaptic.value = false;
      }
      runOnJS(onSlideAcitve)(shareValueToSeconds());
    }
  };

  const onGestureEvent = Gesture.Pan()
    .onStart(() => {
      // e.absoluteX
      if (disable) {
        return;
      }
      if (isScrubbing) {
        isScrubbing.value = true;
      }
      // ctx.isTriggedHaptic = false;
      if (panDirectionValue) {
        panDirectionValue.value = PanDirectionEnum.START;
        prevX.value = 0;
      }
      if (onSlidingStart) {
        runOnJS(onSlidingStart)();
      }
    })
    .onChange(({ x }) => {
      if (disable) {
        return;
      }
      if (panDirectionValue) {
        panDirectionValue.value =
          prevX.value - x > 0 ? PanDirectionEnum.LEFT : PanDirectionEnum.RIGHT;
        prevX.value = x;
      }
      bubbleOpacity.value = withSpring(1);
      onActiveSlider(x);
    })
    .onEnd(({ x }) => {
      if (disable) {
        return;
      }
      if (isScrubbing) {
        isScrubbing.value = true;
      }
      if (panDirectionValue) {
        panDirectionValue.value = PanDirectionEnum.END;
      }
      bubbleOpacity.value = withSpring(0);

      if (disableTrackFollow) {
        progress.value = xToProgress(x);
      }
      if (onSlidingComplete) {
        runOnJS(onSlidingComplete)(shareValueToSeconds());
      }
    });
  const onSingleTapEvent = Gesture.Tap().onEnd(({ x }, isFinished) => {
    if (onTap) {
      runOnJS(onTap)();
    }
    if (disable || disableTapEvent) {
      return;
    }
    if (isFinished) {
      onActiveSlider(x);
    }
    if (isScrubbing) {
      isScrubbing.value = true;
    }
    bubbleOpacity.value = withSpring(0);
    if (onSlidingComplete) {
      runOnJS(onSlidingComplete)(shareValueToSeconds());
    }
  });

  const gesture = Gesture.Race(onSingleTapEvent, onGestureEvent);

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
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[styles.view, { height: sliderHeight }, style]}
        hitSlop={panHitSlop}
        onLayout={onLayout}>
        <Animated.View
          style={StyleSheet.flatten([
            styles.slider,
            {
              height: sliderHeight,
              backgroundColor: _theme.maximumTrackTintColor,
            },
            containerStyle,
          ])}>
          <Animated.View
            style={[
              styles.cache,
              {
                backgroundColor: _theme.cacheTrackTintColor,
              },
              animatedCacheXStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.seek,
              {
                backgroundColor: disable
                  ? _theme.disableMinTrackTintColor
                  : _theme.minimumTrackTintColor,
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
                backgroundColor: _theme.minimumTrackTintColor,
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
              color={_theme.bubbleBackgroundColor}
              textColor={_theme.bubbleTextColor}
              textStyle={bubbleTextStyle}
              containerStyle={bubbleContainerStyle}
              bubbleMaxWidth={bubbleMaxWidth}
            />
          )}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
const styles = StyleSheet.create({
  slider: {
    width: '100%',
    overflow: 'hidden',
  },
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  thumb: {
    position: 'absolute',
    left: 0,
  },
  bubble: {
    position: 'absolute',
  },
});

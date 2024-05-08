import React, { FC, memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  Insets,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { WithTimingConfig } from 'react-native-reanimated';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Bubble, BubbleRef } from './ballon';
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
      /**
       * Color to fill the heartbeat animation in the seekbar
       */
      heartbeatColor?: string;
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
   * Render custom mark element. if you need to customize mark, you also need to set the `mark width`
   */
  renderMark?: ({ index }: { index: number }) => React.ReactNode;

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
  /**
   * withTiming options when step is defined. if false, no animation will be used. default false.
   */
  stepTimingOptions?: false | WithTimingConfig;
  markStyle?: StyleProp<ViewStyle>;
  markWidth?: number;
  onHapticFeedback?: () => void;
  hapticMode?: `${HapticModeEnum}`;
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
  testID?: string;
  snapToStep?: boolean;
  /**
   * Range along X axis (in points) where fingers travels without activation of
   * gesture. Moving outside of this range implies activation of gesture.
   *
   * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#activeoffsetxvalue-number--number
   */
  activeOffsetX?: number | number[];
  /**
   * Range along Y axis (in points) where fingers travels without activation of
   * gesture. Moving outside of this range implies activation of gesture.
   *
   * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#activeoffsetyvalue-number--number
   */
  activeOffsetY?: number | number[];
  /**
   * When the finger moves outside this range (in points) along X axis and
   * gesture hasn't yet activated it will fail recognizing the gesture. Range
   * can be given as an array or a single number.
   *
   * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#failoffsetyvalue-number--number
   */
  failOffsetX?: number | number[];
  /**
   * When the finger moves outside this range (in points) along Y axis and
   * gesture hasn't yet activated it will fail recognizing the gesture. Range
   * can be given as an array or a single number
   *
   * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#failoffsetxvalue-number--number
   */
  failOffsetY?: number | number[];
  /**
   * When 'heartbeat' is set to true, the progress bar color will animate back and forth between its current color and the color specified for the heartbeat.
   */
  heartbeat?: boolean;
};
const defaultTheme: SliderThemeType = {
  minimumTrackTintColor: palette.Main,
  maximumTrackTintColor: palette.Gray,
  cacheTrackTintColor: palette.DeepGray,
  bubbleBackgroundColor: palette.Main,
  bubbleTextColor: palette.White,
  heartbeatColor: palette.LightGray,
};
export const Slider: FC<AwesomeSliderProps> = memo(function Slider({
  bubble,
  bubbleContainerStyle,
  bubbleMaxWidth = 100,
  bubbleTextStyle,
  bubbleTranslateY = -25,
  bubbleWidth = 0,
  cache,
  containerStyle,
  disable = false,
  disableTapEvent = false,
  disableTrackFollow = false,
  hapticMode = 'none',
  isScrubbing,
  markStyle,
  markWidth = 4,
  maximumValue,
  minimumValue,
  onHapticFeedback,
  onSlidingComplete,
  onSlidingStart,
  onTap,
  onValueChange,
  panDirectionValue,
  panHitSlop = hitSlop,
  progress,
  renderBubble,
  renderThumb,
  renderMark,
  setBubbleText,
  sliderHeight = 5,
  step,
  stepTimingOptions = false,
  style,
  testID,
  theme,
  thumbScaleValue,
  thumbWidth = 15,
  snapToStep = true,
  activeOffsetX,
  activeOffsetY,
  failOffsetX,
  failOffsetY,
  heartbeat = false,
}) {
  const snappingEnabled = snapToStep && step;
  const bubbleRef = useRef<BubbleRef>(null);
  const isScrubbingInner = useSharedValue(false);
  const prevX = useSharedValue(0);
  const defaultThumbIndex = useMemo(() => {
    if (!snappingEnabled) {
      return 0;
    }
    const index = Math.round(
      ((progress.value - minimumValue.value) /
        (maximumValue.value - minimumValue.value)) *
        step
    );
    return clamp(index, 0, step);
  }, [
    maximumValue.value,
    minimumValue.value,
    progress.value,
    snappingEnabled,
    step,
  ]);
  const thumbIndex = useSharedValue(defaultThumbIndex);
  const [sliderWidth, setSliderWidth] = useState(0);
  const width = useSharedValue(0);
  const thumbValue = useSharedValue(0);
  const bubbleOpacity = useSharedValue(0);
  const markLeftArr = useSharedValue<number[]>([]);
  const isTriggedHaptic = useSharedValue(false);
  const _theme = {
    ...defaultTheme,
    ...theme,
  };

  const sliderTotalValue = useDerivedValue(() => {
    'worklet';
    return maximumValue.value - minimumValue.value;
  }, []);

  const progressToValue = (value: number) => {
    'worklet';
    if (sliderTotalValue.value === 0) {
      return 0;
    }
    return (
      ((value - minimumValue.value) / sliderTotalValue.value) *
      (width.value - thumbWidth)
    );
  };

  const animatedSeekStyle = useAnimatedStyle(() => {
    let seekWidth = 0;
    // when you set step
    if (snappingEnabled && markLeftArr.value.length >= step) {
      seekWidth = markLeftArr.value[thumbIndex.value]! + thumbWidth / 2;
    } else {
      seekWidth = progressToValue(progress.value) + thumbWidth / 2;
    }
    sliderTotalValue.value; // hack: force recompute styles when 'sliderTotalValue' changes

    return {
      width:
        snappingEnabled && stepTimingOptions
          ? withTiming(clamp(seekWidth, 0, width.value), stepTimingOptions)
          : clamp(seekWidth, 0, width.value),
    };
  }, [progress, minimumValue, maximumValue, width, markLeftArr]);

  const animatedThumbStyle = useAnimatedStyle(() => {
    let translateX = 0;
    // when you set step
    if (snappingEnabled && markLeftArr.value.length >= step) {
      translateX = stepTimingOptions
        ? withTiming(markLeftArr.value[thumbIndex.value]!, stepTimingOptions)
        : markLeftArr.value[thumbIndex.value]!;
    } else if (disableTrackFollow && isScrubbingInner.value) {
      translateX = clamp(
        thumbValue.value,
        0,
        width.value ? width.value - thumbWidth : 0
      );
    } else {
      translateX = clamp(
        progressToValue(progress.value),
        0,
        width.value ? width.value - thumbWidth : 0
      );
    }
    sliderTotalValue.value; // hack: force recompute styles when 'sliderTotalValue' change
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
    // when set step
    if (snappingEnabled && markLeftArr.value.length >= step) {
      translateX = markLeftArr.value[thumbIndex.value]! + thumbWidth / 2;
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
          translateX:
            snappingEnabled && stepTimingOptions
              ? withTiming(
                  clamp(
                    translateX,
                    bubbleWidth / 2,
                    width.value - bubbleWidth / 2
                  ),
                  stepTimingOptions
                )
              : clamp(
                  translateX,
                  bubbleWidth / 2,
                  width.value - bubbleWidth / 2
                ),
        },
        {
          scale: bubbleOpacity.value,
        },
      ],
    };
  });

  const animatedCacheXStyle = useAnimatedStyle(() => {
    const cacheX =
      cache?.value && sliderTotalValue.value
        ? (cache?.value / sliderTotalValue.value) * width.value
        : 0;

    return {
      width: cacheX,
    };
  });

  const animatedHeartbeatStyle = useAnimatedStyle(() => {
    // Goes to one and zero continuously
    const opacity = heartbeat
      ? withSequence(
          withTiming(1, { duration: 1000 }),
          withRepeat(
            withTiming(0, {
              duration: 1000,
            }),
            -1,
            true
          )
        )
      : withTiming(0, { duration: 500 });

    return {
      width: sliderWidth,
      opacity,
    };
  });

  const onSlideAcitve = useCallback(
    (seconds: number) => {
      const bubbleText = bubble ? bubble?.(seconds) : formatSeconds(seconds);
      onValueChange?.(seconds);

      setBubbleText
        ? setBubbleText(bubbleText)
        : bubbleRef.current?.setText(bubbleText);
    },
    [bubble, onValueChange, setBubbleText]
  );

  /**
   * convert Sharevalue to callback seconds
   * @returns number
   */
  const shareValueToSeconds = useCallback(() => {
    'worklet';
    if (snappingEnabled) {
      return clamp(
        minimumValue.value +
          (thumbIndex.value / step) * (maximumValue.value - minimumValue.value),
        minimumValue.value,
        maximumValue.value
      );
    } else {
      const sliderPercent = clamp(
        thumbValue.value / (width.value - thumbWidth),
        0,
        1
      );
      return (
        minimumValue.value +
        clamp(sliderPercent * sliderTotalValue.value, 0, sliderTotalValue.value)
      );
    }
  }, [
    maximumValue.value,
    minimumValue.value,
    sliderTotalValue.value,
    step,
    thumbIndex.value,
    thumbValue.value,
    thumbWidth,
    width.value,
    snappingEnabled,
  ]);
  /**
   * convert [x] position to progress
   * @returns number
   */
  const xToProgress = useCallback(
    (x: number): number => {
      'worklet';
      if (snappingEnabled && markLeftArr.value.length >= step) {
        return markLeftArr.value[thumbIndex.value]!;
      } else {
        return (
          minimumValue.value +
          (x / (width.value - thumbWidth)) * sliderTotalValue.value
        );
      }
    },
    [
      markLeftArr.value,
      sliderTotalValue.value,
      step,
      thumbIndex.value,
      thumbWidth,
      width.value,
      minimumValue.value,
      snappingEnabled,
    ]
  );

  /**
   * change slide value
   */
  const onActiveSlider = useCallback(
    (x: number) => {
      'worklet';
      isScrubbingInner.value = true;
      if (isScrubbing) {
        isScrubbing.value = true;
      }
      if (snappingEnabled) {
        const index = markLeftArr.value.findIndex((item) => item >= x);
        const arrNext = markLeftArr.value[index]!;
        const arrPrev = markLeftArr.value[index - 1]!;
        // Computing step boundaries
        const currentX = (arrNext + arrPrev) / 2;
        const thumbIndexPrev = thumbIndex.value;
        if (x - thumbWidth / 2 > currentX) {
          thumbIndex.value = index;
        } else {
          if (index - 1 === -1) {
            thumbIndex.value = 0;
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
    },
    [
      disableTrackFollow,
      hapticMode,
      isScrubbing,
      isScrubbingInner,
      isTriggedHaptic,
      markLeftArr.value,
      onHapticFeedback,
      onSlideAcitve,
      progress,
      shareValueToSeconds,
      step,
      thumbIndex,
      thumbValue,
      thumbWidth,
      width.value,
      xToProgress,
      snappingEnabled,
    ]
  );

  const onGestureEvent = useMemo(() => {
    const gesture = Gesture.Pan()
      .hitSlop(panHitSlop)
      .onStart(() => {
        if (disable) {
          return;
        }
        isScrubbingInner.value = false;
        if (isScrubbing) {
          isScrubbing.value = true;
        }

        if (panDirectionValue) {
          panDirectionValue.value = PanDirectionEnum.START;
          prevX.value = 0;
        }
        if (onSlidingStart) {
          runOnJS(onSlidingStart)();
        }
      })
      .onUpdate(({ x }) => {
        if (disable) {
          return;
        }
        if (panDirectionValue) {
          panDirectionValue.value =
            prevX.value - x > 0
              ? PanDirectionEnum.LEFT
              : PanDirectionEnum.RIGHT;
          prevX.value = x;
        }
        bubbleOpacity.value = withSpring(1);

        onActiveSlider(x);
      })
      .onEnd(({ x }) => {
        isScrubbingInner.value = false;
        if (disable) {
          return;
        }
        if (isScrubbing) {
          isScrubbing.value = false;
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

    if (activeOffsetX) {
      gesture.activeOffsetX(activeOffsetX);
    }

    if (activeOffsetY) {
      gesture.activeOffsetY(activeOffsetY);
    }

    if (failOffsetX) {
      gesture.failOffsetX(failOffsetX);
    }

    if (failOffsetY) {
      gesture.failOffsetY(failOffsetY);
    }

    return gesture;
  }, [
    activeOffsetX,
    activeOffsetY,
    bubbleOpacity,
    disable,
    disableTrackFollow,
    failOffsetX,
    failOffsetY,
    isScrubbing,
    isScrubbingInner,
    onActiveSlider,
    onSlidingComplete,
    onSlidingStart,
    panDirectionValue,
    panHitSlop,
    prevX,
    progress,
    shareValueToSeconds,
    xToProgress,
  ]);
  const onSingleTapEvent = useMemo(
    () =>
      Gesture.Tap()
        .hitSlop(panHitSlop)
        .onEnd(({ x }, isFinished) => {
          if (onTap) {
            runOnJS(onTap)();
          }
          if (disable || disableTapEvent) {
            return;
          }
          if (isFinished) {
            onActiveSlider(x);
          }
          isScrubbingInner.value = true;
          if (isScrubbing) {
            isScrubbing.value = true;
          }
          bubbleOpacity.value = withSpring(0);
          if (onSlidingComplete) {
            runOnJS(onSlidingComplete)(shareValueToSeconds());
          }
        }),
    [
      bubbleOpacity,
      disable,
      disableTapEvent,
      isScrubbing,
      isScrubbingInner,
      onActiveSlider,
      onSlidingComplete,
      onTap,
      panHitSlop,
      shareValueToSeconds,
    ]
  );

  const gesture = useMemo(
    () => Gesture.Race(onSingleTapEvent, onGestureEvent),
    [onGestureEvent, onSingleTapEvent]
  );

  // setting markLeftArr
  useAnimatedReaction(
    () => {
      if (snappingEnabled) {
        return new Array(step + 1).fill(0).map((_, i) => {
          return (
            Math.round(width.value * (i / step)) -
            (i / step) * markWidth -
            Math.round(thumbWidth / 3)
          );
        });
      }
      return [];
    },
    (data) => {
      markLeftArr.value = data;
    },
    [thumbWidth, markWidth, step, progress, width]
  );

  // setting thumbValue
  useAnimatedReaction(
    () => {
      if (isScrubbingInner.value) {
        return undefined;
      }
      if (snappingEnabled) {
        return undefined;
      }
      const currentValue =
        (progress.value / (minimumValue.value + maximumValue.value)) *
        (width.value - (disableTrackFollow ? thumbWidth : 0));
      return clamp(currentValue, 0, width.value - thumbWidth);
    },
    (data) => {
      if (data !== undefined && !isNaN(data)) {
        thumbValue.value = data;
      }
    },
    [thumbWidth, maximumValue, minimumValue, step, progress, width]
  );
  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const layoutWidth = nativeEvent.layout.width;
    width.value = layoutWidth;
    setSliderWidth(layoutWidth);
  };

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        testID={testID}
        style={[styles.view, { height: sliderHeight }, style]}
        hitSlop={panHitSlop}
        onLayout={onLayout}
      >
        <Animated.View
          style={StyleSheet.flatten([
            styles.slider,
            {
              height: sliderHeight,
              backgroundColor: _theme.maximumTrackTintColor,
            },
            containerStyle,
          ])}
        >
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
              styles.heartbeat,
              {
                backgroundColor: _theme.heartbeatColor,
              },
              animatedHeartbeatStyle,
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
        {sliderWidth > 0 && step
          ? new Array(step + 1).fill(0).map((_, i) => {
              const left = sliderWidth * (i / step) - (i / step) * markWidth;
              return renderMark ? (
                <View
                  key={i}
                  style={[
                    styles.customMarkContainer,
                    {
                      left,
                      width: markWidth,
                    },
                  ]}
                >
                  {renderMark({ index: i })}
                </View>
              ) : (
                <View
                  key={i}
                  style={[
                    styles.mark,
                    {
                      width: markWidth,
                      borderRadius: markWidth,
                      left,
                    },
                    markStyle,
                  ]}
                />
              );
            })
          : null}
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
          ]}
        >
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
});
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
  heartbeat: {
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
  customMarkContainer: {
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

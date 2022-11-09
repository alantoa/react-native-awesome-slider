import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  TextStyle,
  Image,
} from 'react-native';
import {
  HapticModeEnum,
  PanDirectionEnum,
  Slider,
} from 'react-native-awesome-slider';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Text } from '../components';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { palette } from '../../../src/theme/palette';
import LottieView from 'lottie-react-native';
import { useTheme } from '@react-navigation/native';
const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const TITLE: TextStyle = {
  marginBottom: 12,
};

export const Home = () => {
  const theme = useTheme();
  const [disable, setDisable] = useState(false);

  const progress1 = useSharedValue(30);
  const progress3 = useSharedValue(30);
  const progress5 = useSharedValue(30);
  const progress6 = useSharedValue(30);
  const progress7 = useSharedValue(20);
  const progress8 = useSharedValue(40);
  const progress9 = useSharedValue(30);

  const thumbScaleValue = useSharedValue(1);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  const cache = useSharedValue(0);
  const isScrubbing = useRef(false);
  const timer = useRef<any>(null);
  const min10 = useSharedValue(10);
  const max110 = useSharedValue(110);

  const thumbLottieValue = useSharedValue<PanDirectionEnum>(
    PanDirectionEnum.START,
  );

  useEffect(() => {
    return () => timer.current && clearTimeout(timer.current);
  }, []);
  const onSlidingComplete = (e: number) => {
    console.log('onSlidingComplete', e);
    isScrubbing.current = false;
  };
  const onSlidingStart = () => {
    console.log('onSlidingStart');
    isScrubbing.current = true;
  };
  const openTimer = () => {
    if (!timer.current) {
      timer.current = setInterval(() => {
        cache.value = cache.value + 1;
      }, 1000);
    }
  };
  const clearTimer = () => {
    timer.current = clearTimeout(timer.current);
  };

  const thumbAnimatedProps = useAnimatedProps(() => {
    let value = 0;
    if (thumbLottieValue.value === PanDirectionEnum.START) {
      value = 0.25;
    }
    if (thumbLottieValue.value === PanDirectionEnum.LEFT) {
      value = 0.0;
    }
    if (thumbLottieValue.value === PanDirectionEnum.RIGHT) {
      value = 0.5;
    }
    if (thumbLottieValue.value === PanDirectionEnum.END) {
      value = 0.25;
    }
    return {
      progress: withTiming(value, { duration: 600 }),
    };
  }, [thumbLottieValue.value]);
  return (
    <>
      <View style={[styles.full]}>
        <ScrollView
          style={styles.view}
          contentContainerStyle={styles.contentContainerStyle}>
          <StatusBar barStyle={'dark-content'} />
          <View
            style={[
              styles.card,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
              },
            ]}>
            <Text tx="Base" color={theme.colors.text} h3 style={TITLE} />
            <Slider
              style={styles.container}
              progress={progress1}
              onSlidingComplete={onSlidingComplete}
              onSlidingStart={onSlidingStart}
              minimumValue={min}
              maximumValue={max}
              disable={disable}
              cache={cache}
              thumbScaleValue={thumbScaleValue}
            />
            <View style={styles.control}>
              <TouchableOpacity
                onPress={() => {
                  setDisable(!disable);
                }}
                style={styles.btn}>
                <Text tx="disable" color={theme.colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  thumbScaleValue.value = thumbScaleValue.value === 0 ? 1 : 0;
                }}
                style={styles.btn}>
                <Text tx="toggle thumb scale" color={theme.colors.text} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  cache.value = 40;
                }}
                style={styles.btn}>
                <Text tx="show cache" color={theme.colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  cache.value = 0;
                }}
                style={styles.btn}>
                <Text tx="hide cache" color={theme.colors.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={openTimer} style={styles.btn}>
                <Text tx="🎬 cache" color={theme.colors.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={clearTimer} style={styles.btn}>
                <Text tx="🛑 cache" color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[
              styles.card,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
              },
            ]}>
            <Text
              tx="Light & Dark theme"
              color={theme.colors.text}
              h3
              style={TITLE}
            />
            <Slider
              style={styles.container}
              progress={progress1}
              onSlidingComplete={onSlidingComplete}
              onSlidingStart={onSlidingStart}
              minimumValue={min}
              maximumValue={max}
              disable={disable}
              cache={cache}
              thumbScaleValue={thumbScaleValue}
              theme={{
                minimumTrackTintColor: theme.colors.primary,
                maximumTrackTintColor: theme.colors.border,
                bubbleBackgroundColor: theme.colors.background,
                bubbleTextColor: theme.colors.text,
              }}
            />
          </View>
          <View
            style={[
              styles.card,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
              },
            ]}>
            <Text
              tx="Coustom bubble & thumb"
              color={theme.colors.text}
              h3
              style={TITLE}
            />

            <Slider
              progress={progress3}
              style={styles.slider}
              minimumValue={min}
              maximumValue={max}
              bubbleWidth={90}
              bubbleTranslateY={-50}
              renderThumb={() => <View style={styles.customThumb} />}
              renderBubble={() => (
                <View style={styles.customBubble}>
                  <Image
                    source={require('./preview.png')}
                    style={styles.bubbleImg}
                  />
                </View>
              )}
            />
          </View>
          <View
            style={[
              styles.card,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
              },
            ]}>
            <Text
              tx="Range & Haptic step-mode"
              color={theme.colors.text}
              h3
              style={TITLE}
            />
            <Slider
              progress={progress5}
              minimumValue={min10}
              style={styles.slider}
              maximumValue={max110}
              step={10}
              onHapticFeedback={() => {
                ReactNativeHapticFeedback.trigger('impactLight', {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                });
              }}
              sliderHeight={8}
              onSlidingComplete={e => {
                console.log(e);
              }}
              thumbWidth={24}
              hapticMode={HapticModeEnum.STEP}
            />
          </View>

          <View
            style={[
              styles.card,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
              },
            ]}>
            <Text
              tx="Haptic both-mode"
              color={theme.colors.text}
              h3
              style={TITLE}
            />
            <Slider
              progress={progress6}
              style={styles.slider}
              minimumValue={min10}
              maximumValue={max110}
              onHapticFeedback={() => {
                ReactNativeHapticFeedback.trigger('impactLight', {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                });
              }}
              hapticMode={HapticModeEnum.BOTH}
            />
          </View>
          <View
            style={[
              styles.card,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
              },
            ]}>
            <Text
              tx="Lottie thumb"
              color={theme.colors.text}
              h3
              style={TITLE}
            />
            <Slider
              progress={progress7}
              style={styles.slider}
              minimumValue={min10}
              maximumValue={max110}
              theme={{
                minimumTrackTintColor: '#fc8bab',
                maximumTrackTintColor: 'rgba(0,0,0,.1)',
              }}
              panDirectionValue={thumbLottieValue}
              renderBubble={() => null}
              containerStyle={styles.borderRadius}
              thumbWidth={60}
              renderThumb={() => (
                <View style={{ width: 60, height: 60, bottom: -4 }}>
                  <AnimatedLottieView
                    animatedProps={thumbAnimatedProps}
                    source={require('./rainbow.json')}
                  />
                </View>
              )}
            />
          </View>
          <View
            style={[
              styles.card,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
              },
            ]}>
            <Text
              tx="Disable track follow"
              color={theme.colors.text}
              h3
              style={TITLE}
            />
            <Slider
              progress={progress8}
              style={styles.slider}
              minimumValue={min}
              theme={{
                minimumTrackTintColor: '#fc8bab',
                maximumTrackTintColor: 'rgba(0,0,0,.1)',
              }}
              renderBubble={() => null}
              maximumValue={max}
              disableTapEvent
              disableTrackFollow
              hapticMode={HapticModeEnum.BOTH}
            />
          </View>
          <View
            style={[
              styles.card,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
              },
            ]}>
            <Text
              tx="Disable step snapping"
              color={theme.colors.text}
              h3
              style={TITLE}
            />
            <Slider
              step={10}
              theme={{
                bubbleBackgroundColor: '#0066FF',
                minimumTrackTintColor: '#0066FF',
                maximumTrackTintColor: '#173051',
              }}
              bubbleContainerStyle={{
                marginBottom: 24,
              }}
              onSlidingStart={() => {
                thumbScaleValue.value = 1.15;
              }}
              onSlidingComplete={() => {
                thumbScaleValue.value = 1;
              }}
              markWidth={4}
              renderMark={({ index, markWidth, steps, left }) => {
                if ([0, 2, 3, 5, 6, 7, 8, 9, steps].includes(index)) {
                  return <View key={index} />;
                }
                return (
                  <View
                    key={index}
                    style={{
                      width: markWidth,
                      height: 10,
                      backgroundColor: theme.colors.card,
                      left: left,
                      position: 'absolute',
                    }}
                  />
                );
              }}
              style={styles.slider}
              snapToStep={false}
              thumbWidth={26}
              progress={progress9}
              minimumValue={min}
              maximumValue={max}
              thumbScaleValue={thumbScaleValue}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 12,
    marginTop: 20,
  },
  full: {
    flex: 1,
  },
  header: {
    paddingBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: palette.Gray,
  },
  view: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  slider: {
    marginBottom: 20,
    marginTop: 12,
  },
  contentContainerStyle: {
    paddingBottom: 100,
  },
  container: {
    flex: 1,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  btn: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: palette.Info,
    marginRight: 12,
    marginTop: 12,
  },
  customThumb: {
    width: 20,
    height: 20,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: palette.Danger,
  },
  customBubble: {
    alignItems: 'center',
  },
  bubbleImg: {
    width: 90,
    borderRadius: 4,
    height: 60,
  },
  borderRadius: {
    borderRadius: 20,
  },
});

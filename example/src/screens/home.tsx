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
import { HapticModeEnum, Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';
import { Text } from '../components';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { palette } from '../../../src/theme/palette';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TEXT: TextStyle = {
  marginBottom: 12,
};
const Title = ({ tx }: { tx: string }) => <Text tx={tx} h3 style={TEXT} />;

export const Home = () => {
  const insets = useSafeAreaInsets();
  const [disable, setDisable] = useState(false);
  const progress1 = useSharedValue(30);
  const progress3 = useSharedValue(30);
  const progress5 = useSharedValue(30);
  const progress6 = useSharedValue(30);

  const thumbScaleValue = useSharedValue(1);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  const cache = useSharedValue(0);
  const isScrubbing = useRef(false);
  const timer = useRef<any>(null);
  const min10 = useSharedValue(10);
  const max110 = useSharedValue(110);

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
  return (
    <>
      <View style={styles.full}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Text tx={'React Native Awesome Slider'} h3 />
        </View>
        <ScrollView style={styles.view}>
          <StatusBar barStyle={'dark-content'} />
          <View style={styles.card}>
            <Title tx="Base" />
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
                <Text tx="disable" color="#D3DEDC" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  thumbScaleValue.value = thumbScaleValue.value === 0 ? 1 : 0;
                }}
                style={styles.btn}>
                <Text tx="toggle thumb scale" color="#D3DEDC" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  cache.value = 40;
                }}
                style={styles.btn}>
                <Text tx="show cache" color="#D3DEDC" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  cache.value = 0;
                }}
                style={styles.btn}>
                <Text tx="hide cache" color="#D3DEDC" />
              </TouchableOpacity>
              <TouchableOpacity onPress={openTimer} style={styles.btn}>
                <Text tx="🎬 cache" color="#D3DEDC" />
              </TouchableOpacity>
              <TouchableOpacity onPress={clearTimer} style={styles.btn}>
                <Text tx="🛑 cache" color="#D3DEDC" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <Title tx="Coustom bubble & thumb" />
            <Slider
              progress={progress3}
              style={styles.slider}
              minimumValue={min}
              maximumValue={max}
              bubbleTranslateY={-50}
              renderThumb={() => (
                <View style={styles.customThumb}>
                  <View style={styles.customThumb1} />
                  <View style={styles.customThumb2} />
                </View>
              )}
              renderBubble={() => (
                <View style={styles.customBubble}>
                  <Image
                    source={require('./ua.png')}
                    style={styles.bubbleImg}
                  />
                </View>
              )}
            />
          </View>
          <View style={styles.card}>
            <Title tx="Range & Haptic step-mode" />
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
              thumbWidth={24}
              hapticMode={HapticModeEnum.STEP}
            />
          </View>

          <View style={styles.card}>
            <Title tx="Haptic both-mode" />
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
        </ScrollView>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderColor: palette.G3,
    borderWidth: 0.5,
    padding: 12,
    marginTop: 20,
  },
  full: {
    flex: 1,
    backgroundColor: palette.G2,
  },
  header: {
    paddingBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: palette.G3,
  },
  view: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  slider: {
    marginBottom: 20,
    marginTop: 12,
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
    backgroundColor: palette.ACTIVE,
    marginRight: 12,
    marginTop: 12,
  },
  customThumb: {
    width: 20,
    height: 20,
    borderRadius: 4,
    overflow: 'hidden',
  },
  customThumb1: {
    backgroundColor: palette.ACTIVE,
    width: 20,
    height: 10,
  },
  customThumb2: {
    backgroundColor: palette.Main,
    width: 20,
    height: 10,
  },
  customBubble: {
    alignItems: 'center',
  },
  bubbleImg: {
    width: 90,
    borderRadius: 4,
    height: 60,
  },
  pause: {
    height: 40,
    left: 0,
    position: 'absolute',
    width: 40,
  },

  thumbStyle: {
    backgroundColor: '#fff',
    height: 8,
    width: 2,
  },

  timerText: {
    textAlign: 'right',
    width: 40,
  },

  trackStyle: { height: 2 },
});

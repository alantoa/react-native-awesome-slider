import { StyleSheet, Pressable, View, Text } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useRef, useState } from 'react';
import { COLORS } from './constants';
import { Switch } from './switch';
import dynamic from 'next/dynamic';
const Slider = dynamic(
  () => import('react-native-awesome-slider').then((mod) => mod.Slider),
  { ssr: false }
);
const bubbleWidth = 100;

export function PlayerControlBarExample() {
  const [disable, setDisable] = useState(false);
  const progress = useSharedValue(35);
  const thumbScaleValue = useSharedValue(1);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  const cache = useSharedValue(70);
  const timer = useRef<any>(null);
  const [timerText, setTimerText] = useState('Play');
  const [trackFollow, setTrackFollow] = useState(false);
  const toggleTimer = () => {
    if (!timer.current) {
      timer.current = setInterval(() => {
        cache.value = cache.value + 0.8;
        progress.value = progress.value + 0.2;
      }, 1000);
    } else {
      clearTimer();
    }
    setTimerText(timer.current ? 'Stop' : 'Play');
  };
  const clearTimer = () => {
    timer.current = clearTimeout(timer.current);
  };
  return (
    <View style={styles.full}>
      <Slider
        style={styles.slider}
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        disable={disable}
        cache={cache}
        thumbScaleValue={thumbScaleValue}
        theme={COLORS.sliderTheme}
        disableTrackFollow={trackFollow}
        bubbleWidth={bubbleWidth}
        bubbleTranslateY={-50}
        renderBubble={() => <View style={styles.customBubble}></View>}
        bubbleMaxWidth={bubbleWidth}
      />
      <View style={styles.control}>
        <View style={COLORS.optionStyle}>
          <Text style={COLORS.optionTextStyle}>Disable</Text>
          <Switch value={disable} onValueChange={setDisable} />
        </View>
        <View style={COLORS.optionStyle}>
          <Text style={COLORS.optionTextStyle}>Cache</Text>
          <Pressable onPress={toggleTimer} style={styles.btn}>
            <Text style={styles.btnText}>{timerText}</Text>
          </Pressable>
        </View>
        <View style={COLORS.optionStyle}>
          <Text style={COLORS.optionTextStyle}>Track Follow</Text>
          <Switch value={trackFollow} onValueChange={setTrackFollow} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
    zIndex: 2,
  },
  slider: {
    flex: 1,
    marginVertical: 16,
  },
  control: {
    paddingTop: 8,
  },
  btn: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.inputBackgroundColor,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  btnText: {
    color: COLORS.textColor,
  },
  customBubble: {
    alignItems: 'center',
    width: bubbleWidth,
    backgroundColor: COLORS.markColor,
    height: bubbleWidth * (9 / 16),
    zIndex: 1000,
    borderRadius: 4,
  },
});

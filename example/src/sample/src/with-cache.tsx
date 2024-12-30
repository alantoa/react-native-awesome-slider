import { Slider } from 'react-native-awesome-slider';
import { StyleSheet, View, Pressable } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Text, Switch } from '../../components';
import { useRef, useState } from 'react';
import { COLORS } from './constants';
import { SliderCard } from './components/slider-card';

export function WithCache() {
  const [disable, setDisable] = useState(false);
  const progress = useSharedValue(35);
  const thumbScaleValue = useSharedValue(1);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  const cache = useSharedValue(70);
  const timer = useRef<any>(null);
  const [timerText, setTimerText] = useState('Play');

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
    <SliderCard title="Cache Example">
      <Slider
        style={styles.container}
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        disable={disable}
        cache={cache}
        thumbScaleValue={thumbScaleValue}
        theme={COLORS.sliderTheme}
      />
      <View style={styles.control}>
        <View style={COLORS.optionStyle}>
          <Text style={COLORS.optionTextStyle} tx="disable" />
          <Switch value={disable} onValueChange={setDisable} />
        </View>
        <View style={COLORS.optionStyle}>
          <Text style={COLORS.optionTextStyle} tx="🎬 cache" />
          <Pressable onPress={toggleTimer} style={styles.btn}>
            <Text style={styles.btnText} tx={timerText} />
          </Pressable>
        </View>
      </View>
    </SliderCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

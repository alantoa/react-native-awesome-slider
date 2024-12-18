import { Slider } from 'react-native-awesome-slider';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Text } from '../../components';
import { useRef, useState } from 'react';
import { COLORS } from './constants';
import { SliderCard } from './components/slider-card';

export function WithCache() {
  const [disable, setDisable] = useState(false);
  const progress = useSharedValue(30);
  const thumbScaleValue = useSharedValue(1);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  const cache = useSharedValue(0);
  const timer = useRef<any>(null);

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
        <TouchableOpacity
          onPress={() => setDisable(!disable)}
          style={styles.btn}
        >
          <Text style={styles.btnText} tx="disable" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            cache.value = 40;
          }}
          style={styles.btn}
        >
          <Text style={styles.btnText} tx="show cache" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            cache.value = 0;
          }}
          style={styles.btn}
        >
          <Text style={styles.btnText} tx="hide cache" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openTimer} style={styles.btn}>
          <Text style={styles.btnText} tx="🎬 cache" />
        </TouchableOpacity>
        <TouchableOpacity onPress={clearTimer} style={styles.btn}>
          <Text style={styles.btnText} tx="🛑 cache" />
        </TouchableOpacity>
      </View>
    </SliderCard>
  );
}

const styles = StyleSheet.create({
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
    marginRight: 12,
    marginTop: 12,
    backgroundColor: COLORS.inputBackgroundColor,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  btnText: {
    color: COLORS.textColor,
  },
});

import { useRef, useState } from 'react';
import { Slider } from 'react-native-awesome-slider';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Text } from '../../components';

export function Basic() {
  const [disable, setDisable] = useState(false);
  const progress = useSharedValue(30);
  const thumbScaleValue = useSharedValue(1);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  const cache = useSharedValue(0);
  const isScrubbing = useRef(false);
  const timer = useRef<any>(null);

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
    <View style={styles.card}>
      <Text tx="Base" h3 style={styles.title} />
      <Slider
        style={styles.container}
        progress={progress}
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
          onPress={() => setDisable(!disable)}
          style={styles.btn}
        >
          <Text tx="disable" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            thumbScaleValue.value = thumbScaleValue.value === 0 ? 1 : 0;
          }}
          style={styles.btn}
        >
          <Text tx="toggle thumb scale" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            cache.value = 40;
          }}
          style={styles.btn}
        >
          <Text tx="show cache" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            cache.value = 0;
          }}
          style={styles.btn}
        >
          <Text tx="hide cache" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openTimer} style={styles.btn}>
          <Text tx="🎬 cache" />
        </TouchableOpacity>
        <TouchableOpacity onPress={clearTimer} style={styles.btn}>
          <Text tx="🛑 cache" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 12,
    marginTop: 20,
    shadowColor: '#000',
    backgroundColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    elevation: 1,
  },
  container: {
    flex: 1,
  },
  title: {
    marginBottom: 12,
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e2e2',
  },
});

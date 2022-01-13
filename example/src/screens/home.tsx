import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';
import { Text } from '../components';

const Title = ({ tx }: { tx: string }) => (
  <Text tx={tx} h2 style={{ marginTop: 20 }} />
);
export const Home = () => {
  const [disable, setDisable] = useState(false);
  const progress1 = useSharedValue(30);
  const progress2 = useSharedValue(30);
  const progress3 = useSharedValue(30);
  const progress4 = useSharedValue(30);
  const thumbScaleValue = useSharedValue(1);
  const min = useSharedValue(0);
  const max = useSharedValue(132);
  const cache = useSharedValue(40);
  const isScrubbing = useRef(false);
  const timer = useRef<any>(null);

  useEffect(() => {
    return () => timer.current && clearTimeout(timer.current);
  }, []);
  const onSlidingComplete = (e: number) => {
    // console.log('onSlidingComplete', e);
    isScrubbing.current = false;
  };
  const onSlidingStart = () => {
    console.log('onSlidingStart');
    isScrubbing.current = true;
  };
  const openTimer = () => {
    timer.current = setInterval(() => {
      progress2.value++;
      cache.value = cache.value + 1.5;
    }, 1000);
  };
  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#e1e1e1' }}>
        <ScrollView style={{ paddingHorizontal: 20, paddingVertical: 40 }}>
          <StatusBar barStyle={'dark-content'} />
          <Title tx="Base example" />
          <View style={styles.bottomControlGroup}>
            <Slider
              style={styles.container}
              progress={progress1}
              onSlidingComplete={onSlidingComplete}
              onSlidingStart={onSlidingStart}
              minimumValue={min}
              maximumValue={max}
              disable={disable}
            />

            <TouchableOpacity
              onPress={() => {
                setDisable(!disable);
              }}
              style={{ ...styles.btn, backgroundColor: '#7C99AC' }}>
              <Text tx="disable" color="#D3DEDC" />
            </TouchableOpacity>
          </View>

          <Title tx="Cache example" />
          <View style={styles.bottomControlGroup}>
            <Slider
              style={styles.container}
              progress={progress2}
              onSlidingComplete={onSlidingComplete}
              onSlidingStart={onSlidingStart}
              minimumValue={min}
              maximumValue={max}
              cache={cache}
              minimumTrackTintColor="#CE7BB0"
              cacheTrackTintColor="#FFBCD1"
            />

            <TouchableOpacity
              onPress={openTimer}
              style={{ ...styles.btn, backgroundColor: '#7C99AC' }}>
              <Text tx="increment+" color="#D3DEDC" />
            </TouchableOpacity>
          </View>

          <Title tx="Coustom bubble&thumb" />
          <Slider
            style={styles.container}
            progress={progress3}
            onSlidingComplete={onSlidingComplete}
            onSlidingStart={onSlidingStart}
            minimumValue={min}
            maximumValue={max}
            minimumTrackTintColor="#FFAB76"
            maximumTrackTintColor="#FFEEAD"
            renderThumb={() => (
              <View
                style={{ backgroundColor: '#FF6363', width: 20, height: 20 }}
              />
            )}
            renderBubble={() => (
              <View
                style={{
                  backgroundColor: '#CE7BB0',
                  alignItems: 'center',
                }}>
                <Text tx={`Hhha~`} color={'#fff'} t3 />
              </View>
            )}
          />
          <Title tx="Toggle thumb  example" />
          <View style={styles.bottomControlGroup}>
            <Slider
              style={styles.container}
              progress={progress4}
              onSlidingComplete={onSlidingComplete}
              onSlidingStart={onSlidingStart}
              minimumValue={min}
              maximumValue={max}
              thumbScaleValue={thumbScaleValue}
              renderBubble={() => <></>}
            />

            <TouchableOpacity
              onPress={() => {
                thumbScaleValue.value = thumbScaleValue.value === 0 ? 1 : 0;
              }}
              style={{ ...styles.btn, backgroundColor: '#7C99AC' }}>
              <Text tx="toggle thumb scale" color="#D3DEDC" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  bottomControlGroup: {
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20,
  },
  container: {
    flex: 1,
  },
  control: {
    padding: 16,
  },
  btn: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    marginLeft: 20,
    borderRadius: 8,
    paddingHorizontal: 12,
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

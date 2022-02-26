import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';
import { Text } from '../components';
const TEXT: TextStyle = {
  marginTop: 20,
};
const Title = ({ tx }: { tx: string }) => <Text tx={tx} h2 style={TEXT} />;
export const Home = () => {
  const [disable, setDisable] = useState(false);
  const progress1 = useSharedValue(30);
  const progress2 = useSharedValue(30);
  const progress3 = useSharedValue(30);
  const progress4 = useSharedValue(30);
  const progress5 = useSharedValue(30);

  const thumbScaleValue = useSharedValue(1);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  const cache = useSharedValue(40);
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
    timer.current = setInterval(() => {
      progress2.value++;
      cache.value = cache.value + 1.5;
    }, 1000);
  };
  return (
    <>
      <View style={styles.full}>
        <ScrollView style={styles.view}>
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
              style={styles.btn}>
              <Text tx="disable" color="#D3DEDC" />
            </TouchableOpacity>
          </View>

          <Title tx="Cache example" />
          <View style={styles.bottomControlGroup}>
            <Slider
              style={styles.container}
              progress={progress2}
              minimumValue={min}
              maximumValue={max}
              cache={cache}
              minimumTrackTintColor="#CE7BB0"
              cacheTrackTintColor="#FFBCD1"
            />

            <TouchableOpacity onPress={openTimer} style={styles.btn}>
              <Text tx="increment+" color="#D3DEDC" />
            </TouchableOpacity>
          </View>

          <Title tx="Coustom bubble&thumb" />
          <Slider
            style={styles.bottomControlGroup}
            progress={progress3}
            minimumValue={min}
            maximumValue={max}
            minimumTrackTintColor="#FFAB76"
            maximumTrackTintColor="#FFEEAD"
            renderThumb={() => <View style={styles.customThumb} />}
            renderBubble={() => (
              <View style={styles.customBubble}>
                <Text tx={'Hhha~'} color={'#fff'} t3 />
              </View>
            )}
          />
          <Title tx="Toggle thumb  example" />
          <View style={styles.bottomControlGroup}>
            <Slider
              style={styles.container}
              progress={progress4}
              minimumValue={min}
              maximumValue={max}
              thumbScaleValue={thumbScaleValue}
              renderBubble={() => <></>}
            />

            <TouchableOpacity
              onPress={() => {
                thumbScaleValue.value = thumbScaleValue.value === 0 ? 1 : 0;
              }}
              style={{ ...styles.btn }}>
              <Text tx="toggle thumb scale" color="#D3DEDC" />
            </TouchableOpacity>
          </View>

          <Title tx="Range" />
          <Slider
            style={styles.bottomControlGroup}
            progress={progress5}
            minimumValue={min10}
            maximumValue={max110}
            step={10}
            minimumTrackTintColor="#FFAB76"
            maximumTrackTintColor="#000"
          />
        </ScrollView>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  full: {
    flex: 1,
    backgroundColor: '#e1e1e1',
  },
  view: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
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
    backgroundColor: '#7C99AC',
  },
  customThumb: {
    backgroundColor: '#FF6363',
    width: 20,
    height: 20,
  },
  customBubble: {
    backgroundColor: '#CE7BB0',
    alignItems: 'center',
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

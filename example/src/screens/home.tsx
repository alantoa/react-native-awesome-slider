import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';
import type { RootParamList } from '../../App';
import { Text } from '../components';
export const Home = () => {
  const navigate = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const progress = useSharedValue(30);
  const min = useSharedValue(0);
  const max = useSharedValue(120);
  const cache = useSharedValue(80);
  const isScrubbing = useRef(false);

  useEffect(() => {
    // const timer = setInterval(() => {
    //   progress.value++;
    //   cache.value = cache.value + 1.5;
    // }, 1000);
    // return () => clearTimeout(timer);
  }, [isScrubbing.current]);
  const onSlidingComplete = (e: number) => {
    console.log('onSlidingComplete');
    isScrubbing.current = false;
  };
  const onSlidingStart = () => {
    console.log('onSlidingStart');
    isScrubbing.current = true;
  };
  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#e1e1e1' }}>
        <ScrollView style={{ paddingHorizontal: 20, paddingVertical: 40 }}>
          <StatusBar barStyle={'dark-content'} />
          <Text tx="simple example" h2 />
          <Slider
            style={styles.container}
            progress={progress}
            onSlidingComplete={onSlidingComplete}
            onSlidingStart={onSlidingStart}
            minimumValue={min}
            maximumValue={max}
          />
          <Text tx="video controls example" h2 style={{ marginTop: 20 }} />
          <View style={[styles.bottomControlGroup]}>
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: '#333',
                marginRight: 20,
              }}
            />
            <Slider
              style={styles.container}
              progress={progress}
              onSlidingComplete={onSlidingComplete}
              onSlidingStart={onSlidingStart}
              minimumValue={min}
              maximumValue={max}
            />
            <Text style={styles.timerText} color={'#333'} tx={`11:00`} t5 />

            <View style={{ ...styles.fullToggle, backgroundColor: '#333' }} />
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
    marginBottom: 0,
    marginLeft: 12,
    marginRight: 12,
    flexDirection: 'row',
    marginTop: 20,
  },
  container: {
    flex: 1,
  },
  control: {
    padding: 16,
  },
  fullToggle: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
    marginLeft: 20,
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

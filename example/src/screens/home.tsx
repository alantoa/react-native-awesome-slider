import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
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
    const timer = setInterval(() => {
      progress.value++;
      cache.value = cache.value + 1.5;
    }, 1000);
    return () => clearTimeout(timer);
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
          <View>
            <Text tx="Slider simple" h2 />
          </View>
          <Slider
            progress={progress}
            onSlidingComplete={onSlidingComplete}
            onSlidingStart={onSlidingStart}
            minimumValue={min}
            maximumValue={max}
            disable={false}
            cache={cache}
          />
        </ScrollView>
      </View>
    </>
  );
};

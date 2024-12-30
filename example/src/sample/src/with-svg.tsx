import { Slider, AwesomeSliderProps } from 'react-native-awesome-slider';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { runOnJS, useSharedValue } from 'react-native-reanimated';
import { Text } from '../../components';
import { COLORS } from './constants';
import { Sound } from './components/Sound';
import { ComponentProps, useCallback, useState } from 'react';

const sliderHeight = 24;

export function WithSvg() {
  const { width: windowWidth } = useWindowDimensions();
  const containerWidth = windowWidth - 32;
  const soundCount = Math.floor(containerWidth / sliderHeight);
  // const [bubbleText, setBubbleText] = useState('');
  const progress = useSharedValue(30);
  const min = useSharedValue(0);
  const max = useSharedValue(100);

  const renderSoundWaves = useCallback(
    (color?: string) => {
      return Array.from({ length: soundCount }).map((_, index) => (
        <Sound key={index} size={sliderHeight} color={color} />
      ));
    },
    [soundCount]
  );

  return (
    <View style={styles.card}>
      <Text tx="Wave Slider" h4 style={styles.title} />
      <Slider
        progress={progress}
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        theme={COLORS.sliderTheme}
        renderThumb={() => null}
        // setBubbleText={setBubbleText}
        sliderHeight={sliderHeight}
        renderContainer={useCallback(
          ({
            style,
            seekStyle,
          }: Parameters<
            NonNullable<AwesomeSliderProps['renderContainer']>
          >[0]) => (
            <View
              style={{
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <View
                style={[
                  style,
                  {
                    flexDirection: 'row',
                    backgroundColor: 'transparent',
                    justifyContent: 'space-between',
                  },
                ]}
              >
                {renderSoundWaves(COLORS.borderColor)}
              </View>
              <Animated.View
                style={[
                  seekStyle,
                  {
                    flexDirection: 'row',
                    overflow: 'hidden',
                    backgroundColor: 'transparent',
                    justifyContent: 'space-between',
                  },
                ]}
              >
                {renderSoundWaves(COLORS.markColor)}
              </Animated.View>
            </View>
          ),
          []
        )}
        bubble={useCallback((s: number) => {
          const minutes = Math.floor(s / 60);
          const seconds = Math.floor(s % 60);
          return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, [])}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: COLORS.cardStyle,
  title: {
    marginBottom: 12,
    color: COLORS.textColor,
  },
  slider: {
    marginBottom: 20,
    marginTop: 12,
  },
});

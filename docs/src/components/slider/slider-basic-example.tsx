import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { COLORS } from './constants';
import dynamic from 'next/dynamic';

const Slider = dynamic(
  () => import('react-native-awesome-slider').then((mod) => mod.Slider),
  { ssr: false }
);

const markWidth = 10;
const thumbWidth = markWidth + 4;

export function SliderBasicExample() {
  const progress = useSharedValue(100);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  const thumbScaleValue = useSharedValue(1);
  const isScrubbing = useSharedValue(false);

  return (
    <View style={styles.full}>
      <Slider
        // steps={step}
        thumbWidth={thumbWidth}
        sliderHeight={3}
        isScrubbing={isScrubbing}
        // disableTrackPress
        // thumbTouchSize={thumbWidth * 2}
        // forceSnapToStep={forceSnapToStep}
        onSlidingStart={() => {
          thumbScaleValue.value = 1.15;
        }}
        // disableTapEvent={true}
        onSlidingComplete={() => {
          thumbScaleValue.value = 1;
        }}
        // bubble={useCallback((s: number) => {
        //   return `${Math.round(s)}%`;
        // }, [])}
        // snapThreshold={snapThreshold}
        // snapThresholdMode="absolute"
        markWidth={markWidth}
        // renderMark={useCallback(
        //   ({ index }: { index: number }) => {
        //     return (
        //       <>
        //         <Mark key={index} />
        //         <MarkWithAnimatedView
        //           index={index}
        //           progress={progress}
        //           step={step}
        //         />
        //       </>
        //     );
        //   },
        //   [progress]
        // )}
        theme={COLORS.sliderTheme}
        style={styles.slider}
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        thumbScaleValue={thumbScaleValue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  full: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackgroundColor,
    height: 38,
    justifyContent: 'center',
    marginBottom: 12,
  },
  slider: {
    marginBottom: 20,
    marginTop: 12,
  },
  container: {
    flex: 1,
  },

  desc: {
    color: COLORS.descriptionColor,
  },
});

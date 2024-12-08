import { Slider, HapticModeEnum } from 'react-native-awesome-slider';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Text } from '../../components';
import * as Haptics from 'expo-haptics';

export function WithHaptic() {
  const progress = useSharedValue(30);
  const min = useSharedValue(10);
  const max = useSharedValue(110);

  return (
    <View style={styles.card}>
      <Text tx="Range & Haptic step-mode" h3 style={styles.title} />
      <Slider
        progress={progress}
        minimumValue={min}
        style={styles.slider}
        maximumValue={max}
        steps={10}
        onHapticFeedback={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }}
        forceSnapToStep
        sliderHeight={8}
        onSlidingComplete={(e) => {
          console.log(e);
        }}
        thumbWidth={24}
        hapticMode={HapticModeEnum.STEP}
      />
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
  title: {
    marginBottom: 12,
  },
  slider: {
    marginBottom: 20,
    marginTop: 12,
  },
});

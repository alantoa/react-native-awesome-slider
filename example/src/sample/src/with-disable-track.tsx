import { Slider, HapticModeEnum } from 'react-native-awesome-slider';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Text } from '../../components';

export function WithDisableTrack() {
  const progress = useSharedValue(40);
  const min = useSharedValue(0);
  const max = useSharedValue(100);

  return (
    <View style={styles.card}>
      <Text tx="Disable track follow" h3 style={styles.title} />
      <Slider
        progress={progress}
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        theme={{
          minimumTrackTintColor: '#fc8bab',
          maximumTrackTintColor: 'rgba(0,0,0,.1)',
        }}
        renderBubble={() => null}
        disableTapEvent
        disableTrackFollow
        hapticMode={HapticModeEnum.BOTH}
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

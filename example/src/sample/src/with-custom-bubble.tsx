import { Slider } from 'react-native-awesome-slider';
import { StyleSheet, View, Image } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Text } from '../../components';

export function WithCustomBubble() {
  const progress = useSharedValue(30);
  const min = useSharedValue(0);
  const max = useSharedValue(100);

  return (
    <View style={styles.card}>
      <Text tx="Custom bubble & thumb" h3 style={styles.title} />
      <Slider
        progress={progress}
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        bubbleWidth={90}
        bubbleTranslateY={-50}
        renderThumb={() => (
          <View style={styles.customThumb}>
            <Text tx="💰" h1 style={styles.title} />
          </View>
        )}
        renderBubble={() => (
          <View style={styles.customBubble}>
            <Image
              source={require('../../../assets/preview.png')}
              style={styles.bubbleImg}
            />
          </View>
        )}
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
  customThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
  },
  customBubble: {
    alignItems: 'center',
  },
  bubbleImg: {
    width: 90,
    borderRadius: 4,
    height: 60,
  },
});

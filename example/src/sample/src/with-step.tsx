import { Slider } from 'react-native-awesome-slider';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Text } from '../../components';

export function WithStep() {
  const progress = useSharedValue(30);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  const thumbScaleValue = useSharedValue(1);

  return (
    <View style={styles.card}>
      <Text tx="Disable step snapping" h3 style={styles.title} />
      <Slider
        steps={10}
        bubbleContainerStyle={{
          marginBottom: 24,
        }}
        onSlidingStart={() => {
          thumbScaleValue.value = 1.15;
        }}
        onSlidingComplete={() => {
          thumbScaleValue.value = 1;
        }}
        markWidth={4}
        // renderMark={({ index }) => {
        //   if ([0, 2, 3, 5, 6, 7, 8, 9, 10].includes(index)) {
        //     return <View key={index} />;
        //   }
        //   return (
        //     <View
        //       key={index}
        //       style={{
        //         width: 4,
        //         height: 10,
        //         backgroundColor: '#fff',
        //       }}
        //     />
        //   );
        // }}
        style={styles.slider}
        forceSnapToStep={false}
        thumbWidth={26}
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        thumbScaleValue={thumbScaleValue}
      />
      <Slider
        style={styles.container}
        containerStyle={{ borderRadius: 8 }}
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        renderBubble={() => null}
        onSlidingComplete={(e) => {
          console.log(e);
        }}
        sliderHeight={12}
        steps={20}
        forceSnapToStep={true}
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
  container: {
    flex: 1,
  },
});

import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Examples } from './sample';

import { COLORS } from './sample/src/constants';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.full}>
      <SafeAreaView style={styles.full}>
        <StatusBar barStyle="light-content" />
        <View style={styles.full}>
          <ScrollView
            style={styles.view}
            contentContainerStyle={styles.contentContainerStyle}
          >
            <Examples.Basic />
            <Examples.BinanceSlider />
            <Examples.WithStep />
            <Examples.WithCache />
            <Examples.WithHaptic />
            <Examples.WithLottie />
            <Examples.WithCustomBubble />
            <Examples.WithDisableTrack />
          </ScrollView>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
  },
  view: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  contentContainerStyle: {
    paddingBottom: 100,
  },
});

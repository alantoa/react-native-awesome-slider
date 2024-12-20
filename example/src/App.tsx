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
            centerContent
            contentContainerStyle={styles.contentContainerStyle}
          >
            <Examples.Basic />
            <Examples.BinanceSlider />
            <Examples.WithStep />
            <Examples.WithCache />
            <Examples.WithHaptic />
            <Examples.WithCustomBubble />
            <Examples.WithDisableTrack />
            <Examples.WithLottie />
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
    paddingHorizontal: 8,
  },
  view: {
    paddingBottom: 40,
    maxWidth: 800,
    marginHorizontal: 'auto',
    width: '100%',
  },
  contentContainerStyle: {
    paddingBottom: 100,
  },
});

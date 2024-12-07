import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Basic,
  WithCache,
  WithCustomBubble,
  WithHaptic,
  WithLottie,
  WithDisableTrack,
  WithStep,
} from './sample';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.full}>
      <SafeAreaView style={styles.full}>
        <View style={styles.full}>
          <ScrollView
            style={styles.view}
            contentContainerStyle={styles.contentContainerStyle}
          >
            <StatusBar barStyle={'dark-content'} />
            <Basic />
            <WithCache />
            <WithCustomBubble />
            <WithHaptic />
            <WithLottie />
            <WithDisableTrack />
            <WithStep />
          </ScrollView>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  view: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  contentContainerStyle: {
    paddingBottom: 100,
  },
});

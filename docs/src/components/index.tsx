// import { Slider } from 'react-native-awesome-slider';
// import { useSharedValue } from 'react-native-reanimated';
// import { Text, View } from 'react-native';
export const IndexPage = () => {
  // const progress = useSharedValue(30);
  // const min = useSharedValue(0);
  // const max = useSharedValue(100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100 via-red-100 to-cyan-100">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      {/* <View>
        <Text>1231</Text>
      </View> */}
      {/* <Slider progress={progress} minimumValue={min} maximumValue={max} /> */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
          React Native Awesome Slider
        </h1>
        <p className="text-md md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          A performant React Native slider built with Reanimated 2 and React
          Native Gesture Handler.
        </p>
        <a
          href="/docs"
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
        >
          Documentation
        </a>
      </div>
    </div>
  );
};

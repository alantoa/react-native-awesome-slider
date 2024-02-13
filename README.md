<div align="center">
  <h1 align="center">React Native Awesome Slider</h1>

[![Reanimated v2 version](https://img.shields.io/github/package-json/v/alantoa/react-native-awesome-slider/master?label=Reanimated%20v2&style=flat-square)](https://www.npmjs.com/package/react-native-awesome-slider) [![npm](https://img.shields.io/npm/l/react-native-awesome-slider?style=flat-square)](https://www.npmjs.com/package/react-native-awesome-slider) [![npm](https://img.shields.io/badge/types-included-blue?style=flat-square)](https://www.npmjs.com/package/react-native-awesome-slider) [![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/)

  <h3 align="center">An awesome React Native Slider component powered by Reanimated v2 and react-native-gesture-handler.</h3>
</div>

<div align="center">
  <img src="./assets/slider.gif" width="300" />
  <p><a href="https://twitter.com/alan_toa/status/1497531806740267009" >🔗 Watch video</a><p/>
  <br/>
</div>

## Installation

First you have to follow installation instructions of [Reanimated v2](https://docs.swmansion.com/react-native-reanimated/) and [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/)

If you react-native-gesture-handler version >= 2:

```sh
yarn add react-native-awesome-slider
```

else:

```sh
yarn add react-native-awesome-slider@1
```

## Example usage

Basic use:

```jsx
import { useSharedValue } from 'react-native-reanimated';
import { Slider } from 'react-native-awesome-slider';

export const Example = () => {
  const progress = useSharedValue(30);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  return (
    <Slider
      style={styles.container}
      progress={progress}
      minimumValue={min}
      maximumValue={max}
    />
  );
};
```

#### Change slider theme color?

Use the Theme object.

```jsx
<Slider
  theme={{
    disableMinTrackTintColor: '#fff',
    maximumTrackTintColor: '#fff',
    minimumTrackTintColor: '#000',
    cacheTrackTintColor: '#333',
    bubbleBackgroundColor: '#666',
    heartbeatColor: '#999',
  }}
/>
```

> For more usage, please view [Example](https://github.com/alantoa/react-native-awesome-slider/tree/main/example).

#### Add pan haptic feedback?

1. You need add haptics feedback lib to you project.

- [Expo](https://docs.expo.dev/versions/latest/sdk/haptics/)
- [NON-Expo](https://github.com/junina-de/react-native-haptic-feedback)

2. Add onHapticFeedback callback to you slider component.

```jsx
<Slider
  onHapticFeedback={() => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  }}
/>
```

3. Set haptic mode, if you open 'step' prop, you need set hapticMode=HapticModeEnum.STEP, otherwise set to hapticMode=HapticModeEnum.BOTH.

4. ✅ Finish!

## Why use this library?

- Pure javascript slider implementations usually rely on `react-native`'s gesture events which may inadvertently trigger 'swipe to go back' events as you pan the slider. ❌
- Native sliders rely on state updates, which can cause performance issues. ❌

`react-native-awesome-slider` relies on `reanimated`'s [ShareValue](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/shared-values) ability to run code directly in the `UIThread` to enhance performance, and `react-native-gesture-handle` won't interfere with your swiping gestures. ✨

## Features

- 100% written in `TypeScript`.
- 100% built upon `react-native-reanimated` and `react-native-gesture-handler`.
- Supports Tap & Pan triggering.
- Support for a discrete slider.
- Support haptic feedback.
- and more...

## TODO list

- ~~Support step props~~
- ~~Optimize bubble & thumb~~
- ~~Rewrite using `react-native-gesture-handler` v2~~
- ~~Support marks props~~
- Web Support

## Configuration

The `<Slider/>` component has the following configuration properties:

<table>
  <tr>
    <td>Name</td>
    <td>Type</td>
    <td>Description</td>
    <td>Required</td>
    <td>Default Value</td>
  </tr>
  <tr>
    <td>theme</td>
    <td>object</td>
    <td>The slider theme color</td>
    <td>❌</td>
    <td>
      {
        // Color to fill the progress in the seekbar
        minimumTrackTintColor: string,
        // Color to fill the background in the seekbar
        maximumTrackTintColor: string,
        // Color to fill the cache in the seekbar
        cacheTrackTintColor: string,
        // Color to fill the bubble backgrouundColor
        disableMinTrackTintColor: string,
        // Disabled color to fill the progress in the seekbar
        bubbleBackgroundColor: string
        // Color to fill the heartbeat animation in the seekbar
        heartbeatColor: string
      }
    </td>
  </tr>

  <tr>
    <td>style</td>
    <td>ViewStyle</td>
    <td></td>
    <td>❌</td>
    <td></td>
  </tr>
  <tr>
    <td>borderColor</td>
    <td>string</td>
    <td>Color of the border of the slider, also you can use containerStyle .</td>
    <td>❌</td>
    <td>transparent</td>
  </tr>
  <tr>
    <td>bubble</td>
    <td>(number) =&gt; string</td>
    <td>Get the current value of the slider as you slide it, and returns a string to be used inside the bubble.</td>
    <td>❌</td>
    <td>(number) =&gt; string</td>
  </tr>
  <tr>
    <td>progress</td>
    <td>Animated.SharedValue&lt;number&gt;</td>
    <td>Current value of the slider</td>
    <td>✅</td>
    <td>0</td>
  </tr>
  <tr>
    <td>cache</td>
    <td>Animated.SharedValue&lt;number&gt;</td>
    <td>Cache value of the slider</td>
    <td>❌</td>
    <td>0</td>
  </tr>
  <tr>
    <td>minimumValue</td>
    <td>Animated.SharedValue&lt;number&gt;</td>
    <td>An Animated.SharedValue from react-native-reanimated library which is the minimum value of the slider.</td>
    <td>✅</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>maximumValue</td>
    <td>Animated.SharedValue&lt;number&gt;</td>
    <td>An Animated.SharedValue from react-native-reanimated library which is the maximum value of the slider.</td>
    <td>✅</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>onSlidingStart</td>
    <td>() =&gt; void</td>
    <td>Callback called when the sliding interaction starts</td>
    <td>❌</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>onValueChange</td>
    <td>(number) =&gt; void</td>
    <td>Callback called when the slider value changes</td>
    <td>❌</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>onSlidingComplete</td>
    <td>(number) =&gt; void</td>
    <td>Callback called when the sliding interaction stops. The updated slider value will be passed as argument</td>
    <td>❌</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>renderBubble</td>
    <td>() =&gt; React.ReactNode</td>
    <td>A custom bubble component that will be rendered while sliding.</td>
    <td>❌</td>
    <td>See the &lt;Bubble/&gt; component</td>
  </tr>
  <tr>
    <td>setBubbleText</td>
    <td>(string) =&gt; void</td>
    <td>This function will be called while sliding and can be used to update the text in a custom bubble component.</td>
    <td>❌</td>
    <td>current slider value</td>
  </tr>
  <tr>
    <td>bubbleTranslateY</td>
    <td>number</td>
    <td>Value to pass to the container of the bubble as translateY</td>
    <td>❌</td>
    <td>7</td>
  </tr>
  <tr>
    <td>renderThumb</td>
    <td>() =&gt; React.ReactNode</td>
    <td>Render custom thumb image. If you need to customize thumb, you also need to set the thumb width</td>
    <td>❌</td>
    <td>ReactNode</td>
  </tr>
  <tr>
    <td>renderMark</td>
    <td>({ index }: { index: number }) =&gt; React.ReactNode</td>
    <td>Render custom mark element. If you need to customize mark, you also need to set the mark width</td>
    <td>❌</td>
    <td>ReactNode</td>
  </tr>
  <tr>
    <td>thumbWidth</td>
    <td>number</td>
    <td>Thumb elements width</td>
    <td>❌</td>
    <td>15</td>
  </tr>
  <tr>
    <td>disable</td>
    <td>boolean</td>
    <td>Disable user interaction with the slider</td>
    <td>❌</td>
    <td>false</td>
  </tr>

  <tr>
    <td>disableTapEvent</td>
    <td>boolean</td>
    <td>Enable tap event change value. Defaults to `true`</td>
    <td>❌</td>
    <td>true</td>
  </tr>
  <tr>
    <td>bubbleMaxWidth</td>
    <td>number</td>
    <td>The maximum width of the bubble component</td>
    <td>❌</td>
    <td>100</td>
  </tr>
  <tr>
    <td>bubbleTextStyle</td>
    <td>TextStyle</td>
    <td>Bubble text style</td>
    <td>❌</td>
    <td></td>
  </tr>
  <tr>
    <td>bubbleContainerStyle</td>
    <td>ViewStyle</td>
    <td>Bubble container text style</td>
    <td>❌</td>
    <td></td>
  </tr>
  <tr>
    <td>isScrubbing</td>
    <td>Animated.SharedValue&lt;boolean&gt;</td>
    <td>callback slider is scrubbing status</td>
    <td>❌</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>onTap</td>
    <td>() =&gt; void</td>
    <td>A callback for when the slider is tapped.(Useful for video-player scrubbing.)</td>
    <td>❌</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>thumbScaleValue</td>
    <td>Animated.SharedValue&lt;number&gt;</td>
    <td>Control thumb’s transform-scale animation.</td>
    <td>❌</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>sliderHeight</td>
    <td>number</td>
    <td>The height of the slider component</td>
    <td>❌</td>
    <td>30</td>
  </tr>
  <tr>
    <td>containerStyle</td>
    <td>ViewStyle</td>
    <td>styles to be applied to the slider container component</td>
    <td>❌</td>
    <td>{ width: '100%', height: 5, borderRadius: 2, borderColor: borderColor, overflow: 'hidden', borderWidth: 1,
      backgroundColor: maximumTrackTintColor, },</td>
  </tr>
  <tr>
    <td>panHitSlop</td>
    <td>object</td>
    <td>pan gesture hit slop</td>
    <td>❌</td>
    <td>`{ top: 8, left: 0, bottom: 8, right: 0,} `</td>
  </tr>
  <tr>
    <td>step</td>
    <td>number</td>
    <td>Step value of the slider. The value should be between 0 and maximumValue - minimumValue)</td>
    <td>❌</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>snapToStep</td>
    <td>boolean</td>
    <td>Enables or disables step snapping</td>
    <td>❌</td>
    <td>true</td>
  </tr>
  <tr>
    <td>markWidth</td>
    <td>number</td>
    <td>Step mark width, if you need custom mark style, you must be fix this width</td>
    <td>❌</td>
    <td>4</td>
  </tr>
  <tr>
    <td>marksStyle</td>
    <td>ViewStyle</td>
    <td>Step mark style</td>
    <td>❌</td>
    <td>{width: {markWidth}, height: 4, backgroundColor: '#fff', position: 'absolute', top: 2}</td>
  </tr>
  <tr>
    <td>onHapticFeedback</td>
    <td>function</td>
    <td>Haptic feedback callback</td>
    <td>❌</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>hapticMode</td>
    <td>enum</td>
    <td>haptic feedback mode</td>
    <td>❌</td>
    <td>HapticModeEnum.NONE</td>
  </tr>

  <tr>
    <td>panDirectionValue</td>
    <td>enum</td>
    <td>Current swipe direction</td>
    <td>❌</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>disableTrackFollow</td>
    <td>boolean</td>
    <td>Disable track follow thumb.(Commonly used in video audio players)</td>
    <td>❌</td>
    <td>false</td>
  </tr>
  <tr>
    <td>bubbleWidth</td>
    <td>number</td>
    <td>Bubble width, If you set this value, bubble positioning left & right will be clamp.</td>
    <td>❌</td>
    <td>0</td>
  </tr>
  <tr>
    <td>activeOffsetX</td>
    <td>number | number[]</td>
    <td>Range along X axis (in points) where fingers travels without activation of gesture. Moving outside of this range implies activation of gesture.</td>
    <td>❌</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>activeOffsetY</td>
    <td>number | number[]</td>
    <td>Range along Y axis (in points) where fingers travels without activation of gesture. Moving outside of this range implies activation of gesture.</td>
    <td>❌</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>failOffsetX</td>
    <td>number | number[]</td>
    <td>When the finger moves outside this range (in points) along X axis and gesture hasn't yet activated it will fail recognizing the gesture. Range can be given as an array or a single number</td>
    <td>❌</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>failOffsetY</td>
    <td>number | number[]</td>
    <td>When the finger moves outside this range (in points) along Y axis and gesture hasn't yet activated it will fail recognizing the gesture. Range can be given as an array or a single number</td>
    <td>❌</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>heartbeat</td>
    <td>boolean</td>
    <td>When 'heartbeat' is set to true, the progress bar color will animate back and forth between its current color and the color specified for the heartbeat. useful for loading state</td>
    <td>❌</td>
    <td>undefined</td>
  </tr>
</table>

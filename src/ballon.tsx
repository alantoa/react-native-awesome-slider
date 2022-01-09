import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { TextInput, TextStyle, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { palette } from './theme/palette';

const BUBBLE_STYLE: ViewStyle = {
  padding: 2,
  paddingHorizontal: 4,
  borderRadius: 5,
};

export type BubbleProps = {
  /**
   * background color of the bubble
   */
  color?: string;

  /**
   * the style for the container view
   */
  containerStyle?: ViewStyle;

  /**
   * the style for the TextInput inside bubble
   */
  textStyle?: TextStyle;

  bubbleMaxWidth?: number;
};
/**
 * a component to show text inside a bubble
 */
export type BubbleRef = {
  setText: (text: string) => void;
};
export const Bubble = forwardRef<BubbleRef, BubbleProps>(
  (
    { containerStyle, color = palette.Main(1), textStyle, bubbleMaxWidth },
    ref,
  ) => {
    const textRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      setText: (text: string) => {
        textRef.current?.setNativeProps({ text });
      },
    }));
    return (
      <Animated.View style={[containerStyle, { alignItems: 'center' }]}>
        <Animated.View
          style={{
            ...BUBBLE_STYLE,
            backgroundColor: color,
            maxWidth: bubbleMaxWidth,
          }}>
          <TextInput
            ref={textRef}
            style={[{ color: palette.W(1), fontSize: 12 }, textStyle]}
          />
        </Animated.View>
        <View
          style={{
            width: 10,
            height: 10,
            borderWidth: 5,
            borderColor: 'transparent',
            borderTopColor: color,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}
        />
      </Animated.View>
    );
  },
);

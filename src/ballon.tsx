import React, { useImperativeHandle, useRef, memo, useState } from 'react';
import {
  StyleProp,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
  StyleSheet,
  Platform,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { palette } from './theme/palette';
import { Text } from 'react-native';

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
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * the style for the TextInput inside bubble
   */
  textStyle?: StyleProp<TextStyle>;
  textColor?: string;
  bubbleMaxWidth?: number;
};
/**
 * a component to show text inside a bubble
 */
export type BubbleRef = {
  setText: (text: string) => void;
};
export const BubbleComponent = React.forwardRef<BubbleRef, BubbleProps>(
  (
    {
      containerStyle,
      color = palette.Main,
      textStyle,
      textColor = palette.White,
      bubbleMaxWidth,
    },
    ref
  ) => {
    const textRef = useRef<TextInput>(null);
    const [inputValue, setInputValue] = useState('');

    useImperativeHandle(ref, () => ({
      setText: (text: string) => {
        if (Platform.OS === 'web') {
          setInputValue(text);
        } else {
          textRef.current?.setNativeProps({ text });
        }
      },
    }));
    return (
      <Animated.View style={[styles.view, containerStyle]}>
        <Animated.View
          style={{
            ...BUBBLE_STYLE,
            backgroundColor: color,
            maxWidth: bubbleMaxWidth,
          }}
        >
          {Platform.OS !== 'web' ? (
            <TextInput
              ref={textRef}
              textAlign="center"
              style={[styles.textStyle, { color: textColor }, textStyle]}
              caretHidden
              defaultValue=""
              editable={false}
            />
          ) : (
            <Text style={[styles.textStyle, { color: textColor }, textStyle]}>
              {inputValue}
            </Text>
          )}
        </Animated.View>
        <View
          style={[
            styles.triangle,
            {
              borderTopColor: color,
            },
          ]}
        />
      </Animated.View>
    );
  }
);
export const Bubble = memo(BubbleComponent);
const styles = StyleSheet.create({
  triangle: {
    width: 10,
    height: 10,
    borderWidth: 5,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  textStyle: {
    fontSize: 12,
    paddingVertical: 0,
  },
  view: {
    alignItems: 'center',
  },
});

import React from 'react';
import {
  Platform,
  StyleSheet,
  Text as NativeText,
  TextProps,
} from 'react-native';
import { palette } from '../../../src/theme/palette';
const normalize = (size: number) => size;
export interface _TextProps extends TextProps {
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  t1?: boolean;
  t2?: boolean;
  tBold?: boolean;
  t3?: boolean;
  t4?: boolean;
  t5?: boolean;
  color?: string;
  verticalCenter?: boolean;
  tx?: string;
  isCenter?: boolean;
  paragraph?: boolean;
}
export const Text = React.forwardRef<NativeText, _TextProps>(function Text(
  {
    style = {},
    h1 = false,
    h2 = false,
    h3 = false,
    h4 = false,
    h5 = false,
    t1 = false,
    t2 = false,
    tBold = false,
    t3 = false,
    t4 = false,
    t5 = false,
    children = '',
    tx = '',
    verticalCenter = false,
    color = palette.G7,
    isCenter,
    paragraph,
    ...rest
  },
  ref,
) {
  return (
    <NativeText
      ref={ref}
      style={StyleSheet.flatten([
        styles.text,
        { color },
        isCenter && styles.textCenter,

        (t1 || t2 || t3 || t4 || t5) && tBold && styles.enTBold,
        h1 &&
          StyleSheet.flatten([
            { fontSize: normalize(28) },
            !verticalCenter && { lineHeight: normalize(36) },
            styles.h1,
          ]),
        h2 &&
          StyleSheet.flatten([
            { fontSize: normalize(24) },
            !verticalCenter && { lineHeight: normalize(32) },
            styles.h2,
          ]),
        h3 &&
          StyleSheet.flatten([
            { fontSize: normalize(18) },
            !verticalCenter && { lineHeight: normalize(28) },
            styles.h3,
          ]),
        h4 &&
          StyleSheet.flatten([
            { fontSize: normalize(16) },
            !verticalCenter && { lineHeight: normalize(24) },
            styles.h4,
          ]),
        h5 &&
          StyleSheet.flatten([
            { fontSize: normalize(14) },
            !verticalCenter && { lineHeight: normalize(20) },
            styles.h5,
          ]),
        t1 &&
          StyleSheet.flatten([
            { fontSize: normalize(14) },
            !verticalCenter && { lineHeight: normalize(20) },
          ]),
        t2 &&
          StyleSheet.flatten([
            { fontSize: normalize(13) },
            !verticalCenter && { lineHeight: normalize(18) },
          ]),
        t3 &&
          StyleSheet.flatten([
            { fontSize: normalize(12) },
            !verticalCenter && { lineHeight: normalize(16) },
          ]),
        t4 &&
          StyleSheet.flatten([
            { fontSize: normalize(11) },
            !verticalCenter && { lineHeight: normalize(16) },
          ]),
        t5 &&
          StyleSheet.flatten([
            { fontSize: normalize(10) },
            !verticalCenter && { lineHeight: normalize(14) },
          ]),
        paragraph &&
          StyleSheet.flatten([
            { fontSize: normalize(14), lineHeight: normalize(24) },
          ]),
        style,
      ])}
      {...rest}>
      {tx || children}
    </NativeText>
  );
});
const bold = Platform.OS === 'ios' ? '600' : 'bold';

const styles = StyleSheet.create({
  d1: {},
  d2: {},
  enTBold: {
    fontWeight: bold,
  },
  h1: {
    fontWeight: bold,
  },
  h2: {
    fontWeight: bold,
  },
  h3: { fontWeight: bold },
  h4: { fontWeight: bold },
  h5: { fontWeight: bold },

  text: {
    fontSize: normalize(14),
  },
  textCenter: {
    alignSelf: 'center',
  },
});

Text.displayName = 'Text';

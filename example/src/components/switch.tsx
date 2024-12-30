import { Switch as NativeSwitch, SwitchProps } from 'react-native';
import { COLORS } from '../sample/src/constants';

export function Switch(props: SwitchProps) {
  return (
    <NativeSwitch
      trackColor={{
        false: COLORS.borderColor,
        true: COLORS.bubbleBackgroundColor,
      }}
      thumbColor={COLORS.markColor}
      // @ts-ignore
      activeThumbColor={COLORS.markColor}
      {...props}
    />
  );
}

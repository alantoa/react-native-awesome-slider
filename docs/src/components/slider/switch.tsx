import { Switch as NativeSwitch, SwitchProps } from 'react-native';
import { COLORS } from './constants';

export function Switch(props: SwitchProps) {
  return (
    <NativeSwitch
      trackColor={{
        false: COLORS.inputBackgroundColor,
        true: COLORS.markColor,
      }}
      thumbColor={COLORS.markColor}
      // @ts-ignore
      activeThumbColor={COLORS.markColor}
      {...props}
    />
  );
}

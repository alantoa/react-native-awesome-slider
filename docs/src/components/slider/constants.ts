import { TextStyle } from 'react-native';
import { SliderThemeType } from 'react-native-awesome-slider';

export const COLORS = {
  backgroundColor: '#111111',
  inputBackgroundColor: '#1A1A1A',

  borderColor: '#222222',
  markColor: '#FFFFFF',
  textColor: '#FFFFFF',
  descriptionColor: '#888888',

  optionStyle: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 12,
  },

  optionTextStyle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  } satisfies TextStyle,

  sliderTheme: {
    maximumTrackTintColor: '#222222',
    minimumTrackTintColor: '#FFFFFF',

    bubbleBackgroundColor: '#1A1A1A',
    bubbleTextColor: '#FFFFFF',
  } satisfies SliderThemeType,
};

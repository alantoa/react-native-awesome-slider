import { TextStyle, ViewStyle } from 'react-native';
import { SliderThemeType } from 'react-native-awesome-slider';

export const COLORS = {
  backgroundColor: '#0A0A0A',
  inputBackgroundColor: '#1f1f1f',

  borderColor: '#474747',
  markColor: '#EAECEF',

  bubbleBackgroundColor: '#E0E2E5',
  bubbleTextColor: '#262C36',

  textColor: '#EAECEF',
  descriptionColor: '#E0E2E5',
  cardStyle: {
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#292929',
    gap: 8,
    backgroundColor: '#0a0a0a',
  } satisfies ViewStyle,

  optionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 38,
  } satisfies ViewStyle,
  optionTextStyle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EAECEF',
  } satisfies TextStyle,
  sliderTheme: {
    maximumTrackTintColor: '#292929',
    minimumTrackTintColor: '#EAECEF',
    bubbleBackgroundColor: '#E0E2E5',
    bubbleTextColor: '#262C36',
    cacheTrackTintColor: 'rgba(189, 186, 186, 0.6)',
  } satisfies SliderThemeType,
};

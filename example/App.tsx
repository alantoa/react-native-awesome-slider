/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useColorScheme } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Home } from './src/screens';

export type RootParamList = {
  Example: undefined;
};
const Stack = createNativeStackNavigator<RootParamList>();

const App = gestureHandlerRootHOC(() => {
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Example"
          options={{
            title: 'React Native Awesome Slider',
          }}
          component={Home}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
});
export default App;

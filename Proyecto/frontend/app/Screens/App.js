// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CurrentTrip from './screens/CurrentTrip';
import DriverInfo from './screens/DriverInfo';
import ChatScreen from './screens/ChatScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CurrentTrip" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CurrentTrip" component={CurrentTrip} />
        <Stack.Screen name="DriverInfo" component={DriverInfo} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
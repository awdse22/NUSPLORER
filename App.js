import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthenticationScreen from './screens/AuthenticationScreen';
import OutdoorMap from './screens/OutdoorMap';
import IndoorMap from './screens/IndoorMap';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Authentication' screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Authentication' 
            component={AuthenticationScreen} />
          <Stack.Screen name='OutdoorMap' component={OutdoorMap} />
      </Stack.Navigator>
    </NavigationContainer>   
  );
}
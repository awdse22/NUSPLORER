import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AuthenticationScreen from './screens/AuthenticationScreen';
import OutdoorMap from "./screens/OutdoorMap";
import NavigationScreen from './screens/NavigationScreen';
import Bookmarks from './screens/Bookmarks';
import TimetableScreen from './screens/TimeTableScreen';
import SettingsScreen from './screens/SettingsScreen';

import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const MainTab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <MainTab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          height: 80
        },
        tabBarLabelStyle: {
          padding: 5,
          fontSize: 12
        }
      }}>
      <MainTab.Screen 
        name='Map' 
        component={OutdoorMap}
        options={{
          tabBarIcon: () => <FontAwesome name="map" size={40} color="black" />
        }} />
      <MainTab.Screen 
        name='Navigation' 
        component={NavigationScreen}
        options={{
          tabBarIcon: () => <FontAwesome5 name="route" size={42} color="black" />
        }} />
      <MainTab.Screen 
        name='Bookmarks' 
        component={Bookmarks} 
        options={{
          tabBarIcon: () => <FontAwesome name="bookmark" size={45} color="black" />
        }} />
      <MainTab.Screen 
        name='Timetable' 
        component={TimetableScreen}
        options={{
          tabBarIcon: () => <FontAwesome name="calendar" size={40} color="black" />
        }} />
      <MainTab.Screen 
        name='SettingsScreen' 
        component={SettingsScreen}
        options={{
          tabBarIcon: () => <MaterialIcons name="settings" size={48} color="black" />
        }} />
    </MainTab.Navigator> 
  )
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Authentication' screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Authentication' component={AuthenticationScreen} />
          <Stack.Screen name='MainInterface' component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>   
  );
}
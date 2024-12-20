import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./screens/UnauthenticatedScreens/LoginScreen";
import RegisterAccount from "./screens/UnauthenticatedScreens/RegisterAccount";
import OutdoorMap from "./screens/OutdoorMap/Map";
import NavigationScreen from "./screens/NavigationScreen";
import Bookmarks from "./screens/Bookmarks";

import { FontAwesome, FontAwesome5, FontAwesome6 ,MaterialIcons } from "@expo/vector-icons";
import ForgotPassword from "./screens/UnauthenticatedScreens/ForgotPassword";
import EmailConfirmation from "./screens/UnauthenticatedScreens/EmailConfirmation";
import SettingsNavigator from "./screens/Settings/SettingsNavigator";
import AccountCreated from "./screens/UnauthenticatedScreens/AccountCreated";
import IndoorForumNavigator from "./screens/IndoorForum/IndoorForumNavigator";

const Stack = createStackNavigator();
const MainTab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 100,
        },
        tabBarLabelStyle: {
          padding: 5,
          fontSize: 12,
        },
      }}
    >
      <MainTab.Screen
        name="Map"
        component={OutdoorMap}
        options={{
          tabBarIcon: (props) => <FontAwesome name="map" {...props} />,
        }}
      />
      <MainTab.Screen
        name="Navigation"
        component={NavigationScreen}
        options={{
          tabBarIcon: (props) => <FontAwesome5 name="route" {...props} />,
        }}
      />
      <MainTab.Screen
        name="Indoor"
        component={IndoorForumNavigator}
        options={{
          tabBarIcon: (props) => <FontAwesome6 name="building-user" {...props} />,
        }}
      />
      <MainTab.Screen
        name="Bookmarks"
        component={Bookmarks}
        options={{
          tabBarIcon: (props) => <FontAwesome name="bookmark" {...props} />,
          headerShown: true
        }}
      />
      <MainTab.Screen
        name="SettingsScreen"
        label="Settings"
        component={SettingsNavigator}
        options={{
          tabBarIcon: (props) => <MaterialIcons name="settings" {...props} />,
        }}
      />
    </MainTab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Account Registration" component={RegisterAccount} />
        <Stack.Screen name="Email Confirmation" component={EmailConfirmation} />
        <Stack.Screen 
          name="Account Created" 
          component={AccountCreated}
          options={{
            headerLeft: null
          }}
        />
        <Stack.Screen name="Reset Password" component={ForgotPassword} />
        <Stack.Screen
          name="MainInterface"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from './SettingsScreen';
import UserDetailsScreen from './UserDetailsScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
import ManageUserData from './ManageUserData';

const SettingsStack = createStackNavigator();

export default function SettingsNavigator() {
    return (
        <SettingsStack.Navigator initialRouteName='Settings'>
            <SettingsStack.Screen 
                name='Settings' 
                component={SettingsScreen}
                options={{
                    headerLeft: () => null
                }} />
            <SettingsStack.Screen 
                name='User Details' 
                component={UserDetailsScreen} />
            <SettingsStack.Screen 
                name='Change Password' 
                component={ChangePasswordScreen} />
            <SettingsStack.Screen 
                name='Manage User Data' 
                component={ManageUserData} />
        </SettingsStack.Navigator>
    )
}
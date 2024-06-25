import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import IndoorRoomSearch from './IndoorRoomSearch';
import CreateRoomData from './CreateRoomData';
import RoomInformation from '../../Components/IndoorForumComponents/RoomInformation';

const IndoorForumStack = createStackNavigator();

export default function IndoorForumNavigator() {
    return (
        <IndoorForumStack.Navigator initialRouteName='Indoor Room Search'>
            <IndoorForumStack.Screen 
                name='Indoor Room Search'
                component={IndoorRoomSearch}
                options={{
                    headerShown: false
                }} />
            <IndoorForumStack.Screen 
                name='Create Room Data'
                component={CreateRoomData} />
            <IndoorForumStack.Screen 
                name='Room Information'
                component={RoomInformation}
                options={({ route }) => ({ title: route.params.roomCode })} />
        </IndoorForumStack.Navigator>
    )
}
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';
import InfoPost from '../../Components/IndoorForumComponents/InfoPost';

export default function InformationPostsPage({ route }) {
    const { posts } = route.params;

    return (
        <SafeAreaView>
            <Text> Information Posts page </Text>
        </SafeAreaView>
    )
}
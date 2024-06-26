import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function InfoPost({ info }) {
    return (
        <View style={styles.container}>
            <View style={styles.postDetails.container}>
                <Text> test </Text>
            </View>
        </View>
    )
}

const styles=StyleSheet.create({
    container: {
        borderWidthBottom: 1,
        borderColor: 'grey',
        flexDirection: 'column',
        padding: 5,
    },
    postDetails: {
        container: {
            flexDirection: 'row',
            justifyContent: 'center'
        }
    }
})
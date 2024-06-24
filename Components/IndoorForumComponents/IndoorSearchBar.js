import { setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

export default function IndoorSearchBar({ label, onChange, toggleOptions }) {
    const [query, setQuery] = useState('');

    function modify(text) {
        setQuery(text);
        onChange(text);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.textBox}>
                <FontAwesome name="search" size={28} color="black" />
                <TextInput 
                    placeholder={label}
                    style={styles.inputText}
                    value={query}
                    onChangeText={modify}
                />
            </View>
            <TouchableOpacity onPress={toggleOptions}>
                <Ionicons name="ellipsis-vertical-circle" size={40} color="black" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
        flexDirection: 'row',
        padding: 10,
    },
    textBox: {
        backgroundColor: '#f2f2f2',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        flex: 1,
        height: 44,
        flexDirection: 'row',
        paddingHorizontal: 5,
        alignItems: 'center',
    },
    inputText: {
        flex: 1,
        fontSize: 24,
        padding: 4
    }
})
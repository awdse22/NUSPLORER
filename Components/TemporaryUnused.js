import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

// Temporary file for currently unused components

const UIButton = ({ name, icon, onPress }) => {
    return (
        <View style={styles.uiBar.buttonContainer}>
            <View style={styles.uiBar.buttonDisplay}>
                <TouchableOpacity onPress={onPress}>
                <Image 
                    source={icon}
                    style={styles.uiBar.buttonImage} 
                    resizeMode='contain' />
                <Text style={styles.uiBar.buttonText}>{name}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const UIBar = () => {
    return (
        <View style={styles.uiBar.container}>
            <UIButton name='Navigate' icon={require('../assets/navigate-icon.png')}
                onPress={() => console.log('Navigate button pressed')} />
            <UIButton name='Indoor Map' icon={require('../assets/map-icon.png')}
                onPress={() => console.log('Indoor map button pressed')} />
            <UIButton name='Bookmarks' icon={require('../assets/bookmark-icon.png')}
                onPress={() => console.log('Bookmarks button pressed')} />
            <UIButton name='Timetable' icon={require('../assets/timetable-icon.png')}
                onPress={() => console.log('Timetable button pressed')} />
            <UIButton name='Settings' icon={require('../assets/settings-icon.png')}
                onPress={() => console.log('Settings button pressed')} />
        </View>
    );
}

export default function TemporaryUnused() {
    return <></>
}

const styles = StyleSheet.create({
    uiBar: {
        container: {
          padding: 0,
          flexDirection: 'row',
          height: 100,
          width: '100%',
          justifyContent: 'space-between',
          backgroundColor: '#c7fffc',
    
        },
        buttonContainer: {
          width: '20%',
          height: '100%',
          padding: 3,
          borderWidth: 1
        },
        buttonDisplay: {
          borderWidth: 0,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        },
        buttonImage: {
          height: '70%',
        },
        buttonText: {
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 12
        }
      },
})
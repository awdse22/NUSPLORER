import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

export default function OptionsModal({ modalVisible, closeModal, contentType, 
    makeReport = null , editFunction = null, deleteFunction = null }) {
    
    const editable = 
        contentType == 'post'
        ? 'post'
        : contentType == 'image'
        ? 'description'
        : 'room data'

    const OptionsButton = ({ onPress, label, isBottom = false, extraTextStyle = null }) => {
        if (!onPress) return null;
        const buttonTextStyle = extraTextStyle 
            ? [styles.buttonText, extraTextStyle]
            : styles.buttonText;
        const buttonStyle = isBottom
            ? styles.button
            : [styles.button, { borderBottomWidth: 1 }];

        return (
            <TouchableOpacity 
                onPress={onPress}
                style={buttonStyle}
            >
                <Text style={buttonTextStyle}>
                    {label}
                </Text>
            </TouchableOpacity>
        )
    }

    return (
        <Modal visible={modalVisible} animationType='fade' transparent={true}>
            <View style={styles.container}>
                <View style={styles.window}>
                    <OptionsButton 
                        onPress={makeReport} 
                        label='Report'
                        extraTextStyle={{ color: 'red' }}
                    />
                    <OptionsButton 
                        onPress={editFunction}
                        label={`Edit ${editable}`}
                    />
                    <OptionsButton 
                        onPress={deleteFunction}
                        label={`Delete ${contentType}`}
                    />
                    <OptionsButton 
                        onPress={closeModal}
                        label='Cancel'
                        isBottom={true}
                    />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    },
    window: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "70%",
    },
    button: {
    width: "100%",
    height: 50,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "grey",
    borderBottomWidth: 1,
    },
    buttonText: {
    fontSize: 18,
    },
})
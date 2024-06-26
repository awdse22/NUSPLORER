import { React, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form'

export default function IndoorDataInput({ fieldName, label, info, 
    control, rules, type }) {

    return (
        <View style={styles.container}>
            <Text style={styles.labelText}>{label}: </Text>
            {info != null && <Text style={styles.infoText}>{info}</Text>}
            <Controller
                control={control}
                name={fieldName}
                rules={rules}
                defaultValue=""
                render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                <View>
                    <TextInput 
                    value={value} 
                    onChangeText={onChange} 
                    onBlur={onBlur}
                    multiline={type == 'post'}
                    style={[
                        styles.inputBox, 
                        { fontSize: type == 'data' ? 20 : 15},
                        error ? {borderColor: 'red'} : {borderColor: '#e8e8e8'}
                    ]} />
                    {type == "post" && <Text style={styles.characterCount}>{value.length} / 500 characters</Text>}
                    <View style={styles.errorMessageContainer}>
                        {error && <Text style={styles.errorMessage}>{error.message}</Text>}
                    </View>
                </View>
                )}      
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        width: '100%',
        backgroundColor: 'white',
        padding: 14,
        borderRadius: 10
    },
    labelText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    infoText: {
        fontSize: 14,
        color: '#858585',
    },
    inputBox: {
        textAlign: 'left',
        backgroundColor: '#f2f2f2',
        borderWidth: 2,
        borderRadius: 8,
        width: '95%',
        padding: 5,
        marginTop: 5,
    },
    dataInputText: {
        fontSize: 20
    },
    errorMessageContainer: {
        height: 25
    },
    errorMessage: {
        marginLeft: 3,
        color: 'red',
        fontSize: 16
    },
    characterCount: {
        marginLeft: 3,
        fontSize: 12,
        color: 'grey'
    }
})
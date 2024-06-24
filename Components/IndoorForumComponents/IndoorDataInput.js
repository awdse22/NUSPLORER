import { React } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form'

export default function IndoorDataInput({ fieldName, label, info, 
    control, rules }) {
    return (
        <View style={styles.container}>
            <Text style={styles.labelText}>{label}: </Text>
            {info != null && <Text style={styles.infoText}>{info}</Text>}
            <Controller
                control={control}
                name={fieldName}
                rules={rules}
                render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                <View style={styles.inputBoxContainer}>
                    <TextInput 
                    value={value} 
                    onChangeText={onChange} 
                    onBlur={onBlur}
                    style={[styles.inputBox, error ? {borderColor: 'red'} : {borderColor: '#e8e8e8'}]}
                    />
                    {error && <Text style={styles.errorMessage}>{error.message}</Text>}
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
    inputBoxContainer: {
        height: 80,
        width: '100%',
    },
    inputBox: {
        textAlign: 'left',
        fontSize: 20,
        backgroundColor: '#f2f2f2',
        borderWidth: 2,
        borderRadius: 8,
        width: '95%',
        height: 40,
        padding: 5,
        marginTop: 5,
    },
    errorMessage: {
        marginLeft: 3,
        color: 'red',
        fontSize: 16
    }
})
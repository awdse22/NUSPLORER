import { React } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form'

export default function AuthenticationInput({ 
    fieldName, label, control, rules, secureTextEntry = false, keyboardType = 'default'}) {

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{label}:</Text>
            <Controller
                control={control}
                name={fieldName}
                rules={rules}
                render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                <>
                    <TextInput 
                    value={value} 
                    onChangeText={onChange} 
                    onBlur={onBlur}
                    style={[styles.inputBox, error ? {borderColor: 'red'} : {}]}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType} />
                    {error && <Text style={{color: 'red'}}>{error.message}</Text>}
                </>
                )}      
            />
        </View>

        
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 10,
        width: '95%'
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    inputBox: {
        textAlign: 'left',
        fontSize: 20,
        backgroundColor: 'white',
        borderWidth: 2,
        width: '95%',
        height: 40,
        padding: 5,
        margin: 5
    },
})
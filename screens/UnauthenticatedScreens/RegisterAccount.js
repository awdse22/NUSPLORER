import { React, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, TouchableWithoutFeedback, 
  Keyboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useForm } from 'react-hook-form';
import AuthenticationInput from '../../Components/AuthenticationInput';
import AuthScreenButton from '../../Components/AuthScreenButton';
import validator from 'validator';

export default function RegisterAccount() {
    const navigation = useNavigation();
    const {control, handleSubmit, formState: {error}, watch} = useForm();

    function registerAccount() {
        navigation.navigate('Email Confirmation');
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <ScrollView>
                    <AuthenticationInput 
                        fieldName='username'
                        label='Username'
                        control={control}
                        rules={{
                            required: 'Please enter a username', 
                            minLength: {
                                value: 3,
                                message: 'Your username should be at least 3 characters long',
                            },
                            maxLength: {
                                value: 16,
                                message: 'Your username should be at most 16 characters long'
                            }}} />
                    <AuthenticationInput 
                        fieldName='email'
                        label='Email'
                        control={control}
                        rules={{
                            required: 'Please enter your email',
                            validate: v => validator.isEmail(v) || 'Please enter a valid email'
                        }} />
                    <AuthenticationInput 
                        fieldName='password'
                        label='Password'
                        control={control}
                        rules={{
                            required: 'Please enter your password', 
                            minLength: {
                                value: 8,
                                message: 'Your password should be at least 8 characters long',
                            }}}
                        secureTextEntry={true} />
                    <AuthenticationInput 
                        fieldName='confirmPassword'
                        label='Confirm Password'
                        control={control}
                        rules={{
                            required: 'Please enter your password again', 
                            validate: v => watch('password') == v || 'The passwords do not match'
                        }}
                        secureTextEntry={true} />
                    <AuthScreenButton buttonName='Register' onPress={handleSubmit(registerAccount)} />
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
        
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'pink',
        justifyContent: 'center',
        padding: 20
    },
})


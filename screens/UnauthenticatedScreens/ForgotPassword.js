import { React, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, TouchableWithoutFeedback, 
  Keyboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useForm } from 'react-hook-form';
import AuthenticationInput from '../../Components/AuthenticationInput';
import AuthScreenButton from '../../Components/AuthScreenButton';
import validator from 'validator';

export default function ForgotPassword() {
    const {control, handleSubmit, formState: {error}} = useForm();

    function sendDetails(data) {
        console.log(data);
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <ScrollView>
                    <AuthenticationInput 
                        fieldName='email'
                        label='Please enter the email linked to your account'
                        control={control}
                        rules={{
                            required: 'Please enter your email',
                            validate: v => validator.isEmail(v) || 'Please enter a valid email'
                        }} />
                    <AuthScreenButton buttonName='Proceed' onPress={handleSubmit(sendDetails)} />
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


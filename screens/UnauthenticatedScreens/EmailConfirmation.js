import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, 
  Keyboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useForm } from 'react-hook-form';
import AuthenticationInput from '../../Components/AuthenticationInput';
import AuthScreenButton from '../../Components/AuthScreenButton';

export default function EmailConfirmation() {
    const {control, handleSubmit, formState: {error}} = useForm();

    function confirmEmail(data) {
        console.log(data);
    }

    function resendCode() {
        console.log('Resending confirmation code');
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <ScrollView>
                    <AuthenticationInput 
                        fieldName='confirmationCode'
                        label='Confirmation code'
                        keyboardType='numeric'
                        control={control}
                        rules={{required: 'Please enter the confirmation code'}} />
                    <AuthScreenButton buttonName='Confirm' onPress={handleSubmit(confirmEmail)} />
                    <AuthScreenButton buttonName='Resend code' onPress={resendCode} />
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


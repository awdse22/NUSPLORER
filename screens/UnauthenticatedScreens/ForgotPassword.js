import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, 
  Keyboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useForm } from 'react-hook-form';
import UserInput from '../../Components/UserInput';
import UserSubmitButton from '../../Components/UserSubmitButton';
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
                    <UserInput 
                        fieldName='email'
                        label='Enter the email linked to your account'
                        control={control}
                        rules={{
                            required: 'Please enter your email',
                            validate: v => validator.isEmail(v) || 'Please enter a valid email'
                        }} />
                    <UserSubmitButton buttonNAme='Procced' onPress={handleSubmit(sendDetails)} />
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#d1fdff',
        justifyContent: 'center',
        padding: 20
    },
})


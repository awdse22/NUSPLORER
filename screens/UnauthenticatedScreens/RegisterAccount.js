import { React, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useForm } from 'react-hook-form';
import UserInput from '../../Components/UserInput';
import UserSubmitButton from '../../Components/UserSubmitButton';
import validator from 'validator';
import axios from 'axios';

export default function RegisterAccount() {
    const navigation = useNavigation();
    const {control, handleSubmit, formState: {error}, watch} = useForm();
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    function registerAccount(credentials) {
        console.log('--------------- FrontEnd posting: --------------------');
        console.log(credentials);
        const url = 'http://10.0.2.2:3000/register';
        
        axios.post(url, credentials).then((response) => {
            console.log('Account creation success');
            navigation.navigate('Account Created');
        }).catch(error => {
            setErrorMessage(error.response.data.message);
            setErrorVisible(true);
            const errorStatus = error.response.status;
            if (errorStatus != 400 && (errorStatus != 401 && errorStatus != 500)) {
                console.error('Error in backend: ', error);
            }
        })
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <ScrollView>
                    <UserInput 
                        fieldName='username'
                        label='Username'
                        info='Must be 3 - 16 characters long'
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
                    <UserInput 
                        fieldName='email'
                        label='Email'
                        control={control}
                        rules={{
                            required: 'Please enter your email',
                            validate: v => validator.isEmail(v) || 'Please enter a valid email'
                        }} />
                    <UserInput 
                        fieldName='password'
                        label='Password'
                        info='Should be at least 8 characters long'
                        secureTextEntry={true}
                        control={control}
                        rules={{
                            required: 'Please enter your password', 
                            minLength: {
                                value: 8,
                                message: 'Your password should be at least 8 characters long',
                            }}} />
                    <UserInput 
                        fieldName='confirmPassword'
                        label='Confirm Password'
                        control={control}
                        secureTextEntry={true}
                        rules={{
                            required: 'Please enter your password again', 
                            validate: v => watch('password') == v || 'The passwords do not match'
                        }} />
                    <UserSubmitButton buttonName='Register' onPress={handleSubmit(registerAccount)} />
                    {errorVisible && <Text style={styles.errorMessage}>{errorMessage}</Text>}
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
        
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        backgroundColor: '#d1fdff',
        padding: 8,
    },
    errorMessage: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
    }
})


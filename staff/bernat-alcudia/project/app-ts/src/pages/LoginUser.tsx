import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { errors } from 'com';

import logic from '../logic';
import type { RootNavigation } from '../types/navigation'

const { ValidationError, MatchError } = errors



function LoginUser() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation<RootNavigation>()



    const handleSubmit = () => {
        try {
            logic.loginUser(username, password)
                .then(() => {
                    setUsername('')
                    setPassword('')
                    navigation.navigate('tabs')
                })
                .catch(error => {
                    console.error(error.message)

                    let feedback = error.message

                    if (error instanceof ValidationError)
                        feedback = `${feedback},please correct it`
                    else if (error instanceof MatchError)
                        feedback = `${feedback},please verify credentials`
                    else
                        feedback = 'sorry, there was an error,please try again'

                    alert(feedback)
                })
        } catch (error) {
            console.error(error)
            let feedback = error instanceof Error ? error.message : 'Unexpected error'

            if (error instanceof ValidationError)
                feedback = `${feedback},please correct it`
            else if (error instanceof MatchError)
                feedback = `${feedback},please verify credentials`
            else
                feedback = 'sorry,there was an error,please try again'

            alert(feedback)
        }
    }

    const handleRegister = () => {
        navigation.navigate('RegisterUser')
    }

    const styles = StyleSheet.create({
        view: {
            flexGrow: 1,
            paddingVertical: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        input: {
            width: '80%',
            padding: 10,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
        },
        button: {
            width: '80%',
            padding: 15,
            backgroundColor: 'black',
            borderRadius: 5,
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            alignSelf: 'center'
        },
    })

    return <ScrollView contentContainerStyle={styles.view} keyboardShouldPersistTaps='handled'>
        <TextInput style={styles.input} placeholder='username' value={username} onChangeText={setUsername} />
        <TextInput style={styles.input} secureTextEntry={true} placeholder='password' value={password} onChangeText={setPassword} />
        <TouchableOpacity style={styles.button} onPress={handleSubmit} accessibilityRole='button'>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRegister} accessibilityRole='button'>
            <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
    </ScrollView>
}

export default LoginUser
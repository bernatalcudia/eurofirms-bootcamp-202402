import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import logic from '../logic';
import { errors, utils } from 'com';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import type { RootNavigation } from '../types/navigation'




const { ValidationError, DuplicityError } = errors

function RegisterSeller({ }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [birthdate, setBirthdate] = useState<Date | null>(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation<RootNavigation>()



    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (_event: DateTimePickerEvent, date?: Date) => {
        if (date) setBirthdate(date)
        setShowDatePicker(false)
    }

    const handleRegisterSeller = () => {
        if (!birthdate) {
            alert('Please select your birthdate')
            return
        }
        try {
            logic.registerSeller(name, birthdate.toISOString(), email, username, password)
                .then(() => {
                    alert('user registered')
                    navigation.navigate('LoginUser')
                    setName('')
                    setEmail('')
                    setBirthdate(null)
                    setUsername('')
                    setPassword('')
                })
                .catch(error => {
                    console.error(error.message)

                    let feedback = error.message

                    if (error instanceof ValidationError)
                        feedback = `${feedback}, please correct it`
                    else if (error instanceof DuplicityError)
                        feedback = `${feedback},please try with another user`
                    else
                        feedback = 'sorry,there was an error,please try again later'

                    alert(feedback)
                })
        } catch (error) {
            console.error(error)
            let feedback = error instanceof Error ? error.message : 'Unexpected error'

            if (error instanceof ValidationError)
                feedback = `${feedback}, please correct it`
            else if (error instanceof DuplicityError)
                feedback = `${feedback}, please try with another user`
            else
                feedback = 'sorry, there was an error,please try again later'

            alert(feedback)
        }
    };

    const styles = StyleSheet.create({
        view: {
            paddingTop: '20%',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            alignItems: 'center',
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


    return <View style={styles.view}>
        <TextInput style={styles.input} placeholder='name' value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder='email' value={email} onChangeText={setEmail} />

        <TextInput style={styles.input} placeholder='username' value={username} onChangeText={setUsername} />
        <TextInput style={styles.input} onPress={() => setShowDatePicker(true)} placeholder='birthdate' value={birthdate ? utils.formatDate(birthdate) : ''} />
        {showDatePicker && (
            <DateTimePicker display='spinner' onChange={handleDateChange} value={birthdate || new Date()} />

        )}
        <TextInput style={styles.input} secureTextEntry={true} placeholder='password' value={password} onChangeText={setPassword} />
        <TouchableOpacity style={styles.button} onPress={handleRegisterSeller}>
            <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
    </View>
}

export default RegisterSeller
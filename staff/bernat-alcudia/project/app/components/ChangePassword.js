import { View, TextInput, TouchableOpacity, StyleSheet, Text, AccessibilityInfo, Alert } from 'react-native'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import logic from '../logic'
import { errors } from '../com'

const { ContentError } = errors


function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('')

    const navigation = useNavigation()

    const handleChangePassword = () => {
        try {
            logic.changeUserPassword(currentPassword, newPassword, newPasswordRepeat)
                .then(() => {
                    alert('change password')
                    setCurrentPassword('')
                    setNewPassword('')
                    setNewPasswordRepeat('')
                    navigation.navigate('tabs')
                    AccessibilityInfo.announceForAccessibility('Password changed successfully')
                })
                .catch(error => {
                    console.error(error.message)

                    let feedback = error.message

                    if (error instanceof TypeError || error instanceof RangeError || error instanceof ContentError)
                        feedback = `${feedback}, please correct it`

                    else
                        feedback = 'sorry, there was an error,please try again later'

                    Alert.alert('Error', feedback)
                    AccessibilityInfo.announceForAccessibility(feedback)
                })
        } catch (error) {
            console.error(error.message)

            let feedback = error.message


            if (error instanceof TypeError || error instanceof RangeError || error instanceof ContentError)
                feedback = `${feedback}, please correct it`

            else
                feedback = 'sorry, there was an error,please try again later'

            alert(feedback)
        }
    }

    const styles = StyleSheet.create({
        view: {
            paddingTop: '20%',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            alignItems: 'center',
            flex: 1
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
            marginTop: 20
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            alignSelf: 'center'
        },
    })

    return (
        <View style={styles.view}>
            <TextInput style={styles.input}
                importantForAccessibility="yes"
                secureTextEntry={true} placeholder='Current Password' value={currentPassword}
                accessibilityLabel='Current Password' textContentType='password' autoCapitalize='none' returnKeyType='next' onChangeText={setCurrentPassword} />

            <TextInput style={styles.input}
                secureTextEntry={true} placeholder='New password' accessibilityLabel='New Password' importantForAccessibility='yes' textContentType='newPassword' autoCapitalize='none' returnKeyType='next' value={newPassword} onChangeText={setNewPassword} />

            <TextInput style={styles.input}
                secureTextEntry={true} placeholder='Repeat new password' accessibilityLabel='Repeat New Password' importantForAccessibility='yes' textContentType='newPassword' autoCapitalize='none' returnKeyType='done' value={newPasswordRepeat} onChangeText={setNewPasswordRepeat} />

            <TouchableOpacity style={styles.button} onPress={handleChangePassword} accessibilityLabel='Save New Password' accessibilityHint='Saves the new password' role='button'>
                <Text style={styles.buttonText}>Save New Password</Text>
            </TouchableOpacity>

        </View>
    )

}

export default ChangePassword
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { errors } from 'com'
import { ActivityIndicator, AccessibilityInfo, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import logic from '../logic'
import type { RootNavigation } from '../types/navigation'
import { useLanguage } from '../i18n/LanguageContext'

const { ValidationError } = errors

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigation = useNavigation<RootNavigation>()
    const { t } = useLanguage()

    const handleChangePassword = () => {
        if (isSubmitting) return
        setIsSubmitting(true)
        try {
            logic.changeUserPassword(currentPassword, newPassword, newPasswordRepeat)
                .then(() => {
                    alert(t('Password changed successfully.'))
                    setCurrentPassword('')
                    setNewPassword('')
                    setNewPasswordRepeat('')
                    navigation.navigate('tabs')
                    AccessibilityInfo.announceForAccessibility(t('Password changed successfully.'))
                })
                .catch(error => {
                    console.error(error)
                    const feedback = error instanceof ValidationError
                        ? t('Please correct the highlighted information and try again.')
                        : t('Password change failed. Please try again.')
                    Alert.alert(t('Error'), feedback)
                    AccessibilityInfo.announceForAccessibility(feedback)
                })
                .finally(() => setIsSubmitting(false))
        } catch (error) {
            console.error(error)
            setIsSubmitting(false)
            const feedback = error instanceof ValidationError
                ? t('Please correct the highlighted information and try again.')
                : t('Password change failed. Please try again.')
            alert(feedback)
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.view} keyboardShouldPersistTaps='handled'>
            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    importantForAccessibility='yes'
                    secureTextEntry
                    placeholder={t('Current password')}
                    placeholderTextColor='#64748b'
                    value={currentPassword}
                    accessibilityLabel={t('Current password')}
                    textContentType='password'
                    autoCapitalize='none'
                    returnKeyType='next'
                    onChangeText={setCurrentPassword}
                />
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder={t('New password')}
                    placeholderTextColor='#64748b'
                    accessibilityLabel={t('New password')}
                    importantForAccessibility='yes'
                    textContentType='newPassword'
                    autoCapitalize='none'
                    returnKeyType='next'
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder={t('Repeat new password')}
                    placeholderTextColor='#64748b'
                    accessibilityLabel={t('Repeat new password')}
                    importantForAccessibility='yes'
                    textContentType='newPassword'
                    autoCapitalize='none'
                    returnKeyType='done'
                    value={newPasswordRepeat}
                    onChangeText={setNewPasswordRepeat}
                    onSubmitEditing={handleChangePassword}
                />
                <TouchableOpacity
                    style={[styles.button, isSubmitting && styles.disabledButton]}
                    onPress={handleChangePassword}
                    disabled={isSubmitting || !currentPassword || !newPassword || !newPasswordRepeat}
                    accessibilityLabel={t('Save new password')}
                    accessibilityState={{ disabled: isSubmitting || !currentPassword || !newPassword || !newPasswordRepeat }}
                    accessibilityRole='button'
                >
                    {isSubmitting
                        ? <ActivityIndicator color='#ffffff' />
                        : <Text style={styles.buttonText}>{t('Save new password')}</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    view: {
        flexGrow: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f5f9',
    },
    card: {
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        maxWidth: 420,
        padding: 24,
        width: '100%',
    },
    input: {
        width: '100%',
        paddingHorizontal: 14,
        paddingVertical: 13,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 10,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: 48,
        padding: 12,
        backgroundColor: '#0f766e',
        borderRadius: 10,
        marginTop: 8,
    },
    disabledButton: {
        opacity: 0.65,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
})

export default ChangePassword

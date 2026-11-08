import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { errors } from 'com'
import { ActivityIndicator, AccessibilityInfo, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import logic from '../logic'
import type { RootNavigation } from '../types/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import createChangePasswordStyles from '../styles/ChangePassword.styles'
import KeyboardAwareScrollView from './KeyboardAwareScrollView'

const { ValidationError } = errors

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigation = useNavigation<RootNavigation>()
    const { t } = useLanguage()
    const { colors } = useTheme()
    const styles = createChangePasswordStyles(colors)

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
        <KeyboardAwareScrollView contentContainerStyle={styles.view}>
            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    importantForAccessibility='yes'
                    secureTextEntry
                    placeholder={t('Current password')}
                    placeholderTextColor={colors.mutedText}
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
                    placeholderTextColor={colors.mutedText}
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
                    placeholderTextColor={colors.mutedText}
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
                        ? <ActivityIndicator color={colors.onPrimary} />
                        : <Text style={styles.buttonText}>{t('Save new password')}</Text>}
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default ChangePassword

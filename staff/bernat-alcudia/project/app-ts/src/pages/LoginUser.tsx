import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { errors } from 'com';

import logic from '../logic';
import type { RootNavigation } from '../types/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import { authDisabledButton, authLogo, createLoginStyles } from '../styles/Auth.styles'

const { ValidationError, MatchError } = errors



function LoginUser() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigation = useNavigation<RootNavigation>()
    const { t } = useLanguage()
    const { colors } = useTheme()

    const handleSubmit = () => {
        if (isSubmitting) return
        setIsSubmitting(true)
        try {
            logic.loginUser(username, password)
                .then(() => {
                    setUsername('')
                    setPassword('')
                    navigation.navigate('tabs')
                })
                .catch(error => {
                    console.error(error)
                    const feedback = error instanceof ValidationError
                        ? t('Please correct the highlighted information and try again.')
                        : error instanceof MatchError
                            ? t('Please verify your username and password.')
                            : t('Something went wrong. Please try again.')
                    alert(feedback)
                })
                .finally(() => setIsSubmitting(false))
        } catch (error) {
            console.error(error)
            setIsSubmitting(false)
            const feedback = error instanceof ValidationError
                ? t('Please correct the highlighted information and try again.')
                : error instanceof MatchError
                    ? t('Please verify your username and password.')
                    : t('Something went wrong. Please try again.')
            alert(feedback)
        }
    }

    const handleRegister = () => {
        navigation.navigate('RegisterUser')
    }

    const styles = createLoginStyles(colors)

    return <ScrollView contentContainerStyle={styles.view} keyboardShouldPersistTaps='handled'>
        <View style={styles.card}>
            <Image source={require('../../assets/bonita-fallera-logo.png')} style={authLogo} resizeMode='contain' accessibilityLabel={t('Bonita Fallera logo')} />
            <Text style={styles.heading} accessibilityRole='header'>{t('Welcome back')}</Text>
            <Text style={styles.subtitle}>{t('Sign in to discover products')}</Text>
            <TextInput
                style={styles.input}
                placeholder={t('Username')}
                placeholderTextColor={colors.mutedText}
                value={username}
                onChangeText={setUsername}
                autoCapitalize='none'
                autoCorrect={false}
                accessibilityLabel={t('Username')}
                returnKeyType='next'
            />
            <TextInput
                style={styles.input}
                secureTextEntry
                placeholder={t('Password')}
                placeholderTextColor={colors.mutedText}
                value={password}
                onChangeText={setPassword}
                autoCapitalize='none'
                accessibilityLabel={t('Password')}
                textContentType='password'
                returnKeyType='done'
                onSubmitEditing={handleSubmit}
            />
            <TouchableOpacity
                style={[styles.button, isSubmitting && authDisabledButton]}
                onPress={handleSubmit}
                disabled={isSubmitting || !username.trim() || !password}
                accessibilityRole='button'
                accessibilityLabel={t('Login')}
                accessibilityState={{ disabled: isSubmitting || !username.trim() || !password }}
            >
                {isSubmitting
                    ? <ActivityIndicator color={colors.onPrimary} />
                    : <Text style={styles.buttonText}>{t('Login')}</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleRegister} accessibilityRole='button'>
                <Text style={styles.secondaryButtonText}>{t('Register')}</Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
}

export default LoginUser
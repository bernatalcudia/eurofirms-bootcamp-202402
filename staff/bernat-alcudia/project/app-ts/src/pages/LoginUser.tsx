import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { errors } from 'com';

import logic from '../logic';
import type { RootNavigation } from '../types/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'

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

    const styles = StyleSheet.create({
        view: {
            flexGrow: 1,
            padding: 24,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
        },
        card: {
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: 18,
            elevation: 3,
            maxWidth: 420,
            padding: 24,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            width: '100%',
        },
        heading: {
            color: colors.text,
            fontSize: 26,
            fontWeight: '700',
            marginBottom: 8,
            textAlign: 'center',
        },
        subtitle: {
            color: colors.mutedText,
            fontSize: 15,
            marginBottom: 20,
            textAlign: 'center',
        },
        input: {
            width: '100%',
            paddingHorizontal: 14,
            paddingVertical: 13,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            backgroundColor: colors.input,
            color: colors.text,
            fontSize: 16,
        },
        button: {
            width: '100%',
            padding: 14,
            backgroundColor: colors.primary,
            borderRadius: 10,
            marginTop: 6,
        },
        secondaryButton: {
            width: '100%',
            padding: 13,
            borderColor: colors.primary,
            borderWidth: 1,
            borderRadius: 10,
            marginTop: 10,
        },
        buttonText: {
            color: colors.onPrimary,
            fontSize: 16,
            fontWeight: '700',
            textAlign: 'center',
        },
        secondaryButtonText: {
            color: colors.primary,
            fontSize: 16,
            fontWeight: '700',
            textAlign: 'center',
        },
    })

    return <ScrollView contentContainerStyle={styles.view} keyboardShouldPersistTaps='handled'>
        <View style={styles.card}>
            <Image source={require('../../assets/bonita-fallera-logo.png')} style={{ width: 190, height: 150, marginBottom: 8 }} resizeMode='contain' accessibilityLabel={t('Bonita Fallera logo')} />
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
                style={[styles.button, isSubmitting && { opacity: 0.7 }]}
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
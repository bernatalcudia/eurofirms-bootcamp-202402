import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { errors } from 'com';

import logic from '../logic';
import type { RootNavigation } from '../types/navigation'
import { useLanguage } from '../i18n/LanguageContext'

const { ValidationError, MatchError } = errors



function LoginUser() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigation = useNavigation<RootNavigation>()
    const { t } = useLanguage()

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
            backgroundColor: '#f1f5f9',
        },
        card: {
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 18,
            elevation: 3,
            maxWidth: 420,
            padding: 24,
            shadowColor: '#0f172a',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            width: '100%',
        },
        heading: {
            color: '#0f172a',
            fontSize: 26,
            fontWeight: '700',
            marginBottom: 8,
            textAlign: 'center',
        },
        subtitle: {
            color: '#64748b',
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
            borderColor: '#cbd5e1',
            borderRadius: 10,
            backgroundColor: '#ffffff',
            fontSize: 16,
        },
        button: {
            width: '100%',
            padding: 14,
            backgroundColor: '#0f766e',
            borderRadius: 10,
            marginTop: 6,
        },
        secondaryButton: {
            width: '100%',
            padding: 13,
            borderColor: '#0f766e',
            borderWidth: 1,
            borderRadius: 10,
            marginTop: 10,
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '700',
            textAlign: 'center',
        },
        secondaryButtonText: {
            color: '#0f766e',
            fontSize: 16,
            fontWeight: '700',
            textAlign: 'center',
        },
    })

    return <ScrollView contentContainerStyle={styles.view} keyboardShouldPersistTaps='handled'>
        <View style={styles.card}>
            <Text style={styles.heading} accessibilityRole='header'>{t('Welcome back')}</Text>
            <Text style={styles.subtitle}>{t('Sign in to discover products')}</Text>
            <TextInput
                style={styles.input}
                placeholder={t('Username')}
                placeholderTextColor='#64748b'
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
                placeholderTextColor='#64748b'
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
                    ? <ActivityIndicator color='#ffffff' />
                    : <Text style={styles.buttonText}>{t('Login')}</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleRegister} accessibilityRole='button'>
                <Text style={styles.secondaryButtonText}>{t('Register')}</Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
}

export default LoginUser
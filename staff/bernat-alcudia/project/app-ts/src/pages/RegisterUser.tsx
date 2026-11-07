import React, { useState } from 'react';
import { ActivityIndicator, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import logic from '../logic';
import { errors, utils } from 'com';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import type { RootNavigation } from '../types/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'




const { ValidationError, DuplicityError } = errors

function RegisterUser() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [birthdate, setBirthdate] = useState<Date | null>(null)
    const [birthdateInput, setBirthdateInput] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigation = useNavigation<RootNavigation>()
    const { t } = useLanguage()
    const { colors } = useTheme()

    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (_event: DateTimePickerEvent, date?: Date) => {
        if (date) setBirthdate(date)
        setShowDatePicker(false)
    }

    const handleBirthdateTextChange = (value: string) => {
        setBirthdateInput(value)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            setBirthdate(null)
            return
        }

        const date = new Date(`${value}T00:00:00.000Z`)
        setBirthdate(!Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null)
    }

    const handleRegister = () => {
        if (!birthdate) {
            alert(t('Please select a valid birthdate.'))
            return
        }
        if (isSubmitting) return
        setIsSubmitting(true)
        try {
            logic.registerUser(name, birthdate.toISOString(), email, username, password)
                .then(() => {
                    alert(t('Account created. You can now sign in.'))
                    navigation.navigate('LoginUser')
                    setName('')
                    setEmail('')
                    setBirthdate(null)
                    setBirthdateInput('')
                    setUsername('')
                    setPassword('')
                })
                .catch(error => {
                    console.error(error)
                    const feedback = error instanceof ValidationError
                        ? t('Please correct the highlighted information and try again.')
                        : error instanceof DuplicityError
                            ? t('That username or email is already in use.')
                            : t('Something went wrong while creating your account. Please try again.')
                    alert(feedback)
                })
                .finally(() => setIsSubmitting(false))
        } catch (error) {
            console.error(error)
            setIsSubmitting(false)
            const feedback = error instanceof ValidationError
                ? t('Please correct the highlighted information and try again.')
                : error instanceof DuplicityError
                    ? t('That username or email is already in use.')
                    : t('Something went wrong while creating your account. Please try again.')
            alert(feedback)
        }
    };

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
            fontSize: 24,
            fontWeight: '700',
            marginBottom: 8,
            textAlign: 'center',
        },
        subtitle: {
            color: colors.mutedText,
            fontSize: 15,
            marginBottom: 18,
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
        buttonText: {
            color: colors.onPrimary,
            fontSize: 16,
            fontWeight: '700',
            textAlign: 'center',
        },
    })

    return (
        <ScrollView contentContainerStyle={styles.view} keyboardShouldPersistTaps='handled'>
            <View style={styles.card}>
                    <Image source={require('../../assets/bonita-fallera-logo.png')} style={{ width: 190, height: 150, marginBottom: 8 }} resizeMode='contain' accessibilityLabel={t('Bonita Fallera logo')} />
                    <Text style={styles.heading} accessibilityRole='header'>{t('Create your account')}</Text>
                <Text style={styles.subtitle}>{t('Join the community and find something you love.')}</Text>
                <TextInput style={styles.input} placeholder={t('Name')} placeholderTextColor={colors.mutedText} value={name} onChangeText={setName} autoCapitalize='words' accessibilityLabel={t('Name')} />
                <TextInput style={styles.input} placeholder={t('Email')} placeholderTextColor={colors.mutedText} value={email} onChangeText={setEmail} keyboardType='email-address' autoCapitalize='none' autoCorrect={false} accessibilityLabel={t('Email')} />
                <TextInput style={styles.input} placeholder={t('Username')} placeholderTextColor={colors.mutedText} value={username} onChangeText={setUsername} autoCapitalize='none' autoCorrect={false} accessibilityLabel={t('Username')} />
                <TextInput
                    style={styles.input}
                    onPress={() => Platform.OS !== 'web' && setShowDatePicker(true)}
                    onChangeText={Platform.OS === 'web' ? handleBirthdateTextChange : undefined}
                    placeholder={Platform.OS === 'web' ? t('Birthdate (YYYY-MM-DD)') : t('Choose your birthdate')}
                    placeholderTextColor={colors.mutedText}
                    value={Platform.OS === 'web' ? birthdateInput : birthdate ? utils.formatDate(birthdate) : ''}
                    accessibilityLabel={t('Birthdate')}
                    accessibilityHint={t('Choose your birthdate')}
                    editable={Platform.OS === 'web'}
                />
                {Platform.OS !== 'web' && showDatePicker && (
                    <DateTimePicker display='spinner' onChange={handleDateChange} value={birthdate || new Date()} maximumDate={new Date()} />
                )}
                <TextInput style={styles.input} secureTextEntry placeholder={t('Password')} placeholderTextColor={colors.mutedText} value={password} onChangeText={setPassword} autoCapitalize='none' accessibilityLabel={t('Password')} textContentType='newPassword' />
                <TouchableOpacity
                    style={[styles.button, isSubmitting && { opacity: 0.7 }]}
                    onPress={handleRegister}
                    disabled={isSubmitting || !name.trim() || !email.trim() || !username.trim() || !password}
                    accessibilityRole='button'
                    accessibilityLabel={t('Register')}
                    accessibilityState={{ disabled: isSubmitting || !name.trim() || !email.trim() || !username.trim() || !password }}
                >
                    {isSubmitting
                        ? <ActivityIndicator color={colors.onPrimary} />
                        : <Text style={styles.buttonText}>{t('Register')}</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default RegisterUser
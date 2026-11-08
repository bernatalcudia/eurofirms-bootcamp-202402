import React, { useState } from 'react';
import { ActivityIndicator, Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import logic from '../logic';
import { errors, utils } from 'com';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import type { RootNavigation } from '../types/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import { authDisabledButton, authLogo, createRegisterStyles } from '../styles/Auth.styles'



const { ValidationError, DuplicityError } = errors

function RegisterUser() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [birthdate, setBirthdate] = useState<Date | null>(null)
    const [birthdateInput, setBirthdateInput] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [feedback, setFeedback] = useState('')

    const navigation = useNavigation<RootNavigation>()
    const { t } = useLanguage()
    const { colors } = useTheme()

    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (_event: DateTimePickerEvent, date?: Date) => {
        if (date) setBirthdate(date)
        setFeedback('')
        setShowDatePicker(false)
    }

    const handleBirthdateTextChange = (value: string) => {
        setBirthdateInput(value)
        setFeedback('')
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            setBirthdate(null)
            return
        }

        const date = new Date(`${value}T00:00:00.000Z`)
        setBirthdate(!Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null)
    }

    const handleRegister = () => {
        if (!birthdate) {
            setFeedback(t('Please select a valid birthdate.'))
            return
        }
        if (isSubmitting) return
        setFeedback('')
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
                    const message = error instanceof ValidationError
                        ? t('Please correct the highlighted information and try again.')
                        : error instanceof DuplicityError
                            ? t('That username or email is already in use.')
                            : t('Something went wrong while creating your account. Please try again.')
                    setFeedback(message)
                })
                .finally(() => setIsSubmitting(false))
        } catch (error) {
            console.error(error)
            setIsSubmitting(false)
            const message = error instanceof ValidationError
                ? t('Please correct the highlighted information and try again.')
                : error instanceof DuplicityError
                    ? t('That username or email is already in use.')
                    : t('Something went wrong while creating your account. Please try again.')
            setFeedback(message)
        }
    };

    const styles = createRegisterStyles(colors)

    return (
        <ScrollView contentContainerStyle={styles.view} keyboardShouldPersistTaps='handled'>
            <View style={styles.card}>
                    <Image source={require('../../assets/bonita-fallera-logo.png')} style={authLogo} resizeMode='contain' accessibilityLabel={t('Bonita Fallera logo')} />
                    <Text style={styles.heading} accessibilityRole='header'>{t('Create your account')}</Text>
                <Text style={styles.subtitle}>{t('Join the community and find something you love.')}</Text>
                {feedback ? <Text style={styles.feedback} accessibilityRole='alert' accessibilityLiveRegion='polite'>{feedback}</Text> : null}
                    <TextInput
                        style={styles.input}
                        placeholder={t('Name')}
                        placeholderTextColor={colors.mutedText}
                        value={name}
                        onChangeText={value => {
                            setName(value)
                            setFeedback('')
                        }}
                        autoCapitalize='words'
                        accessibilityLabel={t('Name')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={t('Email')}
                        placeholderTextColor={colors.mutedText}
                        value={email}
                        onChangeText={value => {
                            setEmail(value)
                            setFeedback('')
                        }}
                        keyboardType='email-address'
                        autoCapitalize='none'
                        autoCorrect={false}
                        accessibilityLabel={t('Email')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={t('Username')}
                        placeholderTextColor={colors.mutedText}
                        value={username}
                        onChangeText={value => {
                            setUsername(value)
                            setFeedback('')
                        }}
                        autoCapitalize='none'
                        autoCorrect={false}
                        accessibilityLabel={t('Username')}
                    />
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
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder={t('Password')}
                    placeholderTextColor={colors.mutedText}
                    value={password}
                    onChangeText={value => {
                        setPassword(value)
                        setFeedback('')
                    }}
                    autoCapitalize='none'
                    accessibilityLabel={t('Password')}
                    textContentType='newPassword'
                />
                <TouchableOpacity
                    style={[styles.button, isSubmitting && authDisabledButton]}
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
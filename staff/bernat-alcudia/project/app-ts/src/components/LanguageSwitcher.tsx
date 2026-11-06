import React from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { useLanguage, type Language } from '../i18n/LanguageContext'

const languages: Language[] = ['en', 'es']

interface LanguageSwitcherProps {
    compact?: boolean
}

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
    const { language, setLanguage, t } = useLanguage()

    const handleSelectLanguage = (nextLanguage: Language) => {
        setLanguage(nextLanguage).catch(error => {
            console.error('Could not save the selected language:', error)
            Alert.alert(t('Error'), t('Language preference could not be saved.'))
        })
    }

    return (
        <View style={[styles.container, compact && styles.compactContainer]} accessibilityLabel={t('Language')}>
            {!compact && <Text style={styles.label}>{t('Language')}</Text>}
            <View style={styles.options}>
                {languages.map(option => (
                    <Pressable
                        key={option}
                        onPress={() => handleSelectLanguage(option)}
                        accessibilityRole='button'
                        accessibilityLabel={option === 'en' ? t('English') : t('Español')}
                        accessibilityState={{ selected: language === option }}
                        style={[styles.option, compact && styles.compactOption, language === option && styles.selectedOption]}
                    >
                        <Text style={[styles.optionText, language === option && styles.selectedText]}>
                            {option.toUpperCase()}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        maxWidth: 420,
        width: '100%',
    },
    compactContainer: {
        alignSelf: 'center',
        marginBottom: 0,
        marginRight: 8,
        width: 'auto',
    },
    label: {
        color: '#475569',
        fontSize: 14,
        fontWeight: '600',
    },
    options: {
        backgroundColor: '#e8eef2',
        borderRadius: 10,
        flexDirection: 'row',
        padding: 3,
    },
    option: {
        alignItems: 'center',
        borderRadius: 8,
        minWidth: 48,
        paddingHorizontal: 10,
        paddingVertical: 7,
    },
    compactOption: {
        minWidth: 36,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    selectedOption: {
        backgroundColor: '#0f766e',
    },
    optionText: {
        color: '#334155',
        fontSize: 13,
        fontWeight: '700',
    },
    selectedText: {
        color: '#ffffff',
    },
})

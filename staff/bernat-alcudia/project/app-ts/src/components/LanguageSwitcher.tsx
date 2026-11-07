import React from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import { useLanguage, type Language } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import createLanguageSwitcherStyles from '../styles/LanguageSwitcher.styles'

const languages: Language[] = ['en', 'es']

interface LanguageSwitcherProps {
    compact?: boolean
}

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
    const { language, setLanguage, t } = useLanguage()
    const { colors } = useTheme()

    const styles = createLanguageSwitcherStyles(colors)

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

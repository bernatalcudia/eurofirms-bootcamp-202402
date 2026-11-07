import React from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { useLanguage, type Language } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'

const languages: Language[] = ['en', 'es']

interface LanguageSwitcherProps {
    compact?: boolean
}

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
    const { language, setLanguage, t } = useLanguage()
    const { colors } = useTheme()

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            alignSelf: 'stretch',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
            width: '100%',
        },
        compactContainer: { alignSelf: 'center', marginBottom: 0, marginRight: 8, width: 'auto' },
        label: { color: colors.text, fontSize: 14, fontWeight: '600' },
        options: { backgroundColor: colors.surfaceAlt, borderColor: colors.border, borderWidth: 1, borderRadius: 10, flexDirection: 'row', padding: 3 },
        option: { alignItems: 'center', borderRadius: 8, minHeight: 40, minWidth: 52, justifyContent: 'center', paddingHorizontal: 10 },
        compactOption: { minWidth: 36, paddingHorizontal: 8, minHeight: 36 },
        selectedOption: { backgroundColor: colors.primary },
        optionText: { color: colors.text, fontSize: 13, fontWeight: '700' },
        selectedText: { color: colors.onPrimary },
    })

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

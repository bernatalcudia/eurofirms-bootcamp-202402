import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useState } from 'react'
import logic from '../logic'
import type { RootNavigation } from '../types/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme, type ThemeName } from '../theme/ThemeContext'

function Profile() {
    const navigation = useNavigation<RootNavigation>()
    const { t } = useLanguage()
    const { theme, colors, setTheme } = useTheme()
    const [expandedSection, setExpandedSection] = useState<'language' | 'appearance' | null>(null)

    const styles = StyleSheet.create({
        container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, alignItems: 'center' },
        content: { width: '100%', maxWidth: 520 },
        heading: { color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 6 },
        subtitle: { color: colors.mutedText, fontSize: 15, lineHeight: 22, marginBottom: 24 },
        sectionTitle: { color: colors.mutedText, fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 16, textTransform: 'uppercase' },
        card: { backgroundColor: colors.surface, borderRadius: 16, borderColor: colors.border, borderWidth: 1, overflow: 'hidden' },
        disclosure: { flexDirection: 'row', alignItems: 'center', minHeight: 58, paddingHorizontal: 16 },
        disclosureIcon: { marginRight: 12 },
        disclosureText: { flex: 1, color: colors.text, fontSize: 16, fontWeight: '600' },
        disclosureContent: { borderTopWidth: 1, borderTopColor: colors.border, padding: 16 },
        hint: { color: colors.mutedText, fontSize: 14, lineHeight: 20, marginTop: 12 },
        action: { flexDirection: 'row', alignItems: 'center', minHeight: 56, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: colors.border },
        actionText: { color: colors.text, fontSize: 16, fontWeight: '600', marginLeft: 12 },
        logoutText: { color: colors.danger },
        themeOptions: { gap: 8 },
        themeOption: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 12 },
        selectedTheme: { backgroundColor: colors.surfaceAlt, borderColor: colors.primary },
        themeName: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '700' },
        themeDescription: { color: colors.mutedText, fontSize: 13, marginTop: 3 },
    })

    const toggleSection = (section: 'language' | 'appearance') => {
        setExpandedSection(current => current === section ? null : section)
    }

    const handleThemeChange = (nextTheme: ThemeName) => {
        setTheme(nextTheme).catch(error => {
            console.error('Could not save the selected theme:', error)
            Alert.alert(t('Error'), t('Theme preference could not be saved.'))
        })
    }

    const handleLogout = () => {
        const logout = () => {
            logic.logoutUser()
            navigation.navigate('LoginUser')
        }

        if (Platform.OS === 'web') {
            if (globalThis.confirm(t('Are you sure you want to log out?'))) logout()
            return
        }

        Alert.alert(t('Confirm sign out'), t('Are you sure you want to log out?'), [
            { text: t('No'), style: 'cancel' },
            { text: t('Yes, log out'), style: 'destructive', onPress: logout },
        ])
    }

    const themeOptions: { id: ThemeName; title: string; description: string }[] = [
        { id: 'light', title: t('Light'), description: t('Use the bright, minimal theme.') },
        { id: 'dark', title: t('Dark'), description: t('Use the dark theme.') },
        { id: 'fallera', title: t('Fallera'), description: t('Use the colors inspired by the Bonita Fallera logo.') },
    ]

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.content}>
                <Text style={styles.heading} accessibilityRole='header'>{t('My profile')}</Text>
                <Text style={styles.subtitle}>{t('Manage your account and personalize your experience.')}</Text>

                <Text style={styles.sectionTitle}>{t('Preferences')}</Text>
                <View style={styles.card}>
                    <Pressable
                        onPress={() => toggleSection('language')}
                        style={styles.disclosure}
                        accessibilityRole='button'
                        accessibilityLabel={t('Choose language')}
                        accessibilityState={{ expanded: expandedSection === 'language' }}
                    >
                        <MaterialCommunityIcons name='translate' size={22} color={colors.primary} style={styles.disclosureIcon} />
                        <Text style={styles.disclosureText}>{t('Language')}</Text>
                        <MaterialCommunityIcons name={expandedSection === 'language' ? 'chevron-up' : 'chevron-down'} size={22} color={colors.mutedText} />
                    </Pressable>
                    {expandedSection === 'language' && (
                        <View style={styles.disclosureContent}>
                            <LanguageSwitcher />
                            <Text style={styles.hint}>{t('Language change applies throughout the app and is remembered on this device.')}</Text>
                        </View>
                    )}
                    <Pressable
                        onPress={() => toggleSection('appearance')}
                        style={[styles.disclosure, { borderTopWidth: 1, borderTopColor: colors.border }]}
                        accessibilityRole='button'
                        accessibilityLabel={t('Choose appearance')}
                        accessibilityState={{ expanded: expandedSection === 'appearance' }}
                    >
                        <MaterialCommunityIcons name='palette-outline' size={22} color={colors.primary} style={styles.disclosureIcon} />
                        <Text style={styles.disclosureText}>{t('Appearance')}</Text>
                        <Text style={{ color: colors.mutedText, marginRight: 8 }}>{t(theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'Fallera')}</Text>
                        <MaterialCommunityIcons name={expandedSection === 'appearance' ? 'chevron-up' : 'chevron-down'} size={22} color={colors.mutedText} />
                    </Pressable>
                    {expandedSection === 'appearance' && (
                        <View style={[styles.disclosureContent, styles.themeOptions]}>
                            {themeOptions.map(option => (
                                <Pressable
                                    key={option.id}
                                    onPress={() => handleThemeChange(option.id)}
                                    style={[styles.themeOption, theme === option.id && styles.selectedTheme]}
                                    accessibilityRole='radio'
                                    accessibilityLabel={`${option.title}. ${option.description}`}
                                    accessibilityState={{ selected: theme === option.id }}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.themeName}>{option.title}</Text>
                                        <Text style={styles.themeDescription}>{option.description}</Text>
                                    </View>
                                    {theme === option.id && <MaterialCommunityIcons name='check-circle' size={22} color={colors.primary} />}
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>

                <Text style={styles.sectionTitle}>{t('Account settings')}</Text>
                <View style={styles.card}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ChangePassword')}
                        style={styles.action}
                        accessibilityLabel={t('Change password')}
                        accessibilityRole='button'
                    >
                        <MaterialCommunityIcons name='lock-reset' size={22} color={colors.primary} />
                        <Text style={styles.actionText}>{t('Change password')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout} style={styles.action} accessibilityLabel={t('Log out')} accessibilityRole='button'>
                        <MaterialCommunityIcons name='logout' size={22} color={colors.danger} />
                        <Text style={[styles.actionText, styles.logoutText]}>{t('Log out')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default Profile

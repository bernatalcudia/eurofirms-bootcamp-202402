import { Alert, Platform, Text, TouchableOpacity, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import logic from '../logic'
import type { RootNavigation } from '../types/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../i18n/LanguageContext'



function Profile() {

    const navigation = useNavigation<RootNavigation>()
    const { t } = useLanguage()

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f5f5f5',
            padding: 16,
        },
        sectionTitle: {
            color: '#475569',
            fontSize: 14,
            fontWeight: '700',
            marginBottom: 8,
            maxWidth: 420,
            width: '100%',
        },
        languageHint: {
            color: '#64748b',
            fontSize: 13,
            lineHeight: 19,
            marginBottom: 8,
            maxWidth: 420,
            width: '100%',
        },
        logoutSection: {
            marginTop: 20,
            alignItems: 'center',
        },
        actionButtonContainer: {
            marginTop: 15,
            width: '100%',
            alignItems: 'center',
        },
        actionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
            borderColor: '#E0E0E0',
            borderWidth: 1,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.18,
            shadowRadius: 1.00,
            elevation: 2,
            width: '90%',
            justifyContent: 'flex-start',
        },
        actionButtonText: {
            marginLeft: 15,
            fontSize: 16,
            fontWeight: '500',
            color: '#333333',
        },
        logoutButton: {
            backgroundColor: '#FFEBEE',
            borderColor: '#EF9A9A',
        },
        logoutButtonText: {
            marginLeft: 8,
            fontSize: 16,
            fontWeight: '600',
            color: '#D32F2F',
        },
    })


    const handleNavigateChangePassword = () => {
        navigation.navigate('ChangePassword')
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




    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>{t('Account settings')}</Text>
            <LanguageSwitcher />
            <Text style={styles.languageHint}>{t('Language change applies throughout the app and is remembered on this device.')}</Text>
            <View style={styles.actionButtonContainer}>
                <TouchableOpacity
                    onPress={handleNavigateChangePassword}
                    style={styles.actionButton}
                    accessibilityLabel={t('Change password')}
                    accessibilityRole='button'
                >
                    <MaterialCommunityIcons name='lock-reset' size={24} color={'#424242'} />
                    <Text style={styles.actionButtonText}>{t('Change password')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.actionButtonContainer}>
                <TouchableOpacity
                    onPress={handleLogout}
                    style={[styles.actionButton, styles.logoutButton]}
                    accessibilityLabel={t('Log out')}
                    accessibilityRole='button'
                >
                    <MaterialCommunityIcons name='logout' size={24} color={'#D32F2F'} />
                    <Text style={styles.logoutButtonText}>{t('Log out')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Profile
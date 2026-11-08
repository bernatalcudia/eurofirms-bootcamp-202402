import { ActivityIndicator, Alert, Image, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useCallback, useState } from 'react'
import logic from '../logic'
import type { RootNavigation } from '../types/navigation'
import type { BlockedProfile, User } from '../types/models'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../i18n/LanguageContext'
import { themeColors, useTheme, type ThemeName } from '../theme/ThemeContext'
import createProfileStyles, { getPaletteSwatchStyle } from '../styles/Profile.styles'

function Profile() {
    const navigation = useNavigation<RootNavigation>()
    const { t } = useLanguage()
    const { theme, colors, setTheme } = useTheme()
    const [expandedSection, setExpandedSection] = useState<'language' | 'appearance' | null>(null)
    const [profile, setProfile] = useState<User | null>(null)
    const [originalEmail, setOriginalEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [originalPhoto, setOriginalPhoto] = useState<string | null>(null)
    const [photoError, setPhotoError] = useState('')
    const [photoFailed, setPhotoFailed] = useState(false)
    const [blockedUsers, setBlockedUsers] = useState<BlockedProfile[]>([])
    const [profileError, setProfileError] = useState(false)
    const [isSavingProfile, setIsSavingProfile] = useState(false)
    const [isLoadingBlocked, setIsLoadingBlocked] = useState(false)
    const [showBlockedUsers, setShowBlockedUsers] = useState(false)

    const styles = createProfileStyles(colors)

    const loadAccount = useCallback(async () => {
        setProfileError(false)
        try {
            const [user, blocked] = await Promise.all([logic.retrieveUser(), logic.retrieveBlockedUsers()])
            setProfile(user)
            setOriginalEmail(user.email)
            setOriginalPhoto(user.photo ?? null)
            setPhotoError('')
            setPhotoFailed(false)
            setCurrentPassword('')
            setBlockedUsers(blocked)
        } catch (error) {
            console.error('Could not load account details:', error)
            setProfileError(true)
        }
    }, [])

    useFocusEffect(useCallback(() => {
        void loadAccount()
    }, [loadAccount]))

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

    const saveProfile = async () => {
        if (!profile || isSavingProfile) return
        setIsSavingProfile(true)
        try {
            const updated = await logic.updateUserProfile({
                name: profile.name,
                email: profile.email,
                username: profile.username,
                birthdate: profile.birthdate ?? '',
                ...(profile.photo !== originalPhoto ? { photo: profile.photo ?? null } : {}),
                ...(profile.email.trim() !== originalEmail.toLowerCase() ? { currentPassword } : {}),
            })
            setProfile(updated)
            setOriginalEmail(updated.email)
            setOriginalPhoto(updated.photo ?? null)
            setCurrentPassword('')
            Alert.alert(t('Profile updated'), t('Your personal details have been saved.'))
        } catch (error) {
            console.error('Could not update profile:', error)
            Alert.alert(t('Error'), t('Profile could not be updated. Check your details and try again.'))
        } finally {
            setIsSavingProfile(false)
        }
    }

    const selectPhoto = async () => {
        try {
            setPhotoError('')
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (permission.status !== 'granted') {
                setPhotoError(t('Grant access to your photo library to select images.'))
                return
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.6,
            })
            if (result.canceled) return
            const asset = result.assets[0]
            const resize = Math.max(asset.width, asset.height) > 512
                ? [{ resize: asset.width >= asset.height ? { width: 512 } : { height: 512 } }]
                : []
            const resized = await ImageManipulator.manipulateAsync(
                asset.uri,
                resize,
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true },
            )
            const encoded = resized.base64
            if (!encoded || encoded.length + 23 > 512_000) {
                setPhotoError(t('Choose a JPEG or PNG profile photo smaller than 375 KB.'))
                return
            }
            setPhotoFailed(false)
            setProfile(current => current ? { ...current, photo: `data:image/jpeg;base64,${encoded}` } : current)
        } catch (error) {
            console.error('Could not select profile photo:', error)
            setPhotoError(t('Could not select a profile photo. Please try again.'))
        }
    }

    const removeBlock = async (userId: string) => {
        setIsLoadingBlocked(true)
        try {
            await logic.unblockUser(userId)
            setBlockedUsers(current => current.filter(user => user.id !== userId))
        } catch (error) {
            console.error('Could not unblock user:', error)
            Alert.alert(t('Error'), t('User could not be unblocked. Please try again.'))
        } finally {
            setIsLoadingBlocked(false)
        }
    }

    const themeOptions: { id: ThemeName; title: string; description: string }[] = [
        { id: 'light', title: t('Light'), description: t('Use the bright, minimal theme.') },
        { id: 'dark', title: t('Dark'), description: t('Use the dark theme.') },
        { id: 'fallera', title: t('Fallera'), description: t('Use the colors inspired by the Bonita Fallera logo.') },
    ]

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.content}>
                <Text style={styles.subtitle}>{t('Manage your account and personalize your experience.')}</Text>

                <Text style={styles.sectionTitle}>{t('Personal details')}</Text>
                <View style={styles.card}>
                    {profileError ? (
                        <View style={styles.profileMessage}>
                            <Text style={styles.hint}>{t('Account details could not be loaded.')}</Text>
                            <TouchableOpacity onPress={() => void loadAccount()} style={styles.inlineButton} accessibilityRole='button'>
                                <Text style={styles.inlineButtonText}>{t('Retry')}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : !profile ? (
                        <View style={styles.profileMessage}>
                            <ActivityIndicator color={colors.primary} />
                            <Text style={styles.hint}>{t('Loading account details…')}</Text>
                        </View>
                    ) : (
                        <View style={styles.profileForm}>
                            <View style={styles.photoSection}>
                                <View style={styles.avatar}>
                                    {profile.photo && !photoFailed
                                        ? <Image source={{ uri: profile.photo }} style={styles.avatarImage} onError={() => setPhotoFailed(true)} accessibilityLabel={t('Profile photo')} />
                                        : <MaterialCommunityIcons name='account' size={42} color={colors.primary} />}
                                </View>
                                <TouchableOpacity onPress={() => void selectPhoto()} disabled={isSavingProfile} style={styles.photoButton} accessibilityRole='button'>
                                    <Text style={styles.photoButtonText}>{t('Choose profile photo')}</Text>
                                </TouchableOpacity>
                                {profile.photo && (
                                    <TouchableOpacity onPress={() => { setPhotoError(''); setProfile(current => current ? { ...current, photo: null } : current) }} disabled={isSavingProfile} style={styles.photoButton} accessibilityRole='button'>
                                        <Text style={styles.photoButtonText}>{t('Remove photo')}</Text>
                                    </TouchableOpacity>
                                )}
                                {photoError ? <Text style={styles.photoError} accessibilityRole='alert'>{photoError}</Text> : null}
                                <Text style={styles.hint}>{t('Save your profile to apply photo changes.')}</Text>
                            </View>
                            <Text style={styles.inputLabel}>{t('Name')}</Text>
                            <TextInput
                                style={styles.profileInput}
                                value={profile.name}
                                onChangeText={name => setProfile(current => current ? { ...current, name } : current)}
                                autoCapitalize='words'
                                accessibilityLabel={t('Name')}
                            />
                            <Text style={styles.inputLabel}>{t('Email')}</Text>
                            <TextInput
                                style={styles.profileInput}
                                value={profile.email}
                                onChangeText={email => setProfile(current => current ? { ...current, email } : current)}
                                autoCapitalize='none'
                                keyboardType='email-address'
                                accessibilityLabel={t('Email')}
                            />
                            {profile.email.trim().toLowerCase() !== originalEmail.toLowerCase() && (
                                <>
                                    <Text style={styles.inputLabel}>{t('Current password to change email')}</Text>
                                    <TextInput
                                        style={styles.profileInput}
                                        value={currentPassword}
                                        onChangeText={setCurrentPassword}
                                        secureTextEntry
                                        autoCapitalize='none'
                                        accessibilityLabel={t('Current password to change email')}
                                    />
                                </>
                            )}
                            <Text style={styles.inputLabel}>{t('Username')}</Text>
                            <TextInput
                                style={styles.profileInput}
                                value={profile.username}
                                onChangeText={username => setProfile(current => current ? { ...current, username } : current)}
                                autoCapitalize='none'
                                accessibilityLabel={t('Username')}
                            />
                            <Text style={styles.inputLabel}>{t('Birth date (YYYY-MM-DD)')}</Text>
                            <TextInput
                                style={styles.profileInput}
                                value={profile.birthdate ? profile.birthdate.slice(0, 10) : ''}
                                onChangeText={birthdate => setProfile(current => current ? { ...current, birthdate } : current)}
                                placeholder='YYYY-MM-DD'
                                placeholderTextColor={colors.mutedText}
                                accessibilityLabel={t('Birth date')}
                            />
                            <Text style={styles.hint}>{t('Your role and account ID cannot be changed.')}</Text>
                            <TouchableOpacity
                                onPress={() => void saveProfile()}
                                style={[styles.inlineButton, isSavingProfile && styles.disabledButton]}
                                disabled={isSavingProfile}
                                accessibilityRole='button'
                            >
                                {isSavingProfile
                                    ? <ActivityIndicator color={colors.onPrimary} />
                                    : <Text style={styles.primaryButtonText}>{t('Save profile')}</Text>}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

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
                        style={[styles.disclosure, styles.disclosureWithTopBorder]}
                        accessibilityRole='button'
                        accessibilityLabel={t('Choose appearance')}
                        accessibilityState={{ expanded: expandedSection === 'appearance' }}
                    >
                        <MaterialCommunityIcons name='palette-outline' size={22} color={colors.primary} style={styles.disclosureIcon} />
                        <Text style={styles.disclosureText}>{t('Appearance')}</Text>
                        <Text style={styles.disclosureValue}>{t(theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'Fallera')}</Text>
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
                                    <View style={styles.themeOptionContent}>
                                        <Text style={styles.themeName}>{option.title}</Text>
                                        <Text style={styles.themeDescription}>{option.description}</Text>
                                        <View style={styles.palettePreview} accessibilityElementsHidden importantForAccessibility='no-hide-descendants'>
                                            {[themeColors[option.id].background, themeColors[option.id].surfaceAlt, themeColors[option.id].primary, themeColors[option.id].accent].map((color, index) => (
                                                <View key={`${option.id}-${index}`} style={[styles.paletteSwatch, getPaletteSwatchStyle(color)]} />
                                            ))}
                                        </View>
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
                    <Pressable
                        onPress={() => setShowBlockedUsers(current => !current)}
                        style={[styles.action, styles.disclosureWithTopBorder]}
                        accessibilityRole='button'
                        accessibilityState={{ expanded: showBlockedUsers }}
                    >
                        <MaterialCommunityIcons name='account-cancel-outline' size={22} color={colors.primary} />
                        <Text style={styles.actionText}>{t('Blocked accounts')}</Text>
                        <MaterialCommunityIcons name={showBlockedUsers ? 'chevron-up' : 'chevron-down'} size={22} color={colors.mutedText} />
                    </Pressable>
                    {showBlockedUsers && (
                        <View style={styles.blockedList}>
                            {blockedUsers.length === 0
                                ? <Text style={styles.hint}>{t('You have no blocked accounts.')}</Text>
                                : blockedUsers.map(user => (
                                    <View key={user.id} style={styles.blockedUser}>
                                        <View style={styles.blockedUserInfo}>
                                            <Text style={styles.blockedName}>{user.name}</Text>
                                            <Text style={styles.hint}>@{user.username}</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => void removeBlock(user.id)}
                                            disabled={isLoadingBlocked}
                                            accessibilityRole='button'
                                            accessibilityLabel={t('Unblock {username}', { username: user.username })}
                                        >
                                            <Text style={styles.inlineButtonText}>{t('Unblock')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    )
}

export default Profile

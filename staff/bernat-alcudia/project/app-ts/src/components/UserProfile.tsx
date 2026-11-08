import { useCallback, useState } from 'react'
import { ActivityIndicator, Alert, Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import logic from '../logic'
import type { PublicProfile as PublicProfileType } from '../types/models'
import type { RootNavigation, UserProfileRoute } from '../types/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import createUserProfileStyles from '../styles/UserProfile.styles'

export default function UserProfile() {
    const [profile, setProfile] = useState<PublicProfileType | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [photoFailed, setPhotoFailed] = useState(false)
    const route = useRoute<UserProfileRoute>()
    const navigation = useNavigation<RootNavigation>()
    const { t } = useLanguage()
    const { colors } = useTheme()
    const styles = createUserProfileStyles(colors)
    const { userId } = route.params

    const loadProfile = useCallback(async () => {
        setIsLoading(true)
        setLoadError(false)
        try {
            setProfile(await logic.retrievePublicProfile(userId))
            setPhotoFailed(false)
        } catch (error) {
            console.error('Could not load public profile:', error)
            setLoadError(true)
        } finally {
            setIsLoading(false)
        }
    }, [userId])

    useFocusEffect(useCallback(() => {
        void loadProfile()
    }, [loadProfile]))

    const toggleFollow = async () => {
        if (!profile || isSubmitting) return
        setIsSubmitting(true)
        try {
            if (profile.isFollowing) {
                await logic.unfollowUser(userId)
                setProfile(current => current ? {
                    ...current,
                    isFollowing: false,
                    followersCount: Math.max(0, current.followersCount - 1),
                } : current)
            } else {
                await logic.followUser(userId)
                setProfile(current => current ? {
                    ...current,
                    isFollowing: true,
                    followersCount: current.followersCount + 1,
                } : current)
            }
        } catch (error) {
            console.error('Could not update follow relationship:', error)
            Alert.alert(t('Error'), t('Follow preference could not be updated. Please try again.'))
        } finally {
            setIsSubmitting(false)
        }
    }

    const confirmBlock = () => {
        const block = async () => {
            setIsSubmitting(true)
            try {
                await logic.blockUser(userId)
                navigation.goBack()
            } catch (error) {
                console.error('Could not block user:', error)
                Alert.alert(t('Error'), t('User could not be blocked. Please try again.'))
            } finally {
                setIsSubmitting(false)
            }
        }
        const message = t('Blocking this account prevents follows, chats, messages, and offers in both directions. Existing listings and history are kept.')
        if (Platform.OS === 'web') {
            if (globalThis.confirm(`${t('Block this account?')}\n\n${message}`)) void block()
            return
        }
        Alert.alert(t('Block this account?'), message, [
            { text: t('Cancel'), style: 'cancel' },
            { text: t('Block'), style: 'destructive', onPress: () => void block() },
        ])
    }

    if (isLoading) {
        return (
            <View style={styles.centered} accessibilityRole='progressbar'>
                <ActivityIndicator size='large' color={colors.primary} />
                <Text style={styles.mutedText}>{t('Loading profile…')}</Text>
            </View>
        )
    }

    if (loadError || !profile) {
        return (
            <View style={styles.centered}>
                <Text style={styles.mutedText}>{t('This profile is unavailable.')}</Text>
                <TouchableOpacity onPress={() => void loadProfile()} style={styles.primaryButton} accessibilityRole='button'>
                    <Text style={styles.primaryButtonText}>{t('Retry')}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.profileCard}>
                <View style={styles.avatar}>
                    {profile.photo && !photoFailed
                        ? <Image source={{ uri: profile.photo }} style={styles.avatarImage} onError={() => setPhotoFailed(true)} accessibilityLabel={t('Profile photo')} />
                        : <MaterialCommunityIcons name='account' size={38} color={colors.primary} />}
                </View>
                <Text style={styles.name}>{profile.name}</Text>
                <Text style={styles.username}>@{profile.username}</Text>
                <View style={styles.stats}>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{profile.followersCount}</Text>
                        <Text style={styles.statLabel}>{t('Followers')}</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{profile.followingCount}</Text>
                        <Text style={styles.statLabel}>{t('Following')}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => void toggleFollow()}
                    disabled={isSubmitting}
                    style={[styles.primaryButton, isSubmitting && styles.disabledButton]}
                    accessibilityRole='button'
                >
                    <Text style={styles.primaryButtonText}>
                        {profile.isFollowing ? t('Unfollow') : t('Follow')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={confirmBlock}
                    disabled={isSubmitting}
                    style={styles.blockButton}
                    accessibilityRole='button'
                >
                    <MaterialCommunityIcons name='account-cancel-outline' size={19} color={colors.danger} />
                    <Text style={styles.blockButtonText}>{t('Block account')}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

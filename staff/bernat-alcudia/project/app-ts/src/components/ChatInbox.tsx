import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import logic from '../logic'
import { productImageUri } from '../logic/productImageUri'
import type { ChatSummary } from '../types/models'
import type { TabNavigation } from '../types/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import createChatStyles from '../styles/Chat.styles'

function ChatInbox() {
    const [chats, setChats] = useState<ChatSummary[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState(false)
    const navigation = useNavigation<TabNavigation>()
    const { language, t } = useLanguage()
    const { colors } = useTheme()
    const styles = createChatStyles(colors)

    const loadChats = useCallback(async () => {
        setIsLoading(true)
        setLoadError(false)
        try {
            setChats(await logic.retrieveChats())
        } catch (error) {
            console.error('Could not load chats:', error)
            setLoadError(true)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useFocusEffect(useCallback(() => {
        void loadChats()
    }, [loadChats]))

    const formatDate = (date: string) => new Intl.DateTimeFormat(
        language === 'es' ? 'es-ES' : 'en-IE',
        { day: 'numeric', month: 'short' },
    ).format(new Date(date))

    return (
        <View style={styles.screen}>
            {isLoading && chats.length === 0 ? (
                <View style={styles.centered} accessibilityRole='progressbar'>
                    <ActivityIndicator size='large' color={colors.primary} />
                    <Text style={styles.mutedText}>{t('Loading conversations…')}</Text>
                </View>
            ) : loadError && chats.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{t('Could not load conversations.')}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => void loadChats()} accessibilityRole='button'>
                        <Text style={styles.retryText}>{t('Retry')}</Text>
                    </TouchableOpacity>
                </View>
            ) : chats.length === 0 ? (
                <View style={styles.centered}>
                    <MaterialCommunityIcons name='message-text-outline' size={46} color={colors.mutedText} />
                    <Text style={[styles.heading, { marginTop: 14 }]}>{t('No conversations yet')}</Text>
                    <Text style={styles.mutedText}>{t('Start a conversation from a product you are interested in.')}</Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => void loadChats()} tintColor={colors.primary} />}
                    accessibilityLabel={t('Your conversations')}
                >
                    <Text style={styles.heading}>{t('Messages')}</Text>
                    <Text style={styles.subheading}>{t('Talk directly with buyers and sellers.')}</Text>
                    {chats.map(chat => (
                        <TouchableOpacity
                            key={chat.id}
                            style={styles.conversationRow}
                            onPress={() => navigation.navigate('ChatConversation', { chatId: chat.id })}
                            accessibilityRole='button'
                            accessibilityLabel={t('Conversation with {username} about {product}', {
                                username: chat.otherUser.username,
                                product: chat.product?.title ?? t('Unavailable product'),
                            })}
                        >
                            {chat.product?.images[0] ? (
                                <Image source={{ uri: productImageUri(chat.product.images[0]) }} style={styles.productThumbnail} />
                            ) : (
                                <View style={[styles.productThumbnail, { alignItems: 'center', justifyContent: 'center' }]}>
                                    <MaterialCommunityIcons name='image-off-outline' size={24} color={colors.mutedText} />
                                </View>
                            )}
                            <View style={styles.rowContent}>
                                <View style={styles.rowTopLine}>
                                    <Text style={styles.rowTitle} numberOfLines={1}>{chat.otherUser.username}</Text>
                                    <Text style={styles.rowDate}>{formatDate(chat.lastMessage?.date ?? chat.updatedAt)}</Text>
                                </View>
                                <Text style={styles.rowProduct} numberOfLines={1}>{chat.product?.title ?? t('Unavailable product')}</Text>
                                <Text style={styles.rowPreview} numberOfLines={1}>
                                    {chat.lastMessage?.text ?? t('No messages yet. Say hello!')}
                                </Text>
                            </View>
                            <MaterialCommunityIcons name='chevron-right' size={22} color={colors.mutedText} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    )
}

export default ChatInbox

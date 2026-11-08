import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Linking,
    Platform,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import logic from '../logic'
import type { Chat, ChatMessage, ChatOffer } from '../types/models'
import type { ChatConversationRoute, RootNavigation } from '../types/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import createChatStyles from '../styles/Chat.styles'

type TimelineItem =
    | { kind: 'message'; value: ChatMessage; timestamp: number }
    | { kind: 'offer'; value: ChatOffer; timestamp: number }

function ChatConversation() {
    const [chat, setChat] = useState<Chat | null>(null)
    const [message, setMessage] = useState('')
    const [offerAmount, setOfferAmount] = useState('')
    const [checkoutUrls, setCheckoutUrls] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loadError, setLoadError] = useState(false)
    const [syncError, setSyncError] = useState(false)
    const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null)
    const route = useRoute<ChatConversationRoute>()
    const navigation = useNavigation<RootNavigation>()
    const { language, t } = useLanguage()
    const { colors } = useTheme()
    const styles = createChatStyles(colors)
    const currentUserId = logic.getLoggedInUserId()
    const { chatId } = route.params

    const loadChat = useCallback(async () => {
        setIsLoading(true)
        setLoadError(false)
        try {
            setChat(await logic.retrieveChat(chatId))
        } catch (error) {
            console.error('Could not load conversation:', error)
            setLoadError(true)
        } finally {
            setIsLoading(false)
        }
    }, [chatId])

    useFocusEffect(useCallback(() => {
        let isActive = true
        let isRefreshing = false
        void loadChat()
        const interval = setInterval(() => {
            if (isRefreshing) return
            isRefreshing = true
            void logic.retrieveChat(chatId)
                .then(updatedChat => {
                    if (!isActive) return
                    setChat(updatedChat)
                    setSyncError(false)
                })
                .catch(error => {
                    console.error('Could not refresh conversation:', error)
                    if (isActive) setSyncError(true)
                })
                .finally(() => {
                    isRefreshing = false
                })
        }, 5000)

        return () => {
            isActive = false
            clearInterval(interval)
        }
    }, [chatId, loadChat]))

    const timeline = useMemo<TimelineItem[]>(() => {
        if (!chat) return []
        return [
            ...chat.messages.map(value => ({ kind: 'message' as const, value, timestamp: new Date(value.date).getTime() })),
            ...chat.offers.map(value => ({ kind: 'offer' as const, value, timestamp: new Date(value.date).getTime() })),
        ].sort((first, second) => first.timestamp - second.timestamp)
    }, [chat])

    const formatPrice = (amount: number) => new Intl.NumberFormat(
        language === 'es' ? 'es-ES' : 'en-IE',
        { style: 'currency', currency: 'EUR' },
    ).format(amount)

    const formatTime = (date: string) => new Intl.DateTimeFormat(
        language === 'es' ? 'es-ES' : 'en-IE',
        { hour: '2-digit', minute: '2-digit' },
    ).format(new Date(date))

    const submitMessage = async () => {
        if (!message.trim() || isSubmitting) return
        setIsSubmitting(true)
        try {
            setChat(await logic.sendChatMessage(chatId, message))
            setMessage('')
        } catch (error) {
            console.error('Could not send message:', error)
            Alert.alert(t('Error'), t('Message could not be sent. Please try again.'))
        } finally {
            setIsSubmitting(false)
        }
    }

    const submitOffer = async () => {
        const amount = Number(offerAmount.trim().replace(',', '.'))
        if (!Number.isFinite(amount) || amount <= 0 || isSubmitting) {
            Alert.alert(t('Invalid offer'), t('Enter a valid amount greater than zero.'))
            return
        }
        setIsSubmitting(true)
        try {
            setChat(await logic.createChatOffer(chatId, amount))
            setOfferAmount('')
        } catch (error) {
            console.error('Could not make offer:', error)
            Alert.alert(t('Error'), t('Offer could not be sent. Please try again.'))
        } finally {
            setIsSubmitting(false)
        }
    }

    const prepareCheckout = async (offerId: string) => {
        if (isSubmitting) return
        setIsSubmitting(true)
        try {
            const checkoutUrl = await logic.createOfferCheckout(chatId, offerId)
            if (Platform.OS === 'web') {
                setCheckoutUrls(current => ({ ...current, [offerId]: checkoutUrl }))
            } else {
                await Linking.openURL(checkoutUrl)
            }
        } catch (error) {
            console.error('Could not open secure checkout:', error)
            Alert.alert(t('Error'), t('Secure checkout could not be opened. Please try again.'))
        } finally {
            setIsSubmitting(false)
        }
    }

    const openPreparedCheckout = (checkoutUrl: string) => {
        if (Platform.OS === 'web') {
            const checkoutWindow = window.open(checkoutUrl, '_blank')
            if (!checkoutWindow) {
                window.location.assign(checkoutUrl)
                return
            }
            checkoutWindow.opener = null
            return
        }
        void Linking.openURL(checkoutUrl).catch(error => {
            console.error('Could not open secure checkout:', error)
            Alert.alert(t('Error'), t('Secure checkout could not be opened. Please try again.'))
        })
    }

    const respondToOffer = (offerId: string, decision: 'accept' | 'reject') => {
        const action = async () => {
            setIsSubmitting(true)
            try {
                setChat(await logic.respondToChatOffer(chatId, offerId, decision))
            } catch (error) {
                console.error('Could not respond to offer:', error)
                Alert.alert(t('Error'), t('Offer could not be updated. Please try again.'))
            } finally {
                setIsSubmitting(false)
            }
        }
        const title = decision === 'accept' ? t('Accept offer?') : t('Reject offer?')
        const description = decision === 'accept'
            ? t('Accepting confirms the agreed price. The buyer can then continue to secure checkout.')
            : t('The other person can send a new offer after this one is rejected.')

        if (Platform.OS === 'web') {
            if (globalThis.confirm(`${title}\n\n${description}`)) void action()
            return
        }
        Alert.alert(title, description, [
            { text: t('Cancel'), style: 'cancel' },
            { text: decision === 'accept' ? t('Accept') : t('Reject'), style: decision === 'reject' ? 'destructive' : 'default', onPress: () => void action() },
        ])
    }

    if (isLoading && !chat) {
        return (
            <View style={styles.centered} accessibilityRole='progressbar'>
                <ActivityIndicator size='large' color={colors.primary} />
                <Text style={styles.mutedText}>{t('Loading conversation…')}</Text>
            </View>
        )
    }

    if (loadError || !chat) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{t('Could not load conversation.')}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => void loadChat()} accessibilityRole='button'>
                    <Text style={styles.retryText}>{t('Retry')}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const canOffer = chat.product !== null
    const hasPendingOffer = chat.offers.some(offer => offer.status === 'pending')
    const hasAcceptedOffer = chat.offers.some(offer => offer.status === 'accepted')

    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.chatHeader}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('UserProfile', { userId: chat.otherUser.id })}
                    accessibilityRole='button'
                    accessibilityLabel={t('View {username} profile', { username: chat.otherUser.username })}
                >
                    <Text style={styles.chatHeaderTitle}>@{chat.otherUser.username}</Text>
                </TouchableOpacity>
                <Text style={styles.chatHeaderSubtitle}>
                    {chat.product?.title ?? t('Unavailable product')}
                    {chat.product ? ` · ${formatPrice(chat.product.price)}` : ''}
                </Text>
            </View>
            <ScrollView
                contentContainerStyle={styles.timeline}
                ref={scrollRef}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => void loadChat()} tintColor={colors.primary} />}
                keyboardShouldPersistTaps='handled'
                onContentSizeChange={(_width, height) => {
                    if (height > 0) timeline.length && scrollRef.current?.scrollToEnd({ animated: true })
                }}
                accessibilityLabel={t('Conversation messages')}
            >
                {timeline.length === 0 ? (
                    <Text style={styles.emptyTimeline}>{t('No messages yet. Say hello!')}</Text>
                ) : timeline.map(item => item.kind === 'message' ? (
                    <View key={`message-${item.value.id}`} style={[styles.messageBubble, item.value.from === currentUserId ? styles.ownMessage : styles.otherMessage]}>
                        <Text style={[styles.messageText, item.value.from === currentUserId && styles.ownMessageText]}>{item.value.text}</Text>
                        <Text style={[styles.messageTime, item.value.from === currentUserId && styles.ownMessageTime]}>{formatTime(item.value.date)}</Text>
                    </View>
                ) : (
                    <View key={`offer-${item.value.id}`} style={styles.offerCard}>
                        <Text style={styles.offerTitle}>
                            {item.value.offeredBy === currentUserId ? t('Your offer') : t('{username} made an offer', { username: chat.otherUser.username })}
                        </Text>
                        <Text style={styles.offerAmount}>{formatPrice(item.value.amount)}</Text>
                        <Text style={styles.offerStatus}>
                            {item.value.status === 'pending'
                                ? t('Waiting for the other person to respond.')
                                : item.value.status === 'accepted'
                                    ? t('Agreed by both people.')
                                    : t('Offer rejected.')}
                        </Text>
                        {item.value.status === 'accepted' && (
                            <>
                                <Text style={styles.paymentStatus}>
                                    {item.value.paymentStatus === 'paid'
                                        ? t('Payment confirmed. The reserved stock is now sold.')
                                        : item.value.paymentStatus === 'pending'
                                            ? t('Payment is being confirmed. This status updates securely from the payment provider.')
                                            : item.value.paymentStatus === 'creating'
                                                ? t('Preparing secure checkout…')
                                                : item.value.paymentStatus === 'expired'
                                                    ? t('Checkout expired. The reserved stock has been released.')
                                                    : item.value.paymentStatus === 'failed'
                                                        ? t('Payment was not completed. You can try checkout again.')
                                                        : t('The buyer can now pay securely to complete the purchase.')}
                                </Text>
                                {chat.product && chat.product.sellerId !== currentUserId && item.value.paymentStatus !== 'paid' && (
                                    <TouchableOpacity
                                        style={[styles.checkoutButton, isSubmitting && styles.disabledButton]}
                                        onPress={() => {
                                            const preparedUrl = checkoutUrls[item.value.id]
                                            const checkoutEnded = item.value.paymentStatus === 'expired' || item.value.paymentStatus === 'failed'
                                            if (Platform.OS === 'web' && preparedUrl && !checkoutEnded) {
                                                openPreparedCheckout(preparedUrl)
                                            } else {
                                                void prepareCheckout(item.value.id)
                                            }
                                        }}
                                        disabled={isSubmitting}
                                        accessibilityRole='button'
                                    >
                                        {isSubmitting
                                            ? <ActivityIndicator size='small' color={colors.onPrimary} />
                                            : <Text style={styles.checkoutButtonText}>
                                                {Platform.OS === 'web' && checkoutUrls[item.value.id] &&
                                                item.value.paymentStatus !== 'expired' && item.value.paymentStatus !== 'failed'
                                                    ? t('Open secure checkout')
                                                    : t('Continue to secure payment')}
                                            </Text>}
                                    </TouchableOpacity>
                                )}
                            </>
                        )}
                        {item.value.status === 'pending' && item.value.offeredBy !== currentUserId && (
                            <View style={styles.offerActions}>
                                <TouchableOpacity
                                    style={[styles.offerAction, styles.acceptButton, isSubmitting && styles.disabledButton]}
                                    onPress={() => respondToOffer(item.value.id, 'accept')}
                                    disabled={isSubmitting}
                                    accessibilityRole='button'
                                >
                                    <Text style={styles.acceptText}>{t('Accept')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.offerAction, styles.rejectButton, isSubmitting && styles.disabledButton]}
                                    onPress={() => respondToOffer(item.value.id, 'reject')}
                                    disabled={isSubmitting}
                                    accessibilityRole='button'
                                >
                                    <Text style={styles.rejectText}>{t('Reject')}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
            <View style={styles.composer}>
                {syncError && <Text style={styles.syncWarning}>{t('Messages may be out of date. Pull down to refresh.')}</Text>}
                <View style={styles.composerRow}>
                    <TextInput
                        style={styles.input}
                        value={message}
                        onChangeText={setMessage}
                        placeholder={t('Write a message…')}
                        placeholderTextColor={colors.mutedText}
                        multiline
                        maxLength={2000}
                        accessibilityLabel={t('Message input')}
                        editable={!isSubmitting}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, (!message.trim() || isSubmitting) && styles.disabledButton]}
                        onPress={() => void submitMessage()}
                        disabled={!message.trim() || isSubmitting}
                        accessibilityRole='button'
                        accessibilityLabel={t('Send message')}
                    >
                        <MaterialCommunityIcons name='send' size={19} color={colors.onPrimary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.composerRow}>
                    <TextInput
                        style={styles.offerInput}
                        value={offerAmount}
                        onChangeText={setOfferAmount}
                        placeholder={t('Amount (€)')}
                        placeholderTextColor={colors.mutedText}
                        keyboardType='decimal-pad'
                        accessibilityLabel={t('Offer amount')}
                        editable={canOffer && !hasAcceptedOffer && !isSubmitting}
                    />
                    <TouchableOpacity
                        style={[styles.offerButton, (!canOffer || hasPendingOffer || hasAcceptedOffer || !offerAmount.trim() || isSubmitting) && styles.disabledButton]}
                        onPress={() => void submitOffer()}
                        disabled={!canOffer || hasPendingOffer || hasAcceptedOffer || !offerAmount.trim() || isSubmitting}
                        accessibilityRole='button'
                    >
                        <Text style={styles.offerButtonText}>{t('Make an offer')}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.footerHint}>
                    {hasPendingOffer
                        ? t('There is a pending offer. Wait for the other person to respond.')
                        : hasAcceptedOffer
                            ? t('This offer is agreed. Complete payment securely from the accepted offer above.')
                        : t('An offer is only agreed when the other person accepts it.')}
                </Text>
            </View>
        </KeyboardAvoidingView>
    )
}

export default ChatConversation

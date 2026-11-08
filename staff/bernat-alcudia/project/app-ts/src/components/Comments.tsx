import { View, TextInput, Text, TouchableOpacity, FlatList, Animated, PanResponder, Dimensions, KeyboardAvoidingView, Platform, AccessibilityInfo } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect, useRef } from 'react';
import { errors } from 'com'



import logic from '../logic';

import Comment from './Comment';
import type { Comment as ProductComment } from '../types/models'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import createCommentsStyles from '../styles/Comments.styles'

const screenHeight = Dimensions.get('window').height || 600;

interface CommentsProps {
    visible: boolean
    onClose: () => void
    productId: string
    onCommentCreated: () => void
    onCommentDeleted: () => void
}

function Comments({ visible, onClose, productId, onCommentCreated, onCommentDeleted }: CommentsProps) {
    const { t } = useLanguage()
    const { colors } = useTheme()

    const styles = createCommentsStyles(colors)

    const panY = useRef(new Animated.Value(screenHeight)).current;
    const [commentsList, setCommentsList] = useState<ProductComment[]>([])
    const [commentsRefreshVersion, setCommentsRefreshVersion] = useState(0)
    const [comment, setComment] = useState('')
    const [text, seText] = useState('')
    const commentInputRef = useRef<React.ComponentRef<typeof TextInput>>(null)
    useEffect(() => {

        Animated.timing(panY, {
            toValue: visible ? 0 : screenHeight,
            duration: 300,
            useNativeDriver: true
        }).start(() => {
            if (visible && commentInputRef.current) {
                commentInputRef.current.focus()
            }
        })
    }, [visible]);


    const PanResponders = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (gestureResponder, gestureState) => {
            return gestureState.dy > 5;
        },
        onPanResponderMove: (gestureResponder, gestureState) => {
            panY.setValue(Math.max(0, gestureState.dy));
        },
        onPanResponderRelease: (gestureResponder, gestureState) => {
            if (gestureState.dy > 100 || gestureState.vy > 0.5) {
                Animated.timing(panY, {
                    toValue: screenHeight,
                    duration: 300,
                    useNativeDriver: true
                }).start(() => onClose());
            } else {
                Animated.timing(panY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                }).start();
            }
        }

    })

    ).current

    useEffect(() => {
        if (productId) {
            try {
                logic.retrieveComments(productId)//Retrieve all comments
                    .then(commentsList => setCommentsList(commentsList))
                    .catch(error => {
                        console.error(error)
                        const feedback = error instanceof errors.ValidationError
                            ? t('Please correct the highlighted information and try again.')
                            : t('Something went wrong. Please try again.')
                        alert(feedback)
                        AccessibilityInfo.announceForAccessibility(feedback)

                    })

            } catch (error) {
                console.error(error)
                const feedback = error instanceof errors.ValidationError
                    ? t('Please correct the highlighted information and try again.')
                    : t('Something went wrong. Please try again.')

                AccessibilityInfo.announceForAccessibility(feedback)
            }
        } else {
            setCommentsList([])
        }

    }, [productId, commentsRefreshVersion])


    const handleCreateComment = () => {
        if (!comment.trim()) {
            alert(t('Comment cannot be empty.'))
            AccessibilityInfo.announceForAccessibility(t('Comment cannot be empty.'))
            return
        }
        try {
            logic.createComment(productId, comment)//Create comment

                .then(() => {
                    AccessibilityInfo.announceForAccessibility(t('Comment added.'))
                    onCommentCreated()
                    setComment('')
                    setCommentsRefreshVersion(version => version + 1)
                })
                .catch(error => {
                    console.error(error)
                    alert(error instanceof Error ? error.message : t('Unexpected error'))
                })
        } catch (error) {
            console.error(error)

            alert(error instanceof Error ? error.message : t('Unexpected error'))
        }
    }

    return (
        <>

            {/* Overlay */}
            {visible && (
                <Animated.View
                    style={[
                        styles.overlay,
                        {
                            opacity: panY.interpolate({
                                inputRange: [0, screenHeight * 0.8],
                                outputRange: [0.5, 0],
                                extrapolate: 'clamp',
                            }),
                        },
                    ]}
                    accessible={true}
                    accessibilityLabel={t('Close comments')}
                    accessibilityRole='button'
                    onStartShouldSetResponder={() => {
                        Animated.timing(panY, {
                            toValue: screenHeight,
                            duration: 300,
                            useNativeDriver: true,
                        }).start(() => onClose());
                        return true;
                    }}
                />
            )}

            {/* Slider */}
            <Animated.View
                style={[
                    styles.slider,
                    { transform: [{ translateY: panY }] }
                ]}
                {...PanResponders.panHandlers}
                accessible={true}
                accessibilityLabel={t('Comments')}
                accessibilityRole={'menu'}
            >
                {/* Drag bar */}
                <TouchableOpacity
                    style={styles.dragBar}
                    onPress={() => {
                        Animated.timing(panY, {
                            toValue: screenHeight,
                            duration: 300,
                            useNativeDriver: true,
                        }).start(() => onClose());
                    }}
                    accessibilityLabel={t('Close comments')}
                    accessibilityRole='button'
                />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => {
                        Animated.timing(panY, {
                            toValue: screenHeight,
                            duration: 300,
                            useNativeDriver: true
                        }).start(() => onClose())
                    }} style={styles.closeButton} accessibilityLabel={t('Close comments')} accessibilityRole='button'>
                        <MaterialCommunityIcons name='chevron-down' size={30} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.title} accessibilityRole='header'>{t('Comments')}</Text>
                </View>

                {/* Content Scrollable */}
                <View style={styles.contentArea}>
                    <FlatList data={commentsList} renderItem={({ item }) => <Comment
                        item={item}
                        onCommentDeleted={() => {
                            onCommentDeleted()
                            setCommentsRefreshVersion(version => version + 1)
                        }}
                        onCommentModified={(commentId, text) => {
                            setCommentsList(current => current.map(comment =>
                                comment.id === commentId ? { ...comment, text } : comment,
                            ))
                        }}
                    />} keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.commentsList} ListEmptyComponent={() => (
                            <View style={styles.emptyListContainer}>
                                <Text style={styles.emptyListText} accessibilityLiveRegion='polite'>{t('Add the first comment')}</Text>
                            </View>
                        )} accessibilityLabel={t('List of comments')} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >
                    <View style={styles.inputContainer}>
                        <TextInput ref={commentInputRef} style={styles.input} placeholder={t('Add a comment')} value={comment} onChangeText={setComment} multiline accessibilityLabel={t('Comment input field')} accessibilityHint={t('Add a comment')} returnKeyType='send' onSubmitEditing={handleCreateComment} />
                        <TouchableOpacity style={styles.sendButton} onPress={handleCreateComment} disabled={!comment.trim()} accessibilityLabel={t('Send comment')} accessibilityState={{ disabled: !comment.trim() }}>
                            <MaterialCommunityIcons name='send' size={24} color={comment.trim() ? colors.primary : colors.border}></MaterialCommunityIcons>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Animated.View >
        </>

    )


}

export default Comments

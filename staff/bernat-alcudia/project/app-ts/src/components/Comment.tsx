import { Alert, Platform, StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native'
import { useEffect, useState } from 'react';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import logic from '../logic'
import type { Comment as ProductComment } from '../types/models'
import { useLanguage } from '../i18n/LanguageContext'

interface CommentProps {
    item: ProductComment
    onCommentDeleted: () => void
    onCommentModified: (commentId: string, text: string) => void
}

function Comment({ item: comment, onCommentDeleted, onCommentModified }: CommentProps) {
    const [showEdit, setShowEdit] = useState(false)
    const [newComment, setNewComment] = useState(comment.text)
    const { t } = useLanguage()

    useEffect(() => {
        if (!showEdit) {
            setNewComment(comment.text)
        }
    }, [comment.text, showEdit])


    const styles = StyleSheet.create({
        commentItemContainer: {
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
            paddingHorizontal: 5,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
        },
        authorInfo: {

        },
        commentAuthor: {
            fontWeight: 'bold',
            fontSize: 14,
            color: '#333',
        },
        actionButtonsContainer: {
            flexDirection: 'row',
        },
        actionButton: {
            padding: 5,
            marginLeft: 10,
        },
        commentText: {
            fontSize: 14,
            color: '#555',
            lineHeight: 20,
            paddingLeft: 5,
        },
        editContainer: {
            marginTop: 10,
        },
        textInput: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 8,
            marginBottom: 10,
            fontSize: 14,
            textAlignVertical: 'top',
        },
        editActions: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
        },
        button: {
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderRadius: 5,
            marginLeft: 10,
            alignItems: 'center',
        },
        saveButton: {
            backgroundColor: '#007bff',
        },
        cancelButton: {
            backgroundColor: '#6c757d',
        },
        buttonText: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 14,
        },
    })

    const showAlert = (message: string) => {
        Alert.alert(t('Error'), message)
    }

    const handleDeleteComment = () => {
        const removeComment = () => {
            try {
                logic.removeComment(comment.product, comment.id)
                    .then(() => {
                        onCommentDeleted()
                    })
                    .catch(error => {
                        console.error('Error deleting comment:', error)
                        showAlert(error instanceof Error ? error.message : t('Unexpected error'))
                    })
            } catch (error) {
                console.error('Caught error deleting comment:', error)
                showAlert(error instanceof Error ? error.message : t('Unexpected error'))
            }
        }

        if (Platform.OS === 'web') {
            if (globalThis.confirm(t('Are you sure you want to delete this comment?'))) removeComment()
            return
        }

        Alert.alert(t('Delete comment'), t('Are you sure you want to delete this comment?'), [
            { text: t('No'), style: 'cancel' },
            { text: t('Delete'), style: 'destructive', onPress: removeComment },
        ])
    }

    const handleCommentTextChange = (text: string) => {
        setNewComment(text)
    }

    const handleSaveModifiedComment = () => {
        const updatedText = newComment.trim()
        if (!updatedText) {
            showAlert(t('Comment cannot be blank.'))
            return
        }
        if (updatedText === comment.text) {
            setShowEdit(false)
            return
        }
        try {
            logic.modifyComment(comment.product, comment.id, updatedText)
                .then(() => {
                    onCommentModified(comment.id, updatedText)
                    setShowEdit(false)
                })
                .catch(error => {
                    console.error(error)
                    showAlert(error instanceof Error ? error.message : t('Unexpected error'))
                })
        } catch (error) {
            console.error(error)
            showAlert(error instanceof Error ? error.message : t('Unexpected error'))
        }
    }

    const handleShowEdit = () => {
        setNewComment(comment.text)
        setShowEdit(true)
    }

    const handleCancelEdit = () => {
        setShowEdit(false)
        setNewComment(comment.text)
    }

    const authorName = typeof comment.author === 'string' ? t('Username') : comment.author.username || t('Username')

    return (
        <View style={styles.commentItemContainer} accessible={true} accessibilityLabel={t('Comment by {username}', { username: authorName })}>
            <View style={styles.header}>
                <View style={styles.actionButtonsContainer}>
                    <Text style={styles.commentAuthor} accessibilityRole='header' aria-level={'3'}>{authorName}</Text>
                    {comment?.own && !showEdit && (
                        <View style={styles.actionButtonsContainer}>
                            <TouchableOpacity style={styles.actionButton} onPress={handleShowEdit} accessibilityLabel={t('Edit comment')} accessibilityRole='button'>
                                <MaterialCommunityIcons name='pencil' size={20} color='#007bff' />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={handleDeleteComment} accessibilityLabel={t('Delete comment')} accessibilityRole='button'>
                                <MaterialCommunityIcons name='trash-can-outline' size={20} color='#dc3545' />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {showEdit ? (
                    <View style={styles.editContainer}>
                        <TextInput style={styles.textInput} value={newComment} onChangeText={handleCommentTextChange} placeholder={t('Type your updated comment')} multiline numberOfLines={3} accessibilityLabel={t('Edit comment text')} />
                        <View style={styles.editActions}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancelEdit} accessibilityLabel={t('Cancel editing comment')} accessibilityRole='button'>
                                <Text style={styles.buttonText}>{t('Cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveModifiedComment} accessibilityLabel={t('Save modified comment')} accessibilityRole='button'>
                                <Text style={styles.buttonText}>{t('Save')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.commentText}>{comment?.text}</Text>
                )}
            </View>
        </View>
    )
}


export default Comment
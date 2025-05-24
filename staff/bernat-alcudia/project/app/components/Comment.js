import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import { useEffect, useState } from 'react';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import logic from '../logic'


function Comment({ item: comment }) {
    const [showEdit, setShowEdit] = useState(false)
    const [newComment, setNewComment] = useState(comment.text)

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
            paddingHorizontal: 15,
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

    const showAlert = (title, message) => {
        Alert.alert(title, message)
    }


    const handleDeleteComment = () => {
        try {
            logic.removeComment(comment.id)//Delete comment
                .then(() => {
                    showAlert('Success', 'Comment deleted successfully!')
                })
                .catch(error => {
                    console.error('Error deleting comment:', error)
                    showAlert('Error', error.message || 'Failed to delete comment')
                })

        } catch (error) {
            console.error('Caught error deleting comment:', error)

            showAlert('Error', error.message || 'An unexpected error occurred.')
        }
    }


    const handleCommentTextChange = (text) => {
        setNewComment(text)
    }

    const handleSaveModifiedComment = () => {
        if (newComment.trim() === "") {
            showAlert('Validation Error', 'Comment cannot be empty.');
            return
        }
        if (newComment.trim() === comment.text) {
            showAlert('Info', 'No changes made to the comment.');
            setShowEdit(false);
            return
        }
        handleModifiedComment()
        setShowEdit(false)
    }

    const handleModifiedComment = () => {
        try {
            logic.modifyComment(comment.id, newComment)//Modified comment
                .then(() => {
                    alert('modified comment')
                })
                .catch(error => {
                    console.error(error)

                    alert(error.message)
                })

        } catch (error) {
            console.error(error)

            alert(error.message)
        }
    }

    const handleShowEdit = () => {
        setNewComment(comment.text)
        setShowEdit(true)
    }

    const handleCancelEdit = () => {
        setShowEdit(false);
        setNewComment(comment.text)
    };



    return (
        <>
            {/* <Text>Hi world</Text> */}
            <View style={styles.commentItemContainer}>
                <View style={styles.header}>
                    <View style={styles.actionButtonsContainer}>
                        <Text style={styles.commentAuthor}>{comment?.author.username || 'User'}</Text>
                        {comment?.own && !showEdit && (
                            <View style={styles.actionButtonsContainer}>
                                <TouchableOpacity style={styles.actionButton} onPress={handleShowEdit}>
                                    <MaterialCommunityIcons name='pencil' size={20} color='#007bff' />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton} onPress={handleDeleteComment}>
                                    <MaterialCommunityIcons name={'trash-can-outline'} size={20} color={'#dc3545'} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {showEdit ? (
                        <View style={styles.editContainer}>
                            <TextInput style={styles.textInput} value={newComment} onChangeText={handleCommentTextChange} placeholder='Type new comment' multiline={true} numberOfLines={3}></TextInput>
                            <View style={styles.editActions}>
                                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancelEdit}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveModifiedComment}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                            {/* <TouchableOpacity onPress={handleModifiedComment(comment?.id, newComment)}>
                                    <MaterialCommunityIcons name='pencil' size={20} color='blue' />
                                </TouchableOpacity> */}
                        </View>

                    ) : (
                        <Text style={styles.commentText}>{comment?.text}</Text>
                    )}
                </View>

            </View>
        </>
    )

}


export default Comment
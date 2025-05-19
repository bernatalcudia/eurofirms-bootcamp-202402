import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import { useState } from 'react';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import logic from '../logic'


function Comment({ item: comment }) {
    const [showEdit, setShowEdit] = useState(false)
    const [newComment, setNewComment] = useState('')


    const styles = StyleSheet.create({
        commentItemContainer: {
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0'
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
        },
        commentAuthor: {
            fontWeight: 'bold',
            fontSize: 14,
            color: '#333'
        },
        deleteButton: {
            padding: 5
        },
        commentText: {
            fontSize: 14,
            color: '#555',
            lineHeight: 20,
        },
    })


    const handleDeleteComment = (commentId) => {
        try {
            logic.removeComment(commentId)//Delete comment
                .then(() => {
                    alert('deleted comment')
                    setTimeStamp(Date.now())
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


    const handleCommentTextChange = (text) => {
        setNewComment(text)
    }


    const handleModifiedComment = (commentId, text) => {
        try {
            logic.modifyComment(commentId, text)//Modified comment
                .then(() => {
                    handleCommentTextChange(text)
                    alert('modified comment')
                    setTimeStamp(Date.now())
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
        setShowEdit(true)
    }

    return (
        <>
            {/* <Text>Hi world</Text> */}
            <View style={styles.commentItemContainer}>
                <View>
                    <Text style={styles.commentAuthor}>{comment?.author.username || 'User'}</Text>
                    {comment?.own && <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteComment(comment.id)}>
                        <MaterialCommunityIcons name={'trash-can-outline'} size={20} color={'red'} />
                    </TouchableOpacity>}

                    {comment?.own && <TouchableOpacity onPress={handleShowEdit}>
                        <MaterialCommunityIcons name='pencil' size={20} color='blue' />
                        {showEdit &&
                            <>
                                <TextInput value={comment?.text} onChangeText={comment?.text} placeholder='type new comment'></TextInput>
                                <TouchableOpacity onPress={handleModifiedComment(comment?.id, comment?.text)}>
                                    <MaterialCommunityIcons name='pencil' size={20} color='blue' />
                                </TouchableOpacity>
                            </>
                        }
                    </TouchableOpacity>}
                </View>
                <Text style={styles.commentText}>{comment?.text}</Text>
            </View>
        </>
    )

}

export default Comment
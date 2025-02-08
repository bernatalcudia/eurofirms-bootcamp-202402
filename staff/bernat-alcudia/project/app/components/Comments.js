import { View, Image, StyleSheet, ScrollView, Button, TextInput, Alert, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect } from 'react';

import logic from '../logic';


function Comments({ visible, onClose, productId }) {

    const styles = StyleSheet.create({
        list: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        }
    })
    const [timestamp, setTimeStamp] = useState(null)
    const [commentsList, setCommentsList] = useState('')
    const [comments, setComments] = useState('')

    useEffect(() => {
        try {
            logic.retrieveComments(productId)
                .then(commentsList => setCommentsList(commentsList))
                .catch(error => {
                    console.error(error.message)

                    let feedback = error.message

                    if (error instanceof TypeError || error instanceof RangeError || error instanceof ContentError)
                        feedback = `${feedback}, please correct it`
                    else
                        feedback = 'sorry,there was an error,please try again later'
                })

        } catch (error) {
            console.error(error.message)

            let feedback = error.message

            if (error instanceof TypeError || error instanceof RangeError || error instanceof ContentError)
                feedback = `${feedback}, please correct it`
            else
                feedback = 'sorry,there was an error,please try again later'

            alert(feedback)
        }
    }, [timestamp])

    const handleCreateComment = () => {
        try {
            logic.createComment(productId, comments)

                .then(() => {
                    alert('created comment')
                    setComments('')
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

    const handleDeleteComment = (commentId) => {
        try {
            logic.removeComment(commentId)
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

    const renderItem = ({ item }) => (
        <View style={styles.list}>
            <Text>{item.author.username}</Text>
            <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                <MaterialCommunityIcons name={'trash-can-outline'} size={25} color={'red'} />
            </TouchableOpacity>
            <Text>{item.text}</Text>
        </View>
    )

    return (

        <Modal visible={visible} animationType="slide">
            <Text>{productId}</Text>
            <TouchableOpacity onPress={handleCreateComment}>
                <MaterialCommunityIcons name={'comment-plus-outline'} size={25} color={'red'} />
            </TouchableOpacity>
            <TextInput placeholder='add comment' value={comments} onChangeText={setComments}></TextInput>
            <FlatList
                data={commentsList}
                renderItem={renderItem}
                extraData={timestamp}
                keyExtractor={(item) => item.id}
            />
            <TouchableOpacity onPress={onClose}>
                <MaterialCommunityIcons name={'keyboard-backspace'} size={25} color={'black'} />
            </TouchableOpacity>
        </Modal >
    )


}

export default Comments


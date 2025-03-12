import { View, Image, StyleSheet, ScrollView, Button, TextInput, Alert, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect } from 'react';

import logic from '../logic';


function Comments({ visible, onClose, productId }) {

    const styles = StyleSheet.create({
        list: {
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            backgroundColor: 'whitesmoke',
        }, input: {
            width: '80%',
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
        }, button: {
            width: '80%',
            padding: 15,
            backgroundColor: 'black',
            borderRadius: 5,
        }, text: {
            alignSelf: 'flex-start',
            paddingLeft: 40
        }

    })
    const [timestamp, setTimeStamp] = useState(null)
    const [commentsList, setCommentsList] = useState('')
    const [comments, setComments] = useState('')
    const [text, seText] = useState('')



    useEffect(() => {
        try {
            logic.retrieveComments(productId)//Retrieve all comments
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
            logic.createComment(productId, comments)//Create comment

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

    const renderItem = ({ item }) => (
        <View style={styles.list}>
            <Text style={styles.text}>{item.author.username}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleDeleteComment(item.id)}>
                <MaterialCommunityIcons name={'trash-can-outline'} size={25} color={'red'} />
            </TouchableOpacity>
            <Text style={styles.text}>{item.text}</Text>
        </View>
    )

    return (

        <Modal visible={visible} animationType='slide' >
            <Text style={styles.text}>{productId}</Text>
            <TouchableOpacity style={styles.button} onPress={handleCreateComment}>
                <MaterialCommunityIcons name={'comment-plus-outline'} size={25} color={'red'} />
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder='add comment' value={comments} onChangeText={setComments}></TextInput>
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


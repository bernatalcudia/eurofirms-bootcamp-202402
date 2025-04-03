import { View, StyleSheet, TextInput, Text, TouchableOpacity, FlatList, Animated, PanResponder, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect, useRef } from 'react';

import logic from '../logic';


const screenHeight = Dimensions.get('window').height || 600;

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
        },
        slider: {
            position: 'absolute',
            height: screenHeight,
            width: '100%',
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 15,
            bottom: 0,
            zIndex: 1000,
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'black',
            zIndex: 999,
        },
        dragBar: {
            width: 60,
            height: 5,
            backgroundColor: '#ccc',
            borderRadius: 3,
            alignSelf: 'center',
            marginVertical: 10,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 20,
        },
        closeButton: {
            padding: 10,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            borderTopWidth: 1,
            borderTopColor: '#eee',
        },
        input: {
            flex: 1,
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 20,
            marginRight: 10,
        },
        sendButton: {
            padding: 10,
        },
        commentsContainer: {
            flex: 1,
            marginTop: 60,
            marginBottom: 80,

        },
        list: {
            paddingHorizontal: 15,
        },
        text: {
            fontSize: 16,
            marginVertical: 5,
        },

    })

    const panY = useRef(new Animated.Value(screenHeight)).current;
    const [timestamp, setTimeStamp] = useState(null)
    const [commentsList, setCommentsList] = useState([])
    const [comment, setComment] = useState('')
    const [text, seText] = useState('')

    useEffect(() => {
        if (visible) {
            Animated.timing(panY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start()
        }
    }, [visible]);


    const PanResponders = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => false,
        onPanResponderMove: Animated.event([null, { dy: panY }], { useNativeDriver: false }),
        onPanResponderRelease: (gestureResponder, gestureState) => {
            if (gestureState.dy > 50 || gestureState.vy > 0.5) {
                Animated.timing(panY, {
                    toValue: screenHeight,
                    duration: 300,
                    useNativeDriver: true
                }).start(onClose);
            } else {
                Animated.timing(panY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                }).start();
            }
        }

    })



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
            logic.createComment(productId, comment)//Create comment

                .then(() => {
                    alert('created comment')
                    setComment('')
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

    const handleCommentTextChange = (text) => {
        setComment(text)
    }

    const handleModifiedComment = (commentId, text) => {
        try {
            logic.modifyComment(commentId, text)//Modified comment
                .then(() => {
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

    //TODO Improve styles,implement slider to comments with animation and add feat modified comments and response

    return (
        <>
            <Animated.View
                style={[
                    styles.slider,
                    { transform: [{ translateY: panY }] }
                ]}
                {...PanResponders.panHandlers}
            >
                {/* Drag bar */}
                <View style={styles.dragBar} />

                {/* Slider */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <MaterialCommunityIcons name="chevron-down" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Comments</Text>
                </View>

                {/* <FlatList
                    data={commentsList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    style={styles.commentsContainer}
                /> */}
                {commentsList.map((item) => (
                    <View key={item.id} style={styles.list}>
                        <Text style={styles.text}>{item.author.username}</Text>
                        {item.own && <TouchableOpacity style={styles.button} onPress={() => handleDeleteComment(item.id)}>
                            <MaterialCommunityIcons name={'trash-can-outline'} size={25} color={'red'} />
                        </TouchableOpacity>}
                        <Text style={styles.text}>{item.text}</Text>
                    </View>
                ))}


                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add comment"
                        value={comment}
                        onChangeText={setComment}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleCreateComment}>
                        <MaterialCommunityIcons name="send" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Overlay */}
            {visible && (
                <Animated.View
                    style={[
                        styles.overlay,
                        {
                            opacity: panY.interpolate({
                                inputRange: [0, screenHeight],
                                outputRange: [0.5, 0],
                                extrapolate: 'clamp'
                            })
                        }
                    ]}
                />
            )}
        </>

    )


}

export default Comments


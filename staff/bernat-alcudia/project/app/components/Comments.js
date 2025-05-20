import { View, StyleSheet, TextInput, Text, TouchableOpacity, FlatList, Animated, PanResponder, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect, useRef } from 'react';

import logic from '../logic';

import Comment from './Comment';



const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
    },
];

const Item = ({ title }) => (
    <View >
        <Text >{title}</Text>
    </View>
);
const screenHeight = Dimensions.get('window').height || 600;

function Comments({ visible, onClose, productId }) {

    const styles = StyleSheet.create({

        slider: {
            position: 'absolute',
            height: screenHeight,
            width: '100%',
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 5,
            bottom: 0,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
        },
        dragBar: {
            width: 60,
            height: 5,
            backgroundColor: '#ccc',
            borderRadius: 3,
            alignSelf: 'center',
            marginBottom: 10,
        },

        closeButton: {
            padding: 5,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 15,
            flex: 1,
        },
        contentArea: {
            flex: 1,
            width: '100%'
        },
        commentsList: {
            paddingHorizontal: 15,
            paddingBottom: 10,
        },

        commentHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5.
        },



        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            borderTopWidth: 1,
            borderTopColor: '#eee',
            backgroundColor: 'white'
        },
        input: {
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 20,
            marginRight: 10,
            fontSize: 16,

        },

        sendButton: {
            padding: 10,
        },

        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'black',
            zIndex: 999,
        },

        emptyListContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        emptyListText: {
            fontSize: 16,
            color: '#aaa'
        },

    })

    const panY = useRef(new Animated.Value(screenHeight)).current;
    const [timestamp, setTimeStamp] = useState(null)
    const [commentsList, setCommentsList] = useState([])
    const [comment, setComment] = useState('')
    const [text, seText] = useState('')

    useEffect(() => {

        Animated.timing(panY, {
            toValue: visible ? 0 : screenHeight,
            duration: 300,
            useNativeDriver: true
        }).start()
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
        } else {
            setCommentsList([])
        }

    }, [productId, timestamp])

    //TODO Improve styles,implement slider to comments with animation and add feat modified comments and response

    const handleCreateComment = () => {
        if (!comment.trim()) return
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



    if (!visible && panY.gestureResponder.value === screenHeight) {
        return null;
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
                                outputRange: [1, 0],
                                extrapolate: 'clamp'
                            })
                        }
                    ]}
                />
            )}

            {/* Slider */}
            <Animated.View
                style={[
                    styles.slider,
                    { transform: [{ translateY: panY }] }
                ]}
                {...PanResponders.panHandlers}
            >
                {/* Drag bar */}
                <View style={styles.dragBar} />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => {
                        Animated.timing(panY, {
                            toValue: screenHeight,
                            duration: 300,
                            useNativeDriver: true
                        }).start(() => onClose())
                    }} style={styles.closeButton}>
                        <MaterialCommunityIcons name='chevron-down' size={30} color='black' />
                    </TouchableOpacity>
                    <Text style={styles.title}>Comments</Text>
                </View>

                {/* Content Scrollable */}
                <View style={styles.contentArea}>
                    <FlatList data={commentsList} renderItem={({ item }) => <Comment item={item} />} keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.commentsList} ListEmptyComponent={() => (
                            <View style={styles.emptyListContainer}>
                                <Text style={styles.emptyListText}>Add first comment!</Text>
                            </View>
                        )} />
                    {/* <Text>Hi world</Text>
                    <FlatList
                        data={DATA}
                        renderItem={({ item }) => <Item title={item.title} />}
                        keyExtractor={item => item.id}
                    /> */}
                </View>

                {/* <FlatList
                    data={commentsList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    style={styles.commentsContainer}
                /> */}
                {/* {commentsList.map((item) => (
                    <View key={item.id} style={styles.list}>
                        <Text style={styles.text}>{item.author.username}</Text>
                        {item.own && <TouchableOpacity style={styles.button} onPress={() => handleDeleteComment(item.id)}>
                            <MaterialCommunityIcons name={'trash-can-outline'} size={25} color={'red'} />
                        </TouchableOpacity>}
                        <Text style={styles.text}>{item.text}</Text>
                    </View>
                ))} */}


                {/* <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Add comment'
                        value={comment}
                        onChangeText={setComment}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleCreateComment}>
                        <MaterialCommunityIcons name='send' size={24} color='black' />
                    </TouchableOpacity>
                </View> */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder='Add a comment' value={comment} onChangeText={setComment} multiline />
                        <TouchableOpacity style={styles.sendButton} onPress={handleCreateComment} disabled={!comment.trim()}>
                            <MaterialCommunityIcons name='send' size={24} color={comment.trim() ? 'black' : '#ccc'}></MaterialCommunityIcons>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Animated.View >
        </>

    )


}

export default Comments


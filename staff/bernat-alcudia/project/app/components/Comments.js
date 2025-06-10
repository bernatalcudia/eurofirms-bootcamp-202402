import { View, StyleSheet, TextInput, Text, TouchableOpacity, FlatList, Animated, PanResponder, Dimensions, KeyboardAvoidingView, Platform, AccessibilityInfo } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect, useRef } from 'react';

import logic from '../logic';

import Comment from './Comment';

const screenHeight = Dimensions.get('window').height || 600;

function Comments({ visible, onClose, productId, onCommentCreated, onCommentDeleted }) {

    const styles = StyleSheet.create({

        slider: {
            position: 'absolute',
            height: screenHeight,
            height: '85%',
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
            paddingVertical: 10,
            paddingHorizontal: 20
        },

        closeButton: {
            padding: 5,
            paddingRight: 15,
            paddingVertical: 10
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 15,
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        contentArea: {
            flex: 1,
            width: '100%'
        },
        commentsList: {
            paddingHorizontal: 15,
            paddingBottom: 10,
            flexGrow: 1
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
            color: '#333'

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
            marginTop: 50
        },
        emptyListText: {
            fontSize: 16,
            color: '#aaa'
        },

    })

    const panY = useRef(new Animated.Value(screenHeight)).current;
    const [commentsList, setCommentsList] = useState([])
    const [comment, setComment] = useState('')
    const [text, seText] = useState('')
    const commentInputRef = useRef(null)

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
                        console.error(error.message)

                        let feedback = error.message

                        if (error instanceof TypeError || error instanceof RangeError || error instanceof ContentError)
                            feedback = `${feedback}, please correct it`
                        else {
                            feedback = 'sorry,there was an error,please try again later'
                        }
                        alert(feedback)
                        AccessibilityInfo.announceForAccessibility(feedback)

                    })

            } catch (error) {
                console.error(error.message)

                let feedback = error.message

                if (error instanceof TypeError || error instanceof RangeError || error instanceof ContentError)
                    feedback = `${feedback}, please correct it`
                else
                    feedback = 'sorry,there was an error,please try again later'

                AccessibilityInfo.announceForAccessibility(feedback)
            }
        } else {
            setCommentsList([])
        }

    }, [productId, commentsList])


    const handleCreateComment = () => {
        if (!comment.trim()) {
            alert('Comment field is empty')
            AccessibilityInfo.announceForAccessibility('Comment field is empty')
            return
        }
        try {
            logic.createComment(productId, comment)//Create comment

                .then(() => {
                    alert('comment created')
                    AccessibilityInfo.announceForAccessibility('comment created')
                    onCommentCreated()
                    setComment('')
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

    if (!visible && panY.__getValue() === screenHeight) {
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
                                outputRange: [0.5, 0],
                                extrapolate: 'clamp',
                            }),
                        },
                    ]}
                    accessible={true}
                    accessibilityLabel='Tap to close comments'
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
                accessibilityLabel={'Comments section,drag down to close'}
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
                    accessibilityLabel='Drag bar. Tap to close comments.'
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
                    }} style={styles.closeButton} accessibilityLabel='Close comments' accessibilityRole='button'>
                        <MaterialCommunityIcons name='chevron-down' size={30} color='black' />
                    </TouchableOpacity>
                    <Text style={styles.title} accessibilityRole='header'>Comments</Text>
                </View>

                {/* Content Scrollable */}
                <View style={styles.contentArea}>
                    <FlatList data={commentsList} renderItem={({ item }) => <Comment item={item} onCommentDeleted={onCommentDeleted} />} keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.commentsList} ListEmptyComponent={() => (
                            <View style={styles.emptyListContainer}>
                                <Text style={styles.emptyListText} accessibilityLiveRegion='polite'>Add first comment!</Text>
                            </View>
                        )} accessibilityLabel='List of comments' />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >
                    <View style={styles.inputContainer}>
                        <TextInput ref={commentInputRef} style={styles.input} placeholder='Add a comment' value={comment} onChangeText={setComment} multiline accessibilityLabel='Comment input field' accessibilityHint='Type your comment here' returnKeyType='send' onSubmitEditing={handleCreateComment} />
                        <TouchableOpacity style={styles.sendButton} onPress={handleCreateComment} disabled={!comment.trim()} accessibilityLabel={comment.trim() ? 'Send comment' : 'Send comment button,disabled'} >
                            <MaterialCommunityIcons name='send' size={24} color={comment.trim() ? 'black' : '#ccc'}></MaterialCommunityIcons>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Animated.View >
        </>

    )


}

export default Comments


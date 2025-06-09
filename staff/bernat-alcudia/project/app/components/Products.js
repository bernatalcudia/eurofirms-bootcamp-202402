import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import logic from '../logic';

import Comments from './Comments';

function Products({ searchQuery }) {
    const [products, setProducts] = useState([])
    const [user, setUser] = useState()

    const [commentsProductId, setCommentsProductId] = useState('')
    const [viewComments, setViewComments] = useState(false)

    const navigation = useNavigation()




    useEffect(() => {
        try {
            if (!logic.isUserLoggedIn()) {
                navigation.navigate('LoginUser')
                return
            }
            logic.retrieveUser() //Return Users
                .then(user => setUser(user))
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
    }, [products])

    const handleShowProductComments = (productId) => {
        setCommentsProductId(productId)
        setViewComments(true)
    }

    const returnFromComments = () => {
        setCommentsProductId('')
        setViewComments(false)
    }

    const handleLogout = () => {
        logic.logoutUser()

        navigation.navigate('LoginUser')
    }

    const handleProductDetail = id => {
        navigation.navigate('ProductDetail', { id: id })
    }


    const handleToggleSavedProduct = (productId) => {
        try {
            logic.toggleSavedProduct(productId)
                .then(() => refreshProducts())
                .catch(error => {
                    console.error(error)

                    alert(error.message)
                })
        } catch (error) {
            console.error(error)

            alert(error.message)
        }
    }
    const handleToggleLikeProduct = (productId) => {
        try {
            logic.toggleLikeProduct(productId)
                .then(() => refreshProducts())
                .catch(error => {
                    console.error(error)

                    alert(error.message)
                })
        } catch (error) {
            console.error(error)

            alert(error.message)
        }
    }

    const handleCommentCreated = () => {
        refreshProducts()
    }

    const handleCommentDeleted = () => {
        refreshProducts()
    }

    const searchProducts = searchQuery => {
        try {
            logic.searchProducts(searchQuery) //I return the products searched
                .then(products => {
                    setProducts(products)
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

    const refreshProducts = () => {
        try {
            logic.retrieveProducts() //I return the products
                .then(products => setProducts(products))
                .catch(error => {
                    console.error(error)

                    alert(error.message)
                })
        } catch (error) {
            console.error(error)

            alert(error.message)
        }
    }

    useFocusEffect(useCallback(() => {
        searchQuery === '' ? refreshProducts() : searchProducts(searchQuery)
    }, [searchQuery]))



    const styles = StyleSheet.create({

        commentsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        commentsCountText: {
            fontSize: 16,
            color: '#333333',
            fontWeight: '500',
        },
        mainContainer: {
            flex: 1,
            backgroundColor: '#f4f6f8',
            justifyContent: 'center',
            alignItems: 'center'
        },
        productContainer: {
            padding: 20,
            marginBottom: 15,
            backgroundColor: '#ffffff',
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
            flex: 1,
        },
        input: {
            width: '80%',
            padding: 10,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            alignSelf: 'center'
        },
        productImage: {
            width: 300,
            height: 300,
            borderRadius: 10,
            // marginLeft: 30,
            // backgroundColor: '#e0e0e0'

        },
        productInfoContainer: {
            marginBottom: 12,
        },
        productTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333333',
            marginBottom: 4,
        },
        productBrand: {
            fontSize: 14,
            color: '#555555',
            marginBottom: 4,
        },
        productPrice: {
            fontSize: 16,
            fontWeight: '600',
            color: '#00796b',
            marginBottom: 4,
        },
        productState: {
            fontSize: 14,
            color: '#777777',
            fontStyle: 'italic',
        },
        actionsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: '#eeeeee',
        },
        likeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        likeCountText: {
            fontSize: 16,
            color: '#333333',
            fontWeight: '500',
        },
        buttonPressIn: {
            transform: [{ scale: 1.00 }]
        },
        button: { justifyContent: 'center' },
        buttonText: { fontSize: 18, textAlign: 'center', color: 'black' }
    });

    return (
        <View style={styles.mainContainer}>

            <ScrollView >

                <View style={{ paddingLeft: 8, paddingRight: 8, width: '100%', height: 25, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={handleLogout}>
                        <MaterialCommunityIcons name='door' size={25} color={'black'} />
                    </TouchableOpacity>
                </View>


                {/* <FlatList data={products}
            renderItem={({ item: product }) => {
                <View style={styles.productContainer} key={product.id}>
                    <Image style={styles.image} source={{ uri: 'data:image/png;base64,' + product.images[0] }} onError={(error) => console.error('Error loading image:', error)} />

                    <View style={{ padding: 8 }}>

                        <TouchableOpacity style={{ paddingTop: 5 }} onPress={() => handleProductDetail(product.id)}>
                            <Text >{product.title}</Text>
                        </TouchableOpacity>
                        <Text >{product.brand}</Text>
                        <Text >Price: ${product.price}</Text>
                        <Text>State: {product.state}</Text>
                        <TouchableOpacity onPress={() => handleToggleComment(product.id)}>
                            <Text>Comments</Text>
                        </TouchableOpacity>


                        {toggleComments === product.id && <Comments productId={product.id} visible={viewComments} onClose={() => returnFromComment()}></Comments>}
                    </View>
                    <View style={{ padding: 8, flexDirection: 'row', flex: 1, width: '100%', height: 40, justifyContent: 'space-between' }}>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity style={isLiked ? styles.button : styles.buttonPressIn} onPressOut={() => handleToggleLikeProduct(product.id)} >
                                <MaterialCommunityIcons name={isLiked ? 'heart' : 'heart-outline'} size={25} color={'red'} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 20 }}  >{product.likes.length}</Text>
                        </View>
                        <TouchableOpacity style={isSaved ? styles.button : styles.buttonPressIn} onPressOut={() => handleToggleSavedProduct(product.id)} >
                            <MaterialCommunityIcons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={25} color={'blue'} />
                        </TouchableOpacity>
                    </View>
                </View>
            }}
            keyExtractor={product => { product.id.toString() }} >

        </FlatList> */}
                {products.map(product => {
                    const isLiked = product.likes.includes(logic.getLoggedInUserId())
                    const isSaved = user?.saved.includes(product.id)
                    return (
                        <View style={styles.productContainer} key={product.id} >

                            <Image style={styles.productImage} source={{ uri: 'data:image/png;base64,' + product.images[0] }} onError={(error) => console.error('Error loading image:', error)} />

                            <View style={styles.productInfoContainer} key={product.id}>

                                <TouchableOpacity onPress={() => handleProductDetail(product.id)}>
                                    <Text style={styles.productTitle} >{product.title}</Text>
                                </TouchableOpacity>
                                <Text style={styles.productBrand} >{product.brand}</Text>
                                <Text style={styles.productPrice} >Price: {product.price}€</Text>
                                <Text style={styles.productState}>State: {product.state}</Text>


                            </View>
                            <View style={styles.actionsContainer}>
                                <View style={styles.likeContainer}>
                                    <TouchableOpacity style={isLiked ? styles.button : styles.buttonPressIn} onPressOut={() => handleToggleLikeProduct(product.id)} >
                                        <MaterialCommunityIcons name={isLiked ? 'heart' : 'heart-outline'} size={25} color={'red'} />
                                    </TouchableOpacity>
                                    <Text style={styles.likeCountText}  >{product.likes.length}</Text>
                                </View>
                                <View style={styles.commentsContainer}>
                                    <TouchableOpacity onPress={() => handleShowProductComments(product.id)} style={styles.commentsSection}>
                                        <MaterialCommunityIcons name='comment-multiple-outline' size={25} color='#607d8b' />
                                    </TouchableOpacity>
                                    <Text style={styles.commentsCountText} >{product.commentCount}</Text>
                                </View>
                                <TouchableOpacity style={isSaved ? styles.button : styles.buttonPressIn} onPressOut={() => handleToggleSavedProduct(product.id)} >
                                    <MaterialCommunityIcons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={25} color={'blue'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                })}
            </ScrollView >

            {/* OVERLAY */}

            {
                commentsProductId && (
                    <Comments
                        productId={commentsProductId}
                        visible={viewComments}
                        onClose={returnFromComments}
                        onCommentCreated={handleCommentCreated}
                        onCommentDeleted={handleCommentDeleted}
                    />
                )
            }

        </View >
    );
};

export default Products
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { errors } from 'com'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import logic from '../logic';

import Comments from './Comments';
import type { Product, User } from '../types/models'
import type { TabNavigation } from '../types/navigation'

interface ProductsProps {
    searchQuery: string
}

function Products({ searchQuery }: ProductsProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [user, setUser] = useState<User>()

    const [commentsProductId, setCommentsProductId] = useState('')
    const [viewComments, setViewComments] = useState(false)

    const navigation = useNavigation<TabNavigation>()



    useEffect(() => {
        if (!logic.isUserLoggedIn()) {
            navigation.navigate('LoginUser')
            return
        }
        try {
            logic.retrieveUser() //Return Users
                .then(user => setUser(user))
                .catch(error => {
                    console.error(error)
                    let feedback = error instanceof Error ? error.message : 'Unexpected error'

                    if (error instanceof errors.ValidationError)
                        feedback = `${feedback}, please correct it`
                    else
                        feedback = 'sorry,there was an error,please try again later'
                })

        } catch (error) {
            console.error(error)
            let feedback = error instanceof Error ? error.message : 'Unexpected error'

            if (error instanceof errors.ValidationError)
                feedback = `${feedback}, please correct it`
            else
                feedback = 'sorry,there was an error,please try again later'

            alert(feedback)
        }
    }, [])

    const handleShowProductComments = (productId: string) => {
        setCommentsProductId(productId)
        setViewComments(true)
    }

    const returnFromComments = () => {
        setCommentsProductId('')
        setViewComments(false)
    }

    const handleProductDetail = (id: string) => {
        navigation.navigate('ProductDetail', { id })
    }


    const handleToggleSavedProduct = (productId: string) => {
        try {
            logic.toggleSavedProduct(productId)
                .then(() => {
                    setUser(current => {
                        if (!current) return current
                        const saved = current.saved ?? []
                        return {
                            ...current,
                            saved: saved.includes(productId)
                                ? saved.filter(id => id !== productId)
                                : [...saved, productId],
                        }
                    })
                    refreshProducts()
                })
                .catch(error => {
                    console.error(error)

                    alert(error instanceof Error ? error.message : 'Unexpected error')
                })
        } catch (error) {
            console.error(error)

            alert(error instanceof Error ? error.message : 'Unexpected error')
        }
    }
    const handleToggleLikeProduct = (productId: string) => {
        try {
            logic.toggleLikeProduct(productId)
                .then(() => refreshProducts())
                .catch(error => {
                    console.error(error)

                    alert(error instanceof Error ? error.message : 'Unexpected error')
                })
        } catch (error) {
            console.error(error)

            alert(error instanceof Error ? error.message : 'Unexpected error')
        }
    }

    const handleCommentCreated = () => {
        refreshProducts()
    }

    const handleCommentDeleted = () => {
        refreshProducts()
    }

    const searchProducts = (searchQuery: string) => {
        try {
            logic.searchProducts(searchQuery) //I return the products searched
                .then(products => {
                    setProducts(products)
                })
                .catch(error => {
                    console.error(error)

                    alert(error instanceof Error ? error.message : 'Unexpected error')
                })
        } catch (error) {
            console.error(error)

            alert(error instanceof Error ? error.message : 'Unexpected error')
        }
    }

    const refreshProducts = () => {
        try {
            logic.retrieveProducts() //I return the products
                .then(products => setProducts(products))
                .catch(error => {
                    console.error(error)

                    alert(error instanceof Error ? error.message : 'Unexpected error')
                })
        } catch (error) {
            console.error(error)

            alert(error instanceof Error ? error.message : 'Unexpected error')
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
            alignItems: 'center',
            paddingTop: 20,
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
            width: '100%',
            height: 300,
            borderRadius: 10,
            backgroundColor: '#e0e0e0',
            resizeMode: 'cover',

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
            transform: [{ scale: 0.95 }]
        },
        button: {
            justifyContent: 'center',
            padding: 5
        },

        buttonText: { fontSize: 18, textAlign: 'center', color: 'black' }
    });

    return (
        <View style={styles.mainContainer}>

            <ScrollView >


                {products.map(product => {
                    const isLiked = product.liked ?? product.likes?.includes(logic.getLoggedInUserId()) ?? false
                    const isSaved = user?.saved?.includes(product.id) ?? false
                    const likeCount = product.likeCount ?? product.likes?.length ?? 0
                    const accessibilityImageLabel = product.images[0] ? `Product image: ${product.title}` : 'No image available for this product.'

                    return (
                        <View style={styles.productContainer} key={product.id} >

                            <Image style={styles.productImage} source={{ uri: 'data:image/png;base64,' + product.images[0] }} onError={(error) => console.error('Error loading image:', error)} accessibilityLabel={accessibilityImageLabel} />

                            <View style={styles.productInfoContainer} key={product.id}>

                                <TouchableOpacity onPress={() => handleProductDetail(product.id)} accessibilityLabel={`View details for product ${product.title}`} accessibilityRole='button'>
                                    <Text style={styles.productTitle} >{product.title}</Text>
                                </TouchableOpacity>
                                <Text style={styles.productBrand} accessibilityLabel={`Brand: ${product.brand}`} >{product.brand}</Text>
                                <Text style={styles.productPrice} accessibilityLabel={`Price: ${product.price} euros`}>Price: {product.price}€</Text>
                                <Text style={styles.productState} accessibilityLabel={`Condition: ${product.state}`}>State: {product.state}</Text>

                            </View>
                            <View style={styles.actionsContainer}>
                                <View style={styles.likeContainer}>
                                    <TouchableOpacity style={isLiked ? styles.button : styles.buttonPressIn} onPressOut={() => handleToggleLikeProduct(product.id)} accessibilityLabel={isLiked ? `Unlike ${product.title}. Currently has ${likeCount} likes.` : `Like ${product.title}. Currently has ${likeCount} likes.`} accessibilityRole='button' accessibilityState={{ checked: isLiked }}>
                                        <MaterialCommunityIcons name={isLiked ? 'heart' : 'heart-outline'} size={25} color={'red'} />
                                    </TouchableOpacity>
                                    <Text style={styles.likeCountText} accessibilityLabel={`${likeCount} likes`} >{likeCount}</Text>
                                </View>
                                <View style={styles.commentsContainer} accessibilityLabel={`View comments for product ${product.title}. Has ${product.commentCount} comments.`} accessibilityRole='button'>
                                    <TouchableOpacity onPress={() => handleShowProductComments(product.id)}>
                                        <MaterialCommunityIcons name='comment-multiple-outline' size={25} color='#607d8b' />
                                    </TouchableOpacity>
                                    <Text style={styles.commentsCountText} accessibilityLabel={`${product.commentCount ?? 0} comments`} >{product.commentCount ?? 0} </Text>
                                </View>
                                <TouchableOpacity style={isSaved ? styles.button : styles.buttonPressIn} onPressOut={() => handleToggleSavedProduct(product.id)} accessibilityLabel={isSaved ? `Unsave ${product.title}` : `Save ${product.title}`} accessibilityRole='button' accessibilityState={{ checked: isSaved }} >
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
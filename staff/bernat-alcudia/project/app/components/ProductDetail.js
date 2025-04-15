import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, Alert, TouchableOpacity, Dimensions } from 'react-native';
import logic from '../logic';
import { utils } from '../com'
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    imageContainer: {
        flexDirection: 'row'
    },

    imageScrollView: {
        height: screenWidth,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    image: {
        width: screenWidth,
        height: screenWidth,
        marginRight: 10,
        resizeMode: 'cover',
        borderRadius: 15,
    },
    infoContainer: {
        padding: 16,
    },
    detailsRow: {
        marginBottom: 12,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 8,
    },
    detailItem: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
        lineHeight: 22,
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
        marginBottom: 16,
    },
    lastModified: {
        fontSize: 14,
        color: '#999',
        marginBottom: 16,
        textAlign: 'right',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginTop: 10,
    },
    actionButton: {
        padding: 8,
        marginLeft: 12,
    },
    modifyIcon: {
        fontSize: 26,
        color: '#09b1ba',
    },
    deleteIcon: {
        fontSize: 26,
        color: '#e74c3c',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    loadingText: {
        fontSize: 16,
        color: '#888',
    }
});


function ProductDetail() {
    const [product, setProduct] = useState(null)


    const navigation = useNavigation()

    const route = useRoute()

    const { id: productId } = route.params

    const handleDeleteProduct = () => {
        Alert.alert('Confirm delete product', 'Are you sure you want to delete this product?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                onPress: () => {
                    try {
                        logic.removeProduct(productId)
                            .then(() => navigation.navigate('tabs'))
                            .catch(error => {
                                console.error(error)

                                alert(error.message)
                            })
                    } catch (error) {
                        console.error(error)

                        alert(error.message)
                    }
                },
                style: 'destructive',
            },
        ])
    }

    const handleModifyProductDetail = () => {
        navigation.navigate('ModifyProduct', { id: productId })
    }

    const showProductDetails = () => {
        try {
            logic.retrieveProductDetails(productId)
                .then(product => {
                    setProduct(product)
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


    useEffect(() => {
        showProductDetails()
    }, [])

    if (!product) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading details product...</Text>
            </View>
        );
    }

    const isAuthor = product.author.id === logic.getLoggedInUserId()

    return <ScrollView style={styles.container}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            <View style={styles.imageContainer} key={product.id} >
                {product.images.map((image, index) => (
                    <Image key={index} source={{ uri: 'data:image/png;base64,' + image }} style={styles.image} onError={(error) => console.error('Error loading image:', error)} />
                ))}
            </View>
        </ScrollView>
        <View style={styles.infoContainer}>
            <View style={styles.detailsRow}>
                <Text style={styles.price}>Price: ${product.price}</Text>
                <Text style={styles.lastModified}>Last Modified:{utils.formatDate(new Date(product.date))}</Text>
                <Text style={styles.title}>Title: {product.title}</Text>
                <Text style={styles.detailItem}>Brand: {product.brand}</Text>
                <Text style={styles.detailItem}>State: {product.state}</Text>
                <Text style={styles.detailItem}>Stock: {product.stock}</Text>
                <Text style={styles.description}>Description: {product.description} </Text>
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleModifyProductDetail}>
                        {isAuthor && <MaterialCommunityIcons style={styles.modifyIcon} name='pencil' size={25} color={'black'} />}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={handleDeleteProduct}>
                        {isAuthor && <MaterialCommunityIcons style={styles.deleteIcon} name='trash-can-outline' size={25} color={'black'} />}
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    </ScrollView >


};

export default ProductDetail
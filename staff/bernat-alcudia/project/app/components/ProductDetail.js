import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, Alert, TouchableOpacity, Dimensions } from 'react-native';
import logic from '../logic';
import { utils } from '../com'
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const screenWidth = Dimensions.get('window').width;

const colors = {
    primary: '#00b2bd',
    background: '#ffffff',
    textPrimary: '#1a1a1a',
    textSecondary: '#5a5a5a',
    border: '#e0e0e0',
    danger: '#e74c3c',
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    imageScrollView: {
        height: screenWidth,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    imageContainer: {
        flexDirection: 'row'
    },
    infoSection: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    infoSectionLast: {
        borderBottomWidth: 0,
    },

    image: {
        width: screenWidth,
        height: screenWidth,
        marginRight: 10,
        resizeMode: 'cover',
        borderRadius: 15,
    },
    infoContainer: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    detailsRow: {
        marginBottom: 12,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    detailItem: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 4,
        lineHeight: 22,
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: colors.textSecondary,
        lineHeight: 24,
        marginTop: 8,
    },
    lastModified: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 8,
        textAlign: 'left',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 16,
    },
    actionButton: {
        padding: 8,
        marginLeft: 16,
    },
    modifyIcon: {
        fontSize: 24,
        color: colors.primary,
    },
    deleteIcon: {
        fontSize: 26,
        color: colors.danger,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 12,
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
    }, [productId])

    if (!product) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading details product...</Text>
            </View>
        );
    }

    const isAuthor = product.author.id === logic.getLoggedInUserId()

    return (
        <ScrollView style={styles.container}>

            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageScrollView}>

                <View style={styles.imageContainer} key={product.id} >
                    {product.images.map((image, index) => (
                        <Image key={index} source={{ uri: 'data:image/png;base64,' + image }} style={styles.image} onError={(error) => console.error('Error loading image:', error)} />
                    ))}
                </View>
            </ScrollView>

            <View style={styles.infoContainer}>

                <View style={styles.infoSection}>
                    <Text style={styles.price}>Price: ${product.price}</Text>
                    <Text style={styles.lastModified}>Last Modified:{utils.formatDate(new Date(product.date))}</Text>
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.title}>Title: {product.title}</Text>
                    <Text style={styles.description}>Description: {product.description} </Text>
                </View>

                <View style={[styles.infoSection, styles.infoSectionLast]}>
                    <Text style={styles.detailItem}>Brand: {product.brand}</Text>
                    <Text style={styles.detailItem}>State: {product.state}</Text>
                    <Text style={styles.detailItem}>Stock: {product.stock}</Text>
                </View>

                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleModifyProductDetail}>
                        {isAuthor && <MaterialCommunityIcons style={styles.modifyIcon} name='pencil' size={25} color={'blue'} />}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={handleDeleteProduct}>
                        {isAuthor && <MaterialCommunityIcons style={styles.deleteIcon} name='trash-can-outline' size={25} color={'red'} />}
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView >
    )
};

export default ProductDetail
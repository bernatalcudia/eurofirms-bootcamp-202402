import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, Alert, TouchableOpacity, Dimensions } from 'react-native';
import logic from '../logic';
import { utils } from '../com'
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,

    },
    productCard: {
        margin: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageScrollView: {
        height: screenWidth,
        marginBottom: 15,
        // padding: 15
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        width: screenWidth - 30,
        height: screenWidth - 30,
        borderRadius: 10,
        marginRight: 0,
        resizeMode: 'cover',
        marginLeft: 10,
    },
    infoContainer: {
        paddingHorizontal: 5,
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingVertical: 2,
    },
    detailLabel: {
        fontSize: 15,
        color: '#555',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 15,
        color: '#333',
        flexShrink: 1,
        textAlign: 'right',
    },
    dateText: {
        fontSize: 12,
        color: '#888',
        marginBottom: 5,
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 8,
        textAlign: 'center',
    },
    brandText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
        textAlign: 'center',
    },
    priceText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: 10,
        textAlign: 'center',
    },
    stateText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#777',
        marginBottom: 5,
        textAlign: 'center',
    },
    stockText: {
        fontSize: 14,
        color: '#777',
        marginBottom: 10,
        textAlign: 'center',
    },
    descriptionText: {
        fontSize: 15,
        color: '#444',
        lineHeight: 22,
        marginTop: 10,
        textAlign: 'justify',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: 15,
    },
    actionButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#e9ecef',

    },
    modifyIcon: {
        fontSize: 26,
        color: '#007bff',
    },
    deleteIcon: {
        fontSize: 26,
        color: '#dc3545',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        fontSize: 16,
        marginTop: 12,
        color: '#555',
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
                accessibilityLabel: 'Cancel deletion',
                accessibilityHint: 'Cancels the product deletion process and returns to product details'
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
                accessibilityLabel: 'Confirm delete product',
                accessibilityHint: 'Deletes the product permanently and navigates back to the main screen.',
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
            <View style={styles.loadingContainer} accessible={true} accessibilityLabel='Loading product details' accessibilityRole='alert' >
                <Text style={styles.loadingText}>Loading details product...</Text>
            </View>
        );
    }

    const isAuthor = product.author.id === logic.getLoggedInUserId()

    return (
        <View style={styles.mainContainer} accessible={true}>
            <ScrollView accessibilityLabel='Product details scroll view' accessibilityHint='Scrolls to view more product information.'>
                <View style={styles.productCard}>
                    <ScrollView horizontal style={styles.imageScrollView} accessibilityLabel='Product images' accessibilityHint={`Scrolls horizontally to view ${product.images.length} product images.`}  >

                        <View style={styles.imageContainer} key={product.id} accessible={true} accessibilityLabel='Product image gallery' >
                            {product.images.map((image, index) => (
                                <Image key={index} source={{ uri: 'data:image/png;base64,' + image }} style={styles.productImage} onError={(error) => console.error('Error loading image:', error)} accessible={true} accessibilityLabel={`${product.title} image ${index + 1} of ${product.images.length}`} accessibilityRole='image' />
                            ))}
                        </View>
                    </ScrollView>

                    <View style={styles.infoContainer}>
                        <Text style={styles.dateText} accessible={true} accessibilityLabel={`Last modified on ${utils.formatDate(new Date(product.date))}`}>Last Modified: {utils.formatDate(new Date(product.date))}</Text>
                        <Text style={styles.titleText} accessible={true} accessibilityRole='header' accessibilityLabel={`Product name: ${product.title}`}>{product.title}</Text>
                        <Text style={styles.brandText} accessible={true} accessibilityLabel={`Brand: ${product.brand}`} >{product.brand}</Text>
                        <Text style={styles.priceText} accessible={true} accessibilityLabel={`Price: ${product.price} euros`} accessibilityValue={{ text: `${product.price} euros` }}>{product.price}€</Text>
                        <Text style={styles.stateText} accessible={true} accessibilityLabel={`Condition: ${product.state}`}>Condition: {product.state}</Text>
                        <Text style={styles.stockText} accessible={true} accessibilityLabel={product.stock > 0 ? `Availability: ${product.stock} in stock` : 'Availability: Out of Stock'} accessibilityValue={{ text: product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock' }}>Availability: {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}</Text>
                        <Text style={styles.descriptionText} accessible={true} accessibilityLabel={`Product description: ${product.description}`}>{product.description}</Text>
                    </View>

                    {isAuthor && (
                        <View style={styles.actionButtonsContainer}>
                            <TouchableOpacity style={styles.actionButton} onPress={handleModifyProductDetail} accessible={true} accessibilityLabel='Modify product' accessibilityHint='Activates to edit product details.' accessibilityRole='button'>
                                <MaterialCommunityIcons style={styles.modifyIcon} name='pencil' />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={handleDeleteProduct} accessible={true} accessibilityLabel='Delete product' accessibilityHint='Activates to remove this product.' accessibilityRole='button'>
                                <MaterialCommunityIcons style={styles.deleteIcon} name='trash-can-outline' />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView >
        </View>
    )
};

export default ProductDetail
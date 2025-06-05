import logic from '../logic';
import React, { useEffect, useState } from 'react';
import { utils } from '../com'
import { View, Text, Image, StyleSheet, ScrollView, Button } from 'react-native';

const styles = StyleSheet.create({

    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    productContainer: {
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,

    },

    imagesScrollViewContainer: {
        marginBottom: 15,
    },


    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginLeft: 10,
        alignSelf: 'center'
    },
    dateText: {
        fontSize: 12,
        color: '#888',
        marginBottom: 5,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    brandText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green',
        marginBottom: 5,
    },
    stateText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#666',
        marginBottom: 3,
    },
    stockText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    descriptionText: {
        fontSize: 14,
        color: '#333',
        marginTop: 10,
    },
});

function RetrieveSavedProducts() {
    const [products, setProducts] = useState([])



    useEffect(() => {
        showSavedProducts()
    }, [products])


    const showSavedProducts = () => {
        try {
            logic.retrieveUserProductSaved()
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


    if (products.length === 0) {
        return (
            <View style={styles.centeredContainer}>
                <Text>You have no saved products yet. 🛍️</Text>
            </View>
        );
    }



    if (!products) return null

    return (
        <View>
            <ScrollView >
                {products.map(product => {
                    return <View key={product.id} style={styles.productContainer} >
                        <ScrollView horizontal style={styles.imagesScrollViewContainer}>

                            {product.images.map((image, index) => (
                                <Image key={index} source={{ uri: 'data:image/png;base64,' + image }} style={styles.image} onError={(error) => console.error('Error loading image:', error)} />
                            ))}

                        </ScrollView>
                        <View >
                            <Text style={styles.dateText}>{utils.formatDate(new Date(product.date))}</Text>
                            <Text style={styles.titleText}>{product.title}</Text>
                            <Text style={styles.brandText}>{product.brand}</Text>
                            <Text style={styles.priceText}>{product.price}€</Text>
                            <Text style={styles.stateText}>{product.state}</Text>
                            <Text style={styles.stockText}>{product.stock}</Text>
                            <Text style={styles.descriptionText}>{product.description}</Text>
                        </View>
                    </View>

                })}
            </ScrollView >
        </View>
    )
}

export default RetrieveSavedProducts
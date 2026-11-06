import logic from '../logic';
import React, { useEffect, useState } from 'react';
import { utils } from 'com'
import { ActivityIndicator, View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import type { Product } from '../types/models'
import { useLanguage } from '../i18n/LanguageContext'

const styles = StyleSheet.create({

    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8fafc',
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
    emptyText: {
        color: '#475569',
        fontSize: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#0f766e',
        borderRadius: 10,
        marginTop: 16,
        paddingHorizontal: 18,
        paddingVertical: 11,
    },
    retryText: {
        color: '#ffffff',
        fontWeight: '700',
    },
});

function RetrieveSavedProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const { language, t } = useLanguage()

    const showSavedProducts = () => {
        setIsLoading(true)
        setHasError(false)
        try {
            logic.retrieveUserProductSaved()
                .then(products => {
                    setProducts(products)
                })
                .catch(error => {
                    console.error(error)
                    setHasError(true)
                })
                .finally(() => setIsLoading(false))
        } catch (error) {
            console.error(error)
            setHasError(true)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        showSavedProducts()
    }, [])

    if (isLoading || hasError || products.length === 0) {
        return (
            <View style={styles.centeredContainer}>
                {isLoading ? (
                    <>
                        <ActivityIndicator size='large' color='#0f766e' />
                        <Text style={styles.emptyText}>{t('Loading products…')}</Text>
                    </>
                ) : hasError ? (
                    <>
                        <Text style={styles.emptyText}>{t('There was a problem loading your saved products.')}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={showSavedProducts} accessibilityRole='button'>
                            <Text style={styles.retryText}>{t('Try again')}</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.emptyText}>{t('You have no saved products yet.')}</Text>
                    </>
                )}
            </View>
        );
    }

    return (
        <View>
            <ScrollView accessibilityLabel={t('Saved products')}>
                {products.map(product => {
                    const formattedPrice = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-IE', {
                        style: 'currency',
                        currency: 'EUR',
                    }).format(product.price)
                    return <View key={product.id} style={styles.productContainer} >
                        <ScrollView horizontal style={styles.imagesScrollViewContainer}>

                            {product.images.map((image, index) => (
                                <Image key={index} source={{ uri: 'data:image/png;base64,' + image }} style={styles.image} onError={(error) => console.error('Error loading image:', error)} accessibilityLabel={t('Product image {number}', { number: index + 1 })} />
                            ))}

                        </ScrollView>
                        <View >
                            <Text style={styles.dateText}>{product.date ? utils.formatDate(new Date(product.date)) : ''}</Text>
                            <Text style={styles.titleText}>{product.title}</Text>
                            <Text style={styles.brandText}>{product.brand}</Text>
                            <Text style={styles.priceText}>{formattedPrice}</Text>
                            <Text style={styles.stateText}>{t('State: {state}', { state: t(product.state === 'new' ? 'New' : 'Used') })}</Text>
                            <Text style={styles.stockText}>{t('Availability: {count} in stock', { count: product.stock })}</Text>
                            <Text style={styles.descriptionText}>{product.description}</Text>
                        </View>
                    </View>

                })}
            </ScrollView >
        </View>
    )
}

export default RetrieveSavedProducts
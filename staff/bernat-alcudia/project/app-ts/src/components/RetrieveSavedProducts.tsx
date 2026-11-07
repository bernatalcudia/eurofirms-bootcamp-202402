import logic from '../logic';
import React, { useEffect, useState } from 'react';
import { utils } from 'com'
import { ActivityIndicator, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import type { Product } from '../types/models'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import createRetrieveSavedProductsStyles from '../styles/RetrieveSavedProducts.styles'

function RetrieveSavedProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const { language, t } = useLanguage()
    const { colors } = useTheme()
    const styles = createRetrieveSavedProductsStyles(colors)

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
                        <ActivityIndicator size='large' color={colors.primary} />
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
import logic from '../logic';
import { productImageUri } from '../logic/productImageUri';
import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { utils } from 'com'
import { ActivityIndicator, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import type { Product } from '../types/models'
import type { TabNavigation } from '../types/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import createRetrieveSavedProductsStyles from '../styles/RetrieveSavedProducts.styles'

function RetrieveSavedProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const { language, t } = useLanguage()
    const { colors } = useTheme()
    const navigation = useNavigation<TabNavigation>()
    const styles = createRetrieveSavedProductsStyles(colors)

    const showSavedProducts = useCallback(() => {
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
    }, [])

    useFocusEffect(useCallback(() => {
        showSavedProducts()
    }, [showSavedProducts]))

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
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.list} accessibilityLabel={t('Saved products')}>
                {products.map(product => {
                    const formattedPrice = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-IE', {
                        style: 'currency',
                        currency: 'EUR',
                    }).format(product.price)
                    return <TouchableOpacity key={product.id} style={styles.productContainer} onPress={() => navigation.navigate('ProductDetail', { id: product.id })} accessibilityRole='button' accessibilityLabel={t('View details for product {title}', { title: product.title })}>
                        {product.images[0] && <Image source={{ uri: productImageUri(product.images[0]) }} style={styles.image} onError={(error) => console.error('Error loading image:', error)} accessibilityLabel={t('Product image {number}', { number: 1 })} />}
                        <View >
                            <Text style={styles.dateText}>{product.date ? utils.formatDate(new Date(product.date)) : ''}</Text>
                            <Text style={styles.titleText}>{product.title}</Text>
                            <Text style={styles.brandText}>{product.brand}</Text>
                            <Text style={styles.priceText}>{formattedPrice}</Text>
                            <Text style={styles.stateText}>{t('State: {state}', { state: t(product.state === 'new' ? 'New' : 'Used') })}</Text>
                            <Text style={styles.stockText}>{t('Availability: {count} in stock', { count: product.stock })}</Text>
                            <Text style={styles.descriptionText}>{product.description}</Text>
                        </View>
                    </TouchableOpacity>

                })}
            </ScrollView >
        </View>
    )
}

export default RetrieveSavedProducts
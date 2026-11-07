import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Alert, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import logic from '../logic';
import { utils } from 'com'
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { Product } from '../types/models'
import type { ProductRoute, RootNavigation } from '../types/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import createProductDetailStyles from '../styles/ProductDetail.styles'

function ProductDetail() {
    const [product, setProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState(false)

    const navigation = useNavigation<RootNavigation>()

    const route = useRoute<ProductRoute>()

    const { id: productId } = route.params
    const { language, t } = useLanguage()
    const { colors } = useTheme()
    const styles = createProductDetailStyles(colors)

    const handleDeleteProduct = () => {
        const deleteProduct = () => {
            try {
                logic.removeProduct(productId)
                    .then(() => navigation.navigate('tabs'))
                    .catch(error => {
                        console.error(error)

                        alert(error instanceof Error ? error.message : t('Unexpected error'))
                    })
            } catch (error) {
                console.error(error)

                alert(error instanceof Error ? error.message : t('Unexpected error'))
            }
        }

        if (Platform.OS === 'web') {
            if (globalThis.confirm(t('Are you sure you want to delete this product?'))) {
                deleteProduct()
            }

            return
        }

        Alert.alert(t('Delete product'), t('Are you sure you want to delete this product?'), [
            {
                text: t('Cancel'),
                style: 'cancel',
            },
            {
                text: t('Delete'),
                onPress: deleteProduct,
                style: 'destructive',
            },
        ])
    }

    const handleModifyProductDetail = () => {
        navigation.navigate('ModifyProduct', { id: productId })
    }

    const showProductDetails = () => {
        setIsLoading(true)
        setLoadError(false)
        try {
            logic.retrieveProductDetails(productId)
                .then(product => {
                    setProduct(product)
                })
                .catch(error => {
                    console.error(error)
                    setLoadError(true)
                })
                .finally(() => setIsLoading(false))
        } catch (error) {
            console.error(error)
            setLoadError(true)
            setIsLoading(false)
        }
    }


    useEffect(() => {
        showProductDetails()
    }, [productId])

    if (isLoading) {
        return (
            <View style={styles.loadingContainer} accessible={true} accessibilityLabel={t('Loading product details')} accessibilityRole='alert' >
                <ActivityIndicator size='large' color={colors.primary} />
                <Text style={styles.loadingText}>{t('Loading product details…')}</Text>
            </View>
        );
    }

    if (loadError || !product) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>{t('Could not load product details.')}</Text>
                <TouchableOpacity style={styles.actionButton} onPress={showProductDetails} accessibilityRole='button'>
                    <Text>{t('Retry')}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const isAuthor = product.own || product.author === logic.getLoggedInUserId()
    const formattedPrice = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-IE', {
        style: 'currency',
        currency: 'EUR',
    }).format(product.price)

    return (
        <View style={styles.mainContainer} accessible={true}>
            <ScrollView accessibilityLabel={t('Product details for {title}', { title: product.title })}>
                <View style={styles.productCard}>
                    <ScrollView horizontal style={styles.imageScrollView} accessibilityLabel={t('Product images')}>

                        <View style={styles.imageContainer} key={product.id} accessible={true} accessibilityLabel={t('Product image gallery')}>
                            {product.images.map((image, index) => (
                                <Image key={index} source={{ uri: 'data:image/png;base64,' + image }} style={styles.productImage} resizeMode='cover' onError={(error) => console.error('Error loading image:', error)} accessible={true} accessibilityLabel={t('Product image {number} of {count}: {title}', { number: index + 1, count: product.images.length, title: product.title })} accessibilityRole='image' />
                            ))}
                        </View>
                    </ScrollView>

                    <View style={styles.infoContainer}>
                        <Text style={styles.dateText} accessible={true} accessibilityLabel={t('Last updated: {date}', { date: product.date ? utils.formatDate(new Date(product.date)) : '' })}>{t('Last updated: {date}', { date: product.date ? utils.formatDate(new Date(product.date)) : '' })}</Text>
                        <Text style={styles.titleText} accessible={true} accessibilityRole='header' accessibilityLabel={t('Product name: {title}', { title: product.title })}>{product.title}</Text>
                        <Text style={styles.brandText} accessible={true} accessibilityLabel={t('Brand: {brand}', { brand: product.brand })}>{product.brand}</Text>
                        <Text style={styles.priceText} accessible={true} accessibilityLabel={t('Price: {price} euros', { price: product.price })} accessibilityValue={{ text: t('Price: {price} euros', { price: product.price }) }}>{formattedPrice}</Text>
                        <Text style={styles.stateText} accessible={true} accessibilityLabel={t('State: {state}', { state: t(product.state === 'new' ? 'New' : 'Used') })}>{t('State: {state}', { state: t(product.state === 'new' ? 'New' : 'Used') })}</Text>
                        <Text style={styles.stockText} accessible={true} accessibilityLabel={product.stock > 0 ? t('Availability: {count} in stock', { count: product.stock }) : t('Out of stock')} accessibilityValue={{ text: product.stock > 0 ? t('Availability: {count} in stock', { count: product.stock }) : t('Out of stock') }}>{product.stock > 0 ? t('Availability: {count} in stock', { count: product.stock }) : t('Out of stock')}</Text>
                        <Text style={styles.descriptionText} accessible={true} accessibilityLabel={t('Product description: {description}', { description: product.description })}>{product.description}</Text>
                    </View>

                    {isAuthor && (
                        <View style={styles.actionButtonsContainer}>
                            <TouchableOpacity style={styles.actionButton} onPress={handleModifyProductDetail} accessible={true} accessibilityLabel={t('Modify product')} accessibilityHint={t('Modify product')} accessibilityRole='button'>
                                <MaterialCommunityIcons style={styles.modifyIcon} name='pencil' />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={handleDeleteProduct} accessible={true} accessibilityLabel={t('Delete product')} accessibilityHint={t('Delete product')} accessibilityRole='button'>
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
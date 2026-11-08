import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Alert, Platform, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
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
    const [isStartingChat, setIsStartingChat] = useState(false)
    const [failedImages, setFailedImages] = useState<number[]>([])

    const navigation = useNavigation<RootNavigation>()

    const route = useRoute<ProductRoute>()

    const { id: productId } = route.params
    const { language, t } = useLanguage()
    const { colors } = useTheme()
    const { width: viewportWidth } = useWindowDimensions()
    const galleryWidth = Math.min(viewportWidth - 64, 720)
    const galleryHeight = Math.min(Math.max(galleryWidth * 0.72, 220), 520)
    const styles = createProductDetailStyles(colors, galleryWidth, galleryHeight)

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

    const handleContactSeller = async () => {
        if (isStartingChat) return
        setIsStartingChat(true)
        try {
            const chat = await logic.startChat(productId)
            navigation.navigate('ChatConversation', { chatId: chat.id })
        } catch (error) {
            console.error('Could not start conversation:', error)
            Alert.alert(t('Error'), t('Could not start a conversation. Please try again.'))
        } finally {
            setIsStartingChat(false)
        }
    }

    const showProductDetails = () => {
        setIsLoading(true)
        setLoadError(false)
        try {
            logic.retrieveProductDetails(productId)
                .then(product => {
                    setProduct(product)
                    setFailedImages([])
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
            <ScrollView contentContainerStyle={styles.scrollContent} accessibilityLabel={t('Product details for {title}', { title: product.title })}>
                <View style={styles.productCard}>
                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageScrollView} contentContainerStyle={styles.imageGallery} accessibilityLabel={t('Product images')}>
                        {product.images.length > 0 ? product.images.map((image, index) => (
                            <View key={`${product.id}-${index}`} style={styles.imageSlide}>
                                {failedImages.includes(index) ? (
                                    <View style={[styles.imageSlide, styles.imagePlaceholder]}>
                                        <MaterialCommunityIcons name='image-off-outline' size={46} color={colors.mutedText} />
                                        <Text style={styles.imagePlaceholderText}>{t('No image available for this product.')}</Text>
                                    </View>
                                ) : (
                                    <Image
                                        source={{ uri: 'data:image/png;base64,' + image }}
                                        style={styles.productImage}
                                        resizeMode='cover'
                                        onError={error => {
                                            console.error('Error loading product image:', error.nativeEvent.error)
                                            setFailedImages(current => current.includes(index) ? current : [...current, index])
                                        }}
                                        accessible={true}
                                        accessibilityLabel={t('Product image {number} of {count}: {title}', { number: index + 1, count: product.images.length, title: product.title })}
                                        accessibilityRole='image'
                                    />
                                )}
                                {product.images.length > 1 && (
                                    <Text style={styles.imageCount}>{t('{current} of {total}', { current: index + 1, total: product.images.length })}</Text>
                                )}
                            </View>
                        )) : (
                            <View style={[styles.imageSlide, styles.imagePlaceholder]}>
                                <MaterialCommunityIcons name='image-off-outline' size={46} color={colors.mutedText} />
                                <Text style={styles.imagePlaceholderText}>{t('No image available for this product.')}</Text>
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.infoContainer}>
                        <Text style={styles.dateText} accessible={true} accessibilityLabel={t('Last updated: {date}', { date: product.date ? utils.formatDate(new Date(product.date)) : '' })}>{t('Last updated: {date}', { date: product.date ? utils.formatDate(new Date(product.date)) : '' })}</Text>
                        <Text style={styles.titleText} accessible={true} accessibilityRole='header' accessibilityLabel={t('Product name: {title}', { title: product.title })}>{product.title}</Text>
                        <Text style={styles.brandText} accessible={true} accessibilityLabel={t('Brand: {brand}', { brand: product.brand })}>{product.brand}</Text>
                        <Text style={styles.priceText} accessible={true} accessibilityLabel={t('Price: {price} euros', { price: product.price })} accessibilityValue={{ text: t('Price: {price} euros', { price: product.price }) }}>{formattedPrice}</Text>
                        <View style={styles.productMeta}>
                            <Text style={styles.stateBadge} accessibilityLabel={t('State: {state}', { state: t(product.state === 'new' ? 'New' : 'Used') })}>
                                {t(product.state === 'new' ? 'New' : 'Used')}
                            </Text>
                            <Text style={styles.stockText} accessible={true} accessibilityLabel={product.stock > 0 ? t('Availability: {count} in stock', { count: product.stock }) : t('Out of stock')} accessibilityValue={{ text: product.stock > 0 ? t('Availability: {count} in stock', { count: product.stock }) : t('Out of stock') }}>
                                {product.stock > 0 ? t('Availability: {count} in stock', { count: product.stock }) : t('Out of stock')}
                            </Text>
                        </View>
                        <View style={styles.descriptionSection}>
                            <Text style={styles.sectionTitle}>{t('Description')}</Text>
                            <Text style={styles.descriptionText} accessible={true} accessibilityLabel={t('Product description: {description}', { description: product.description })}>{product.description || t('No description provided.')}</Text>
                        </View>
                    </View>

                    {isAuthor && (
                        <View style={styles.actionButtonsContainer}>
                            <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={handleModifyProductDetail} accessible={true} accessibilityLabel={t('Modify product')} accessibilityHint={t('Modify product')} accessibilityRole='button'>
                                <MaterialCommunityIcons style={styles.modifyIcon} name='pencil' />
                                <Text style={styles.editButtonText}>{t('Modify product')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDeleteProduct} accessible={true} accessibilityLabel={t('Delete product')} accessibilityHint={t('Delete product')} accessibilityRole='button'>
                                <MaterialCommunityIcons style={styles.deleteIcon} name='trash-can-outline' />
                                <Text style={styles.deleteButtonText}>{t('Delete product')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {!isAuthor && (
                        <TouchableOpacity
                            style={[styles.contactSellerButton, isStartingChat && { opacity: 0.6 }]}
                            onPress={() => void handleContactSeller()}
                            disabled={isStartingChat}
                            accessibilityRole='button'
                            accessibilityLabel={t('Message seller')}
                        >
                            <Text style={styles.contactSellerText}>
                                {isStartingChat ? t('Loading…') : t('Message seller')}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView >
        </View>
    )
};

export default ProductDetail
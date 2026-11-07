import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { errors } from 'com'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import logic from '../logic';

import Comments from './Comments';
import type { Product, User } from '../types/models'
import type { TabNavigation } from '../types/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import createProductsStyles from '../styles/Products.styles'

interface ProductsProps {
    searchQuery: string
}

function Products({ searchQuery }: ProductsProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [user, setUser] = useState<User>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState(false)

    const [commentsProductId, setCommentsProductId] = useState('')
    const [viewComments, setViewComments] = useState(false)

    const navigation = useNavigation<TabNavigation>()
    const { language, t } = useLanguage()
    const { colors } = useTheme()



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
                    alert(error instanceof errors.ValidationError
                        ? t('Please correct the highlighted information and try again.')
                        : t('Something went wrong. Please try again.'))
                })

        } catch (error) {
            console.error(error)
            alert(error instanceof errors.ValidationError
                ? t('Please correct the highlighted information and try again.')
                : t('Something went wrong. Please try again.'))
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

                    alert(t('Something went wrong. Please try again.'))
                })
        } catch (error) {
            console.error(error)

            alert(t('Something went wrong. Please try again.'))
        }
    }
    const handleToggleLikeProduct = (productId: string) => {
        try {
            logic.toggleLikeProduct(productId)
                .then(() => refreshProducts())
                .catch(error => {
                    console.error(error)

                    alert(t('Something went wrong. Please try again.'))
                })
        } catch (error) {
            console.error(error)

            alert(t('Something went wrong. Please try again.'))
        }
    }

    const handleCommentCreated = () => {
        refreshProducts()
    }

    const handleCommentDeleted = () => {
        refreshProducts()
    }

    const searchProducts = (searchQuery: string) => {
        setIsLoading(true)
        setLoadError(false)
        try {
            logic.searchProducts(searchQuery) //I return the products searched
                .then(products => {
                    setProducts(products)
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

    const refreshProducts = () => {
        setIsLoading(true)
        setLoadError(false)
        try {
            logic.retrieveProducts() //I return the products
                .then(products => setProducts(products))
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

    useFocusEffect(useCallback(() => {
        searchQuery === '' ? refreshProducts() : searchProducts(searchQuery)
    }, [searchQuery]))



    const styles = createProductsStyles(colors)

    return (
        <View style={styles.mainContainer}>

            <ScrollView contentContainerStyle={products.length === 0 ? styles.emptyState : undefined}>

                {isLoading ? (
                    <View style={styles.emptyState} accessibilityRole='progressbar'>
                        <ActivityIndicator size='large' color={colors.primary} />
                        <Text style={styles.emptyMessage}>{t('Loading products…')}</Text>
                    </View>
                ) : loadError ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>{t('Could not load products.')}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={searchQuery ? () => searchProducts(searchQuery) : refreshProducts} accessibilityRole='button'>
                            <Text style={styles.retryText}>{t('Retry')}</Text>
                        </TouchableOpacity>
                    </View>
                ) : products.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name='shopping-outline' size={46} color={colors.mutedText} />
                        <Text style={styles.emptyTitle}>{searchQuery ? t('No products found') : t('No products yet')}</Text>
                        <Text style={styles.emptyMessage}>{searchQuery ? t('Try another search or clear the search field.') : t('Be the first to share something with the community.')}</Text>
                    </View>
                ) : products.map(product => {
                    const isLiked = product.liked ?? product.likes?.includes(logic.getLoggedInUserId()) ?? false
                    const isSaved = user?.saved?.includes(product.id) ?? false
                    const likeCount = product.likeCount ?? product.likes?.length ?? 0
                    const accessibilityImageLabel = product.images[0] ? t('Product image of {title}', { title: product.title }) : t('No image available for this product.')
                    const formattedPrice = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-IE', {
                        style: 'currency',
                        currency: 'EUR',
                    }).format(product.price)

                    return (
                        <View style={styles.productContainer} key={product.id} >

                            <Image style={styles.productImage} resizeMode='cover' source={{ uri: 'data:image/png;base64,' + product.images[0] }} onError={(error) => console.error('Error loading image:', error)} accessibilityLabel={accessibilityImageLabel} />

                            <View style={styles.productInfoContainer} key={product.id}>

                                <TouchableOpacity onPress={() => handleProductDetail(product.id)} accessibilityLabel={t('View details for product {title}', { title: product.title })} accessibilityRole='button'>
                                    <Text style={styles.productTitle} >{product.title}</Text>
                                </TouchableOpacity>
                                <Text style={styles.productBrand} accessibilityLabel={`${t('Brand')}: ${product.brand}`}>{product.brand}</Text>
                                <Text style={styles.productPrice} accessibilityLabel={t('Price: {price} euros', { price: product.price })}>{formattedPrice}</Text>
                                <Text style={styles.productState} accessibilityLabel={t('State: {state}', { state: t(product.state === 'new' ? 'New' : 'Used') })}>{t('State: {state}', { state: t(product.state === 'new' ? 'New' : 'Used') })}</Text>

                            </View>
                            <View style={styles.actionsContainer}>
                                <View style={styles.likeContainer}>
                                    <TouchableOpacity style={isLiked ? styles.button : styles.buttonPressIn} onPress={() => handleToggleLikeProduct(product.id)} accessibilityLabel={t(isLiked ? 'Unlike {title}. Currently has {count} likes.' : 'Like {title}. Currently has {count} likes.', { title: product.title, count: likeCount })} accessibilityRole='button' accessibilityState={{ checked: isLiked }}>
                                        <MaterialCommunityIcons name={isLiked ? 'heart' : 'heart-outline'} size={25} color={colors.danger} />
                                    </TouchableOpacity>
                                    <Text style={styles.likeCountText} accessibilityLabel={t('{count} likes', { count: likeCount })}>{likeCount}</Text>
                                </View>
                                <View style={styles.commentsContainer} accessibilityLabel={product.commentCount === 1
                                    ? t('View comments for product {title}. Has 1 comment.', { title: product.title })
                                    : t('View comments for product {title}. Has {count} comments.', { title: product.title, count: product.commentCount ?? 0 })} accessibilityRole='button'>
                                    <TouchableOpacity onPress={() => handleShowProductComments(product.id)}>
                                        <MaterialCommunityIcons name='comment-multiple-outline' size={25} color={colors.primary} />
                                    </TouchableOpacity>
                                    <Text style={styles.commentsCountText} accessibilityLabel={product.commentCount === 1 ? t('1 comment') : t('{count} comments', { count: product.commentCount ?? 0 })}>{product.commentCount ?? 0}</Text>
                                </View>
                                <TouchableOpacity style={isSaved ? styles.button : styles.buttonPressIn} onPress={() => handleToggleSavedProduct(product.id)} accessibilityLabel={t(isSaved ? 'Unsave {title}' : 'Save {title}', { title: product.title })} accessibilityRole='button' accessibilityState={{ checked: isSaved }} >
                                    <MaterialCommunityIcons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={25} color={colors.accent} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                })}
            </ScrollView >

            {/* OVERLAY */}

            {
                commentsProductId.length > 0 && (
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
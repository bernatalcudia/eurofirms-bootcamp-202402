import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
import type { RadioButtonProps } from 'react-native-radio-buttons-group'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import logic from '../logic';
import type { ProductRoute, RootNavigation } from '../types/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import createModifyProductStyles from '../styles/ModifyProduct.styles'

function ModifyProduct() {
    const [images, setImages] = useState<string[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [brand, setBrand] = useState('')
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState(false)
    const [formError, setFormError] = useState('')

    const [selectedId, setSelectedId] = useState('');
    const { t } = useLanguage()
    const { colors } = useTheme()
    const styles = createModifyProductStyles(colors)

    const radioButtons = useMemo<RadioButtonProps[]>(() => ([
        {
            id: '1',
            label: t('New'),
            value: 'new',
            selected: false,
            color: colors.primary,
            borderColor: colors.primary,
            labelStyle: styles.radioLabel,
        },
        {
            id: '2',
            label: t('Used'),
            value: 'used',
            selected: false,
            color: colors.primary,
            borderColor: colors.primary,
            labelStyle: styles.radioLabel,
        }
    ]), [colors.primary, colors.text, t]);

    const selectedRadioButton = radioButtons.find(button => button.id === selectedId)

    const route = useRoute<ProductRoute>()

    const { id: productId } = route.params

    const navigation = useNavigation<RootNavigation>()


    const showProductDetails = useCallback(async () => {
        setIsLoading(true)
        setLoadError(false)
        try {
            const product = await logic.retrieveProductDetails(productId)
            setImages(product.images)
            setTitle(product.title)
            setDescription(product.description)
            setBrand(product.brand)
            setPrice(product.price.toString())
            setSelectedId(product.state === 'new' ? '1' : '2')
            setStock(product.stock.toString())
        } catch (error) {
            console.error('Could not load product for editing:', error)
            setLoadError(true)
        } finally {
            setIsLoading(false)
        }
    }, [productId])

    useEffect(() => {
        void showProductDetails()
    }, [showProductDetails])

    const selectImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

            if (status !== 'granted') {
                Alert.alert(t('Permission denied'), t('Grant access to your photo library to select images.'))
                return
            }

            const result = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, mediaTypes: ImagePicker.MediaTypeOptions.Images, base64: true })
            if (result.canceled) return
            if (result.assets && result.assets.length > 0) {
                const base64Images = result.assets.map(asset => asset.base64).filter((image): image is string => image !== null)
                if (images.length + base64Images.length > 10) {
                    Alert.alert(t('Add photos to continue'), t('You can select up to 10 photos.'))
                    return
                }
                setImages(prevImages => [...prevImages, ...base64Images])
                setFormError('')
            } else {
                Alert.alert(t('No images selected'), t('Image selection failed. Please try again.'))
            }
        } catch (error) {
            console.error('Error selecting image', error)
            Alert.alert(t('Error'), t('Image selection failed. Please try again.'))
        }
    }


    const takePicture = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync()

            if (status !== 'granted') {
                Alert.alert(
                    t('Permission denied'),
                    t('Grant access to your camera to take a picture.')
                )
                return
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                base64: true,
            })

            if (result.canceled) {
                return
            }

            if (result.assets && result.assets.length > 0) {
                const base64Images = result.assets.map(asset => asset.base64).filter((image): image is string => image !== null)
                if (images.length + base64Images.length > 10) {
                    Alert.alert(t('Add photos to continue'), t('You can select up to 10 photos.'))
                    return
                }
                setImages(prevImages => [...prevImages, ...base64Images])
                setFormError('')
            } else {
                Alert.alert(t('No picture taken'), t('Could not take a picture. Please try again.'))
            }

        } catch (error) {
            console.error('Error taking picture:', error)
            Alert.alert(
                t('Error'),
                t('Could not take a picture. Please try again.')
            )
        }
    }


    const handleModifyProduct = () => {
        if (isSubmitting || isLoading) return
        if (images.length === 0) {
            setFormError(t('Add at least one product photo to continue.'))
            return
        }
        if (!title.trim()) {
            setFormError(t('Enter a product title to continue.'))
            return
        }
        if (!brand.trim()) {
            setFormError(t('Enter a product brand to continue.'))
            return
        }
        const numericPrice = Number(price.replace(',', '.'))
        if (!price.trim() || !Number.isFinite(numericPrice) || numericPrice < 0) {
            setFormError(t('Enter a valid product price.'))
            return
        }
        const numericStock = Number(stock)
        if (!stock.trim() || !Number.isFinite(numericStock) || numericStock < 0) {
            setFormError(t('Enter a valid stock quantity.'))
            return
        }
        if (!selectedRadioButton || (selectedRadioButton.value !== 'new' && selectedRadioButton.value !== 'used')) {
            setFormError(t('Select a product condition.'))
            return
        }
        setFormError('')
        setIsSubmitting(true)
        logic.modifyProduct(productId, images, title.trim(), description, brand.trim(), numericPrice, selectedRadioButton.value, numericStock)
            .then(() => navigation.navigate('ProductDetail', { id: productId }))
            .catch(error => {
                console.error('Could not update product:', error)
                setFormError(t('Please check product details and try again.'))
            })
            .finally(() => setIsSubmitting(false))
    }

    const handleDeleteImage = (imageIndex: number) => {
        setImages(currentImages => currentImages.filter((_image, index) => index !== imageIndex))
        setFormError('')
    }

    if (isLoading) {
        return (
            <View style={styles.statusContainer} accessibilityRole='progressbar'>
                <ActivityIndicator size='large' color={colors.primary} />
                <Text style={styles.statusText}>{t('Loading product details…')}</Text>
            </View>
        )
    }

    if (loadError) {
        return (
            <View style={styles.statusContainer}>
                <Text style={styles.statusText}>{t('Could not load this product.')}</Text>
                <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={() => void showProductDetails()} accessibilityRole='button'>
                    <Text style={styles.buttonPrimaryText}>{t('Retry')}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} accessibilityLabel={t('Modify product scroll view')} accessible={true}>
                <View style={styles.container}>
                    <Text style={styles.pageTitle} accessibilityRole='header'>{t('Modify product')}</Text>
                    <Text style={styles.introText}>{t('Update the photos and details buyers see.')}</Text>
                    {formError ? <Text style={styles.formError} accessibilityRole='alert' accessibilityLiveRegion='polite'>{formError}</Text> : null}

                    <Text style={styles.sectionTitle}>{t('Photos')}</Text>
                    <Text style={styles.helperText}>{t('Add at least one photo. You can add up to 10.')}</Text>
                    <View style={styles.photoActionsContainer}>
                        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={selectImage} accessibilityRole='button' accessibilityLabel={t('Add photos from gallery')} accessibilityHint={t('Add photos from gallery')}>
                            <MaterialCommunityIcons name='image-plus' size={20} color={styles.buttonOutlineText.color} style={styles.buttonIcon} accessibilityElementsHidden={true}></MaterialCommunityIcons>
                            <Text style={styles.buttonOutlineText}>{t('Upload photos')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={takePicture} accessibilityRole='button' accessibilityLabel={t('Take a new picture')} accessibilityHint={t('Take a new picture')}>
                            <MaterialCommunityIcons name='camera-plus' size={20} color={styles.buttonOutlineText.color} style={styles.buttonIcon} accessibilityElementsHidden={true} ></MaterialCommunityIcons>
                            <Text style={styles.buttonOutlineText}>{t('Take picture')}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.galleryPreview} accessibilityLabel={t('Product images')}>
                        {images.length > 0 ? images.map((image, index) => (
                            <View key={`${index}-${image.slice(0, 12)}`} style={styles.imageContainer}>
                                <Image source={{ uri: 'data:image/png;base64,' + image }} style={styles.imageThumbnail} onError={error => console.error('Error loading product image:', error.nativeEvent.error)} accessibilityLabel={t('Product image {number}', { number: index + 1 })} />
                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteImage(index)} accessibilityRole='button' accessibilityLabel={t('Remove image {number}', { number: index + 1 })}>
                                    <MaterialCommunityIcons name='close-circle' size={25} color={colors.text} style={styles.deleteIconBackground} accessibilityElementsHidden={true} />
                                </TouchableOpacity>
                            </View>
                        )) : (
                            <View style={styles.placeholderContainer}>
                                <MaterialCommunityIcons name='image-multiple-outline' size={42} color={colors.mutedText} />
                                <Text style={styles.placeholderText}>{t('No images selected yet')}</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.sectionTitle} accessibilityRole='header'>{t('Details')}</Text>

                    <Text style={styles.label} accessibilityLabel={t('Product title input')}>{t('Title')}</Text>
                    <TextInput style={styles.input} value={title} onChangeText={value => {
                        setTitle(value)
                        setFormError('')
                    }} placeholder={t('Enter product title')} placeholderTextColor={colors.mutedText} accessibilityLabel={t('Product title input')} accessibilityHint={t('Enter product title')} />

                    <Text style={styles.label} accessibilityLabel={t('Product brand input')}>{t('Brand')}</Text>
                    <TextInput style={styles.input} value={brand} onChangeText={value => {
                        setBrand(value)
                        setFormError('')
                    }} placeholder={t('Enter product brand')} placeholderTextColor={colors.mutedText} accessibilityLabel={t('Product brand input')} accessibilityHint={t('Enter product brand')} />

                    <Text style={styles.label} accessibilityLabel={t('Product price input')}>{t('Price')}</Text>
                    <TextInput style={styles.input} keyboardType='decimal-pad' value={price} onChangeText={value => {
                        setPrice(value.replace(',', '.'))
                        setFormError('')
                    }} placeholder={t('Enter price')} placeholderTextColor={colors.mutedText} accessibilityLabel={t('Product price input')} accessibilityHint={t('Enter price')} />

                    <Text style={styles.label}>{t('Condition')}</Text>
                    <RadioGroup
                        containerStyle={styles.radioGroupContainer}
                        labelStyle={styles.radioLabel}
                        layout='row'
                        radioButtons={radioButtons}
                        onPress={id => {
                            setSelectedId(id)
                            setFormError('')
                        }}
                        selectedId={selectedId}
                        accessibilityLabel={t('Product condition selection')}
                    />

                    <Text style={styles.label} accessibilityLabel={t('Product stock input')}>{t('Stock')}</Text>
                    <TextInput style={styles.input} keyboardType='number-pad' value={stock} onChangeText={value => {
                        setStock(value)
                        setFormError('')
                    }} placeholder='1' placeholderTextColor={colors.mutedText} accessibilityLabel={t('Product stock input')} accessibilityHint={t('Enter stock quantity')} />

                    <Text style={styles.label} accessibilityLabel={t('Product description input')}>{t('Description')}</Text>
                    <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={value => {
                        setDescription(value)
                        setFormError('')
                    }} placeholder={t('Describe your product')} placeholderTextColor={colors.mutedText} multiline numberOfLines={4} accessibilityLabel={t('Product description input')} accessibilityHint={t('Describe your product')} />


                    <TouchableOpacity style={[styles.button, styles.buttonPrimary, styles.submitButton, isSubmitting && styles.disabledButton]} onPress={handleModifyProduct} disabled={isSubmitting} accessibilityRole='button' accessibilityLabel={t('Save changes')} accessibilityState={{ disabled: isSubmitting }}>
                        {isSubmitting ? <ActivityIndicator color={colors.onPrimary} /> : <MaterialCommunityIcons name='content-save-edit-outline' size={20} color={styles.buttonPrimaryText.color} accessibilityElementsHidden={true} />}
                        <Text style={styles.buttonPrimaryText}>{isSubmitting ? t('Loading…') : t('Save changes')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView >
        </>
    )
}

export default ModifyProduct
import React, { useEffect, useMemo, useRef, useState } from 'react'
import logic from '../logic'
import { productImageUri } from '../logic/productImageUri'
import { View, Image, TextInput, Alert, Text, TouchableOpacity, Platform } from 'react-native'
import type { ScrollViewInstance } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import RadioGroup from 'react-native-radio-buttons-group'
import * as ImagePicker from 'expo-image-picker'
import { prepareProductImages } from '../logic/productImages'
import KeyboardAwareScrollView from './KeyboardAwareScrollView'
import type { RadioButtonProps } from 'react-native-radio-buttons-group'
import type { ProductState } from '../types/models'
import type { RootNavigation } from '../types/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import createCreateProductStyles from '../styles/CreateProduct.styles'

function CreateProduct({ }) {
    const [images, setImages] = useState<string[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [brand, setBrand] = useState('')
    const [price, setPrice] = useState('')
    const [state, setState] = useState<ProductState | null>(null)
    const [stock, setStock] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState('')
    const scrollRef = useRef<ScrollViewInstance>(null)

    useEffect(() => {
        if (formError) scrollRef.current?.scrollTo({ y: 0, animated: true })
    }, [formError])

    const [selectedId, setSelectedId] = useState('1')

    const navigation = useNavigation<RootNavigation>()
    const { t } = useLanguage()
    const { colors } = useTheme()
    const styles = createCreateProductStyles(colors)

    const radioButtons = useMemo<RadioButtonProps[]>(() => ([
        {
            id: '1',
            label: t('New'),
            value: 'new',
            selected: true,
            color: colors.primary,
            borderColor: colors.primary,
            labelStyle: styles.radioLabel,
            accessibilityLabel: t('New condition')
        },
        {
            id: '2',
            label: t('Used'),
            value: 'used',
            selected: false,
            color: colors.primary,
            borderColor: colors.primary,
            labelStyle: styles.radioLabel,
            accessibilityLabel: t('Used condition')
        }
    ]), [colors.primary, colors.text, t])

    const selectedRadioButton = radioButtons.find(button => button.id === selectedId)



    const selectImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

            if (status !== 'granted') {
                Alert.alert(t('Permission denied'), t('Grant access to your photo library to select images.'))
                return
            }

            const result = await ImagePicker.launchImageLibraryAsync({             allowsMultipleSelection: true, mediaTypes: ['images'] })
            if (result.canceled) return
            if (result.assets && result.assets.length > 0) {
                            const base64Images = await prepareProductImages(result.assets)
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
                            mediaTypes: ['images'],
            })

            if (result.canceled) {
                return
            }

            if (result.assets && result.assets.length > 0) {
                const base64Images = await prepareProductImages(result.assets)
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

    const handleCreateProduct = () => {
        if (isSubmitting) return
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
        const numericPrice = Number(price)
        if (!price.trim() || !Number.isFinite(numericPrice) || numericPrice < 0) {
            setFormError(t('Enter a valid product price.'))
            return
        }
        const numericStock = Number(stock)
        if (!stock.trim() || !Number.isFinite(numericStock) || numericStock < 0) {
            setFormError(t('Enter a valid stock quantity.'))
            return
        }
        setFormError('')
        setIsSubmitting(true)
        try {
            if (!selectedRadioButton) throw new Error(t('Select a product condition.'))
            if (selectedRadioButton.value !== 'new' && selectedRadioButton.value !== 'used') {
                throw new Error(t('Select a product condition.'))
            }
            logic.createProduct(images, title.trim(), description, brand.trim(), numericPrice, selectedRadioButton.value, numericStock)
                .then(() => {
                    Alert.alert(t('Create product'), t('Product created successfully.'))
                    setImages([])
                    setTitle('')
                    setDescription('')
                    setBrand('')
                    setPrice('')
                    setSelectedId('1')
                    setStock('')
                    navigation.navigate('Home')
                })
                .catch(error => {
                    console.error(error)
                    setFormError(t('Please check product details and try again.'))
                })
                .finally(() => setIsSubmitting(false))
        } catch (error) {
            console.error(error)
            setIsSubmitting(false)
            setFormError(t('Please check product details and try again.'))
        }
    }


    const handleDeleteImage = (urlImage: string) => {
        setImages(currentImages => currentImages.filter(image => image !== urlImage))
        setFormError('')
    }


    return (
        <KeyboardAwareScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
                <Text style={styles.pageTitle} accessibilityRole='header'>{t('Create product')}</Text>
                <Text style={styles.introText}>{t('Add a clear photo and a few details to help buyers.')}</Text>
                {formError ? <Text style={styles.formError} accessibilityRole='alert' accessibilityLiveRegion='polite'>{formError}</Text> : null}

                <Text style={styles.sectionTitle} accessibilityRole='header'>{t('Photos')}</Text>
                <Text style={styles.helperText}>{t('Add at least one photo. You can add up to 10.')}</Text>
                <View style={styles.photoActionsContainer}>
                    <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={selectImage} accessibilityHint={t('Add photos from gallery')} accessibilityLabel={t('Upload photos')} accessible={true} >
                        <MaterialCommunityIcons name='image-plus' size={20} color={styles.buttonOutlineText.color} style={styles.buttonIcon} accessibilityElementsHidden={true} ></MaterialCommunityIcons>
                        <Text style={styles.buttonOutlineText}>{t('Upload photos')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={takePicture} accessibilityLabel={t('Take picture')} accessibilityHint={t('Take a new picture')} accessible={true}>
                        <MaterialCommunityIcons name='camera-plus' size={20} color={styles.buttonOutlineText.color} style={styles.buttonIcon} accessibilityElementsHidden={true}></MaterialCommunityIcons>
                        <Text style={styles.buttonOutlineText}>{t('Take picture')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.galleryPreview} accessibilityLabel={t('Product images')}>
                    {images.length > 0 ? images.map((image, index) => (
                        <View key={`${index}-${image.slice(0, 12)}`} style={styles.imageContainer}>
                            <Image style={styles.imageThumbnail} source={{ uri: productImageUri(image) }} accessibilityLabel={t('Product image {number}', { number: index + 1 })}></Image>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteImage(image)} accessibilityLabel={t('Remove image {number}', { number: index + 1 })} accessibilityRole='button' accessible={true}>
                                <MaterialCommunityIcons name='close-circle' size={25} style={styles.deleteIconBackground} accessibilityElementsHidden={true} />
                            </TouchableOpacity>
                        </View>
                    ))
                        :
                        <View style={styles.placeholderContainer} accessibilityLabel={t('No images selected yet')}>
                            <MaterialCommunityIcons name='image-multiple-outline' size={46} color={colors.mutedText} />
                            <Text style={styles.placeholderText}>{t('No images selected yet')}</Text>
                            <Text style={styles.placeholderText}>{t('Add at least one photo. You can add up to 10.')}</Text>
                        </View>
                    }
                </View>


                <Text style={styles.label} nativeID='titleLabel'>{t('Title')}</Text>
                <TextInput style={styles.input} value={title} onChangeText={value => {
                    setTitle(value)
                    setFormError('')
                }} placeholder={t('Enter product title')} maxLength={120} placeholderTextColor={colors.mutedText} accessibilityLabel={t('Product title input')} accessibilityHint={t('Enter product title')} />

                <Text style={styles.label}>{t('Brand')}</Text>
                <TextInput style={styles.input} value={brand} onChangeText={value => {
                    setBrand(value)
                    setFormError('')
                }} placeholder={t('Enter product brand')} maxLength={120} placeholderTextColor={colors.mutedText} accessibilityLabel={t('Product brand input')} accessibilityHint={t('Enter product brand')} />

                <Text style={styles.label}>{t('Price')}</Text>
                <TextInput style={styles.input} keyboardType='decimal-pad' value={price} onChangeText={value => {
                    setPrice(value.replace(',', '.'))
                    setFormError('')
                }} placeholder={t('Enter price')} placeholderTextColor={colors.mutedText} accessibilityLabel={t('Product price input')} accessibilityHint={t('Enter price')} />

                <Text style={styles.label}>{t('Condition')}</Text>
                <RadioGroup containerStyle={styles.radioGroupContainer} layout='row' radioButtons={radioButtons} onPress={setSelectedId} selectedId={selectedId} accessibilityLabel={t('Product condition selection')} />

                <Text style={styles.label}>{t('Stock')}</Text>
                <TextInput style={styles.input} keyboardType='number-pad' value={stock} onChangeText={value => {
                    setStock(value)
                    setFormError('')
                }} placeholder='1' placeholderTextColor={colors.mutedText} accessibilityLabel={t('Product stock input')} accessibilityHint={t('Enter stock quantity')} />

                <Text style={styles.label}>{t('Description')}</Text>
                <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder={t('Describe your product')} maxLength={2000} placeholderTextColor={colors.mutedText} multiline numberOfLines={4} accessibilityLabel={t('Product description input')} accessibilityHint={t('Describe your product')} />

                <TouchableOpacity style={[styles.button, styles.buttonPrimary, styles.submitButton, isSubmitting && styles.disabledButton]} onPress={handleCreateProduct} disabled={isSubmitting} accessibilityLabel={t('Publish product')} accessibilityHint={t('Publish product')} accessibilityState={{ disabled: isSubmitting }} accessible={true}>
                    <Text style={styles.buttonPrimaryText}>{isSubmitting ? t('Loading…') : t('Publish product')}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView >
    )
}

export default CreateProduct
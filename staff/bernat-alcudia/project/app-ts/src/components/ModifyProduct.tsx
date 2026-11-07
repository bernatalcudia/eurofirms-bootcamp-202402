import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Image, Linking, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
import type { RadioButtonProps } from 'react-native-radio-buttons-group'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import logic from '../logic';
import type { ProductState } from '../types/models'
import type { ProductRoute, RootNavigation } from '../types/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import createModifyProductStyles from '../styles/ModifyProduct.styles'

function ModifyProduct() {
    const [images, setImages] = useState<string[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [brand, setBrand] = useState('')
    const [state, setState] = useState<ProductState | null>(null)
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [selectedId, setSelectedId] = useState('');
    const { t } = useLanguage()
    const { colors } = useTheme()
    const permissionsRequested = useRef(false)
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


    useEffect(() => {
        if (permissionsRequested.current) return
        permissionsRequested.current = true
        const requestPermissions = async () => {
            try {
                if (Platform.OS !== 'web') {
                    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()

                    const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()

                    if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
                        Alert.alert(
                            t('Permission required'),
                            t('Grant access to your camera and photo library in device settings.'),
                            [
                                {
                                    text: t('Cancel'),
                                    style: 'cancel'
                                },
                                {
                                    text: t('Open settings'),
                                    onPress: () => Linking.openSettings()
                                }
                            ],
                            { cancelable: false }
                        )
                    }
                }
            } catch (error) {
                console.error('Error requesting permissions:', error)
                Alert.alert(
                    t('Error'),
                    t('Grant access to your camera and photo library in device settings.')
                )
            }
        }

        requestPermissions()
    }, [t])

    const showProductDetails = () => {
        try {
            logic.retrieveProductDetails(productId)
                .then(product => {
                    setImages(product.images)
                    setTitle(product.title)
                    setDescription(product.description)
                    setBrand(product.brand)
                    setPrice(product.price.toString())
                    setState(product.state)
                    product.state === 'new' ? setSelectedId('1') : setSelectedId('2')

                    setStock(product.stock.toString())
                })
                .catch(error => {
                    console.error(error)

                    alert(error instanceof Error ? error.message : t('Unexpected error'))
                })
        } catch (error) {
            console.error(error)

            alert(error instanceof Error ? error.message : t('Unexpected error'))
        }
    }


    useEffect(() => {
        showProductDetails()
    }, [])

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
        if (isSubmitting) return
        setIsSubmitting(true)
        try {
            if (!selectedRadioButton || (selectedRadioButton.value !== 'new' && selectedRadioButton.value !== 'used')) {
                throw new Error(t('Select a product condition.'))
            }
            logic.modifyProduct(productId, images, title, description, brand, Number(price), selectedRadioButton.value, Number(stock))
                .then(() => {
                    alert(t('Product updated successfully.'))
                    navigation.navigate('tabs')
                })
                .catch(error => {
                    console.error(error)
                    alert(t('Please check product details and try again.'))
                })
                .finally(() => setIsSubmitting(false))
        } catch (error) {
            console.error(error)
            setIsSubmitting(false)
            alert(t('Please check product details and try again.'))
        }
    }

    const handleDeleteImage = (urlImage: string) => {
        const newImages = images.filter(image => image !== urlImage)
        setImages(newImages);
    }

    return (
        <>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} accessibilityLabel={t('Modify product scroll view')} accessible={true}>
                <View style={styles.container} accessibilityRole='header'>

                    <Text style={styles.sectionTitle}>{t('Photos')}</Text>
                    <View style={styles.photoActionsContainer}>
                        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={selectImage} accessibilityLabel={t('Add photos from gallery')} accessibilityHint={t('Add photos from gallery')}>
                            <MaterialCommunityIcons name='image-plus' size={20} color={styles.buttonOutlineText.color} style={styles.buttonIcon} accessibilityElementsHidden={true}></MaterialCommunityIcons>
                            <Text style={styles.buttonOutlineText} accessibilityRole='button'>{t('Upload photos')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={takePicture} accessibilityLabel={t('Take a new picture')} accessibilityHint={t('Take a new picture')}>
                            <MaterialCommunityIcons name='camera-plus' size={20} color={styles.buttonOutlineText.color} style={styles.buttonIcon} accessibilityElementsHidden={true} ></MaterialCommunityIcons>
                            <Text style={styles.buttonOutlineText} accessibilityRole='button'>{t('Take picture')}</Text>
                        </TouchableOpacity>
                    </View>



                    <View style={styles.galleryPreview} accessibilityLabel={t('Product images')}>

                        {images?.map((image, index, images) => (
                            <View key={index} style={styles.imageContainer}>
                                <Image key={index} source={{ uri: 'data:image/png;base64,' + image }} style={styles.imageThumbnail} onError={(error) => console.error('Error loading image:', error)} accessibilityLabel={t('Product image {number}', { number: index + 1 })} />
                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteImage(image)} accessibilityLabel={t('Remove image {number}', { number: index + 1 })} accessibilityHint={t('Remove image {number}', { number: index + 1 })}>
                                    <MaterialCommunityIcons name='close-circle' size={25} color={colors.text} style={styles.deleteIconBackground} accessibilityElementsHidden={true} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle} accessibilityRole='header'>{t('Details')}</Text>

                    <Text style={styles.label} accessibilityLabel={t('Product title input')}>{t('Title')}</Text>
                    <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder={t('Enter product title')} placeholderTextColor={colors.mutedText} accessibilityLabel={t('Product title input')} accessibilityHint={t('Enter product title')} />

                    <Text style={styles.label} accessibilityLabel={t('Product brand input')}>{t('Brand')}</Text>
                    <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder={t('Enter product brand')} placeholderTextColor={colors.mutedText} accessibilityLabel={t('Product brand input')} accessibilityHint={t('Enter product brand')} />

                    <Text style={styles.label} accessibilityLabel={t('Product price input')}>{t('Price')}</Text>
                    <TextInput style={styles.input} keyboardType='decimal-pad' value={price} onChangeText={setPrice} placeholder={t('Enter price')} placeholderTextColor={colors.mutedText} accessibilityLabel={t('Product price input')} accessibilityHint={t('Enter price')} />

                    <Text style={styles.label}>{t('Condition')}</Text>
                    <RadioGroup containerStyle={styles.radioGroupContainer} labelStyle={styles.radioLabel} layout='row' radioButtons={radioButtons} onPress={setSelectedId} selectedId={selectedId} accessibilityLabel={t('Product condition selection')} />

                    <Text style={styles.label} accessibilityLabel={t('Product stock input')}>{t('Stock')}</Text>
                    <TextInput style={styles.input} keyboardType='number-pad' value={stock} onChangeText={setStock} placeholder='1' placeholderTextColor={colors.mutedText} accessibilityLabel={t('Product stock input')} accessibilityHint={t('Enter stock quantity')} />

                    <Text style={styles.label} accessibilityLabel={t('Product description input')}>{t('Description')}</Text>
                    <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder={t('Describe your product')} placeholderTextColor={colors.mutedText} multiline numberOfLines={4} accessibilityLabel={t('Product description input')} accessibilityHint={t('Describe your product')} />


                    <TouchableOpacity style={[styles.button, styles.buttonPrimary, isSubmitting && styles.disabledButton]} onPress={handleModifyProduct} disabled={isSubmitting} accessibilityLabel={t('Save changes')} accessibilityHint={t('Save changes')} accessibilityState={{ disabled: isSubmitting }}>
                        <MaterialCommunityIcons name='content-save-edit-outline' size={20} color={styles.buttonPrimaryText.color} accessibilityElementsHidden={true} />
                        <Text style={styles.buttonPrimaryText} accessibilityRole='button'>{isSubmitting ? t('Loading…') : t('Save changes')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView >
        </>
    )
}

export default ModifyProduct
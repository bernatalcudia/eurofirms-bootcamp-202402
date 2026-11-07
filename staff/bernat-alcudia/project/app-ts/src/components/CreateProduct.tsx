import React, { useMemo, useState, useEffect, useRef } from 'react'
import logic from '../logic'
import { View, Image, StyleSheet, ScrollView, TextInput, Alert, Text, TouchableOpacity, Platform, Linking } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import RadioGroup from 'react-native-radio-buttons-group'
import * as ImagePicker from 'expo-image-picker'
import type { RadioButtonProps } from 'react-native-radio-buttons-group'
import type { ProductState } from '../types/models'
import type { RootNavigation } from '../types/navigation'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme, type ThemeColors } from '../theme/ThemeContext'


const createStyles = (colors: ThemeColors) => StyleSheet.create({
    scrollView: {
        backgroundColor: colors.background
    },
    scrollViewContent: {
        paddingBottom: 30,
    },
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 10,
        backgroundColor: colors.surface,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 20,
        marginBottom: 15,
    },
    photoActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1.5,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonPrimary: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    buttonOutline: {
        backgroundColor: colors.surface,
        borderColor: colors.primary,
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonPrimaryText: {
        color: colors.onPrimary,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonOutlineText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    galleryPreview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
        justifyContent: 'flex-start',
    },
    placeholderContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.surfaceAlt
    },
    placeholderImage: {
        width: 100,
        height: 100,
        marginBottom: 10,
        opacity: 0.7,
    },
    placeholderText: {
        color: colors.mutedText,
        fontSize: 14,
    },
    imageContainer: {
        position: 'relative',
        margin: 5,
    },
    imageThumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: colors.surfaceAlt,
        borderWidth: 1,
        borderColor: colors.border
    },
    deleteButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        borderRadius: 12,
    },
    deleteIconBackground: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        overflow: 'hidden',
    },
    label: {
        fontSize: 14,
        color: colors.mutedText,
        marginBottom: 6,
        fontWeight: '600',
    },
    input: {
        backgroundColor: colors.input,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.text,
        marginBottom: 15,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    radioGroupContainer: {
        marginBottom: 15,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 10,
    },
    radioLabel: {
        fontSize: 16,
        color: colors.text,
        lineHeight: 24,
    },
    submitButton: {
        marginTop: 30,
        marginHorizontal: 0,
        width: '100%'
    },
})

function CreateProduct({ }) {
    const [images, setImages] = useState<string[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [brand, setBrand] = useState('')
    const [price, setPrice] = useState('')
    const [state, setState] = useState<ProductState | null>(null)
    const [stock, setStock] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [selectedId, setSelectedId] = useState('1')

    const navigation = useNavigation<RootNavigation>()
    const { t } = useLanguage()
    const { colors } = useTheme()
    const styles = createStyles(colors)
    const permissionsRequested = useRef(false)

    const radioButtons = useMemo<RadioButtonProps[]>(() => ([
        {
            id: '1',
            label: t('New'),
            value: 'new',
            selected: true,
            color: colors.primary,
            borderColor: colors.primary,
            labelStyle: { color: colors.text },
            accessibilityLabel: t('New condition')
        },
        {
            id: '2',
            label: t('Used'),
            value: 'used',
            selected: false,
            color: colors.primary,
            borderColor: colors.primary,
            labelStyle: { color: colors.text },
            accessibilityLabel: t('Used condition')
        }
    ]), [colors.primary, colors.text, t])

    const selectedRadioButton = radioButtons.find(button => button.id === selectedId)



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

    const handleCreateProduct = () => {
        if (isSubmitting) return
        setIsSubmitting(true)
        try {
            if (!selectedRadioButton) throw new Error(t('Select a product condition.'))
            if (selectedRadioButton.value !== 'new' && selectedRadioButton.value !== 'used') {
                throw new Error(t('Select a product condition.'))
            }
            logic.createProduct(images, title, description, brand, Number(price), selectedRadioButton.value, Number(stock))
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
                    Alert.alert(t('Error'), t('Please check product details and try again.'))
                })
                .finally(() => setIsSubmitting(false))
        } catch (error) {
            console.error(error)
            setIsSubmitting(false)
            Alert.alert(t('Error'), t('Please check product details and try again.'))
        }
    }


    const handleDeleteImage = (urlImage: string) => {
        const newImages = images.filter(image => image !== urlImage)
        setImages(newImages)
    }


    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>


                <Text style={styles.sectionTitle} accessibilityRole='header'>{t('Photos')}</Text>
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
                        <View key={index} style={styles.imageContainer} accessible={true} accessibilityLabel={t('Product image {number}', { number: index + 1 })}>
                            <Image style={styles.imageThumbnail} source={{ uri: 'data:image/png;base64,' + image }} accessibilityLabel={t('Product image {number}', { number: index + 1 })}></Image>
                            <TouchableOpacity onPress={() => handleDeleteImage(image)} accessibilityLabel={t('Remove image {number}', { number: index + 1 })} accessibilityHint={t('Remove image {number}', { number: index + 1 })} accessible={true}>
                                <MaterialCommunityIcons name='close-circle' size={25} style={styles.deleteIconBackground} accessibilityHint={t('Close icon')} accessible={true} />
                            </TouchableOpacity>
                        </View>
                    ))
                        :
                        <View style={styles.placeholderContainer} accessibilityLabel={t('No images selected yet')}>
                            <MaterialCommunityIcons name='image-multiple-outline' size={46} color={colors.mutedText} />
                            <Text style={styles.placeholderText}>{t('No images selected yet')}</Text>
                            <Text style={styles.placeholderText}>{t('Add up to 10 photos')}</Text>
                        </View>
                    }
                </View>


                <Text style={styles.label} nativeID='titleLabel'>{t('Title')}</Text>
                <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder={t('Enter product title')} placeholderTextColor={colors.mutedText} accessibilityLabel={t('Product title input')} accessibilityHint={t('Enter product title')} />

                <Text style={styles.label}>{t('Brand')}</Text>
                <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder={t('Enter product brand')} placeholderTextColor={colors.mutedText} accessibilityLabel={t('Product brand input')} accessibilityHint={t('Enter product brand')} />

                <Text style={styles.label}>{t('Price')}</Text>
                <TextInput style={styles.input} keyboardType='decimal-pad' value={price} onChangeText={setPrice} placeholder={t('Enter price')} placeholderTextColor={colors.mutedText} accessibilityLabel={t('Product price input')} accessibilityHint={t('Enter price')} />

                <Text style={styles.label}>{t('Condition')}</Text>
                <RadioGroup containerStyle={styles.radioGroupContainer} layout='row' radioButtons={radioButtons} onPress={setSelectedId} selectedId={selectedId} accessibilityLabel={t('Product condition selection')} />

                <Text style={styles.label}>{t('Stock')}</Text>
                <TextInput style={styles.input} keyboardType='number-pad' value={stock} onChangeText={setStock} placeholder='1' placeholderTextColor={colors.mutedText} accessibilityLabel={t('Product stock input')} accessibilityHint={t('Enter stock quantity')} />

                <Text style={styles.label}>{t('Description')}</Text>
                <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder={t('Describe your product')} placeholderTextColor={colors.mutedText} multiline numberOfLines={4} accessibilityLabel={t('Product description input')} accessibilityHint={t('Describe your product')} />

                <TouchableOpacity style={[styles.button, styles.buttonPrimary, styles.submitButton, isSubmitting && { opacity: 0.65 }]} onPress={handleCreateProduct} disabled={isSubmitting} accessibilityLabel={t('Create listing')} accessibilityHint={t('Create listing')} accessibilityState={{ disabled: isSubmitting }} accessible={true}>
                    <Text style={styles.buttonPrimaryText}>{isSubmitting ? t('Loading…') : t('Create listing')}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView >
    )
}

export default CreateProduct